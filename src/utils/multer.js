import multer, { diskStorage } from "multer";
import { AppError } from './appError.js';

export const filterObject = {
    image: ['image/png', 'image/jpeg', 'image/jpg'],
    pdf: ['application/pdf'],
    video: ['video/mp4']
};

export const fileUpload = (filterArray, folderName) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads/${folderName}`);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + "-" + file.originalname);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (!filterArray.includes(file.mimetype)) {
            return cb(new AppError("Invalid file format!"), false);
        }
        return cb(null, true);
    };
    return multer({ storage, fileFilter });
};