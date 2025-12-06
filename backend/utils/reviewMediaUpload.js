import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const reviewMediaUpload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const imageTypes = /jpeg|jpg|png|webp/;
        const videoTypes = /mp4|mov|avi/;
        const extname = path.extname(file.originalname).toLowerCase();
        const mimetype = file.mimetype;

        const isImage = imageTypes.test(extname.slice(1)) && mimetype.startsWith('image/');
        const isVideo = videoTypes.test(extname.slice(1)) && mimetype.startsWith('video/');

        if (isImage || isVideo) {
            return cb(null, true);
        } else {
            cb(new Error("Only image files (jpeg, jpg, png, webp) and video files (mp4, mov, avi) are allowed!"));
        }
    },
});

export default reviewMediaUpload;
