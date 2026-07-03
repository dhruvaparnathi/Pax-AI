import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024
    },
    fileFilter: function (req, file, callback) {
        if (file.mimetype.startsWith('image')) {
            callback(null, true);
        } else {
            callback(new Error('Not an image! Please upload images only.'), false);
        }
    }
});

export default upload;