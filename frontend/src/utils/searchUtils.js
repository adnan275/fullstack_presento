export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

export const searchProducts = (query, products) => {
    if (!query || query.trim() === '') {
        return products;
    }

    const lowerQuery = query.toLowerCase().trim();

    return products.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(lowerQuery);
        const categoryMatch = product.category.toLowerCase().includes(lowerQuery);
        const badgeMatch = product.badge && product.badge.toLowerCase().includes(lowerQuery);
        const descriptionMatch = product.description && product.description.toLowerCase().includes(lowerQuery);
        const shortDescMatch = product.shortDescription && product.shortDescription.toLowerCase().includes(lowerQuery);

        return nameMatch || categoryMatch || badgeMatch || descriptionMatch || shortDescMatch;
    });
};

export const highlightMatch = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
};

export const getSuggestions = (query, products, limit = 5) => {
    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();
    const suggestions = [];
    const seen = new Set();

    products.forEach(product => {
        if (suggestions.length >= limit) return;

        if (product.name.toLowerCase().includes(lowerQuery) && !seen.has(product.name)) {
            suggestions.push({
                type: 'product',
                text: product.name,
                product: product,
                match: 'name'
            });
            seen.add(product.name);
        }
    });

    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(category => {
        if (suggestions.length >= limit) return;

        if (category.toLowerCase().includes(lowerQuery) && !seen.has(category)) {
            const count = products.filter(p => p.category === category).length;
            suggestions.push({
                type: 'category',
                text: category,
                count: count,
                match: 'category'
            });
            seen.add(category);
        }
    });

    const badges = [...new Set(products.filter(p => p.badge).map(p => p.badge))];
    badges.forEach(badge => {
        if (suggestions.length >= limit) return;

        if (badge.toLowerCase().includes(lowerQuery) && !seen.has(badge)) {
            const count = products.filter(p => p.badge === badge).length;
            suggestions.push({
                type: 'badge',
                text: badge,
                count: count,
                match: 'badge'
            });
            seen.add(badge);
        }
    });

    return suggestions;
};

export const saveSearchToHistory = (query, results) => {
    if (!query || query.trim() === '') return;

    try {
        const history = getSearchHistory();
        const topProduct = results[0] || null;

        const newSearch = {
            query: query.trim(),
            timestamp: Date.now(),
            resultCount: results.length,
            topProduct: topProduct ? {
                id: topProduct.id,
                name: topProduct.name,
                imageUrl: topProduct.imageUrl,
                category: topProduct.category
            } : null
        };

        const filteredHistory = history.filter(h => h.query.toLowerCase() !== query.toLowerCase());

        const updatedHistory = [newSearch, ...filteredHistory].slice(0, 10);

        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    } catch (error) {
        console.error('Failed to save search history:', error);
    }
};

export const getSearchHistory = () => {
    try {
        const history = localStorage.getItem('searchHistory');
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('Failed to load search history:', error);
        return [];
    }
};

export const clearSearchHistory = () => {
    try {
        localStorage.removeItem('searchHistory');
    } catch (error) {
        console.error('Failed to clear search history:', error);
    }
};
