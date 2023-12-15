import multer, { diskStorage } from "multer";
import { AppError } from './appError.js';
import { catchAsync } from "./catchAsync.js";
import { Product } from "../../database/models/product.model.js";

export const filterObject = {
    image: ['image/png', 'image/jpeg', 'image/jpg'],
    xlsx: ['file/xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
};

const options = (filterArray, folderName) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {

            cb(null, `uploads/${folderName}`);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + "-" + file.originalname);
        }
    });
    async function fileFilter(req, file, cb) {
        // Check if the product exists by name
        if (req.method === 'POST') {
            const product = await Product.findOne({ name: req.body.name, barcode: req.body.barcode });
            if (product) {
                return cb(new AppError("product data already exist!", 404), false);
            }
        }

        if (!filterArray.includes(file.mimetype)) {
            return cb(new AppError("Invalid file format!"), false);
        }
        return cb(null, true);
    }

    return multer({ storage, fileFilter });
};

export const uploadSingleFile = (filterArray, fieldName, folderName) => options(filterArray, folderName).single(fieldName);

export const uploadMultipleFiles = (filterArray, arrOfFields, folderName) => options(filterArray, folderName).fields(arrOfFields);
































//////////////////////////////////////////////////////////////////////
// export const fileUpload = (filterArray, folderName) => {
//     const storage = multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, `uploads/${folderName}`);
//         },
//         filename: function (req, file, cb) {
//             const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//             cb(null, uniqueSuffix + '-' + file.originalname);
//         }
//     });
//     const fileFilter = (req, file, cb) => {
//         console.log(file);
//         if (!filterArray.includes(file.mimetype)) {
//             return cb(new AppError("Invalid file format!"), false);
//         }
//         return cb(null, true);
//     };
//     return multer({ storage, fileFilter });
// };


// export const fileUpload = (fieldName, folderName) => {
//     const storage = multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, `uploads/${folderName}`);
//         },
//         filename: function (req, file, cb) {
//             const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//             cb(null, uniqueSuffix + '-' + file.originalname);
//         }
//     });
//     function fileFilter(req, file, cb) {
//         if (file.mimetype.startsWith('image') || file.fieldname == "path") {
//             cb(null, true);
//         } else {
//             cb(new AppError('images only', 400), false);
//         }
//     }
//     const upload = multer({ storage, fileFilter });
//     return upload.single(fieldName);
// };