import express from 'express';
import { addProduct, addProductsWithExcelFile, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from './product.controller.js';
import { filterObject, uploadMultipleFiles, uploadSingleFile } from '../../utils/multer.js';
import { isValid } from '../../middlewares/validation.js';
import { idSchema } from '../article/article.validation.js';
import { productSchemaValidation } from './product.validation.js';
const productRouter = express.Router();
let fieldsArray = [{ name: 'images', maxCount: 8 }];

// get all articles - create a new product
productRouter.route('/')
    .post(isValid(productSchemaValidation), uploadMultipleFiles(filterObject.image, fieldsArray, 'product'), addProduct)
    .get(getAllProducts);

// update - delete - get single product
productRouter.route('/:id')
    .delete(isValid(idSchema), deleteProduct)
    .patch(isValid(idSchema), isValid(productSchemaValidation), uploadMultipleFiles(filterObject.image, fieldsArray, 'product'), updateProduct)
    .get(isValid(idSchema), getSingleProduct);

productRouter.post('/file', uploadSingleFile(filterObject.xlsx, 'path', 'files'), addProductsWithExcelFile);

export default productRouter;