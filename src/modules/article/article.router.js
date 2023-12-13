import express from 'express';
import { addArticle, deleteArticle, getAllArticles, getSingleArticle, updateArticle } from './article.controller.js';
import { fileUpload, filterObject } from '../../utils/multer.js';
const articleRouter = express.Router();

// get all articles - create a new article
articleRouter.route('/')
    .post(fileUpload(filterObject.image, 'articles').fields([{ name: "images", maxCount: 5 }]), addArticle)
    .get(getAllArticles);

// update - delete - get single article
articleRouter.route('/:id')
    .delete(deleteArticle)
    .patch(fileUpload(filterObject.image, 'articles').fields([{ name: "images", maxCount: 5 }]), updateArticle)
    .get(getSingleArticle);

export default articleRouter;