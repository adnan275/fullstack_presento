import express from 'express';
import prisma from '../prisma/client.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/can-review/:productId', authenticateToken, async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        const userId = req.user.userId;

        const deliveredOrder = await prisma.order.findFirst({
            where: {
                userId: userId,
                status: 'delivered',
                items: {
                    some: {
                        productId: productId
                    }
                }
            }
        });

        const existingReview = await prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId: userId,
                    productId: productId
                }
            }
        });

        res.json({
            canReview: !!deliveredOrder,
            hasReviewed: !!existingReview,
            reviewId: existingReview?.id
        });
    } catch (error) {
        console.error('Error checking review eligibility:', error);
        res.status(500).json({ error: 'Failed to check review eligibility' });
    }
});

router.get('/product/:productId', async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);

        const reviews = await prisma.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        res.json({
            reviews,
            averageRating: avgRating,
            totalReviews: reviews.length
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

router.get('/user', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const reviews = await prisma.review.findMany({
            where: { userId },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(reviews);
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({ error: 'Failed to fetch user reviews' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.userId;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const deliveredOrder = await prisma.order.findFirst({
            where: {
                userId: userId,
                status: 'delivered',
                items: {
                    some: {
                        productId: parseInt(productId)
                    }
                }
            }
        });

        if (!deliveredOrder) {
            return res.status(403).json({ error: 'You can only review products from delivered orders' });
        }

        const review = await prisma.review.create({
            data: {
                userId,
                productId: parseInt(productId),
                rating: parseInt(rating),
                comment: comment || null
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.status(201).json(review);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'You have already reviewed this product' });
        }
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const reviewId = parseInt(req.params.id);
        const { rating, comment } = req.body;
        const userId = req.user.userId;

        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const existingReview = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!existingReview || existingReview.userId !== userId) {
            return res.status(404).json({ error: 'Review not found or unauthorized' });
        }

        const updatedReview = await prisma.review.update({
            where: { id: reviewId },
            data: {
                ...(rating && { rating: parseInt(rating) }),
                ...(comment !== undefined && { comment: comment || null })
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.json(updatedReview);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const reviewId = parseInt(req.params.id);
        const userId = req.user.userId;

        const existingReview = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!existingReview || existingReview.userId !== userId) {
            return res.status(404).json({ error: 'Review not found or unauthorized' });
        }

        await prisma.review.delete({
            where: { id: reviewId }
        });

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

export default router;
