import express from 'express';
import { addArticle, deleteArticle, getAllArticles, getSingleArticle, updateArticle } from './article.controller.js';
import { articleSchema, idSchema } from './article.validation.js';
import { isValid } from '../../middlewares/validation.js';
import { filterObject, uploadMultipleFiles } from '../../utils/multer.js';
let fieldsArray = [{ name: 'images', maxCount: 8 }];

const articleRouter = express.Router();

// get all articles - create a new article
articleRouter.route('/')
    .post(isValid(articleSchema), uploadMultipleFiles(filterObject.image, fieldsArray, 'articles'), addArticle)
    .get(getAllArticles);

// update - delete - get single article
articleRouter.route('/:id')
    .delete(isValid(idSchema), deleteArticle)
    .patch(isValid(idSchema), isValid(articleSchema), uploadMultipleFiles(filterObject.image, fieldsArray, 'articles'), updateArticle)
    .get(isValid(idSchema), getSingleArticle);

export default articleRouter;