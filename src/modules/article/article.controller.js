import fs from 'fs';
import path from 'path';
import { Article } from '../../../database/models/articles.model.js';
import { AppError } from '../../utils/appError.js';
import APIFeatures from './../../utils/apiFeatures.js';
import { catchAsync } from './../../utils/catchAsync.js';
import { sendData } from './../../utils/sendData.js';

export const addArticle = catchAsync(async (req, res, next) => {
    const isExist = await Article.findOne({ title: req.body.title });

    if (isExist) {

        return next(new AppError("Article already exists", 400));
    }

    const newArticle = await Article.create({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        images: req.files.images.map(obj => obj.filename)
    });
    sendData(201, "success", "article added successfully", newArticle, res);
});

export const updateArticle = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) return next(new AppError("article not found", 404));

    // update the article
    article.title = req.body.title || article.title,
        article.content = req.body.content || article.content,
        article.author = req.body.author || article.author;
    // Check if there are new images to be added
    if (req.files && req.files.images) {
        article.images = req.files.images.map(obj => obj.filename);
    }
    await article.save();
    sendData(200, "success", "article updated successfully", article, res);
});



// Your deleteArticle route
export const deleteArticle = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // Find the article to get the image paths
    const article = await Article.findById(id);
    // Check if the article exists
    // we have issue here 
    if (!article) {
        return next(new AppError("article not found", 404));
        // sendData(404, "success", "article not found", undefined, res);
    }
    // Delete the article
    await Article.findByIdAndDelete(id);

    // Delete the associated images
    if (article.images && article.images.length > 0) {
        // Assuming imagePaths is an array of file paths stored in the Article model
        article.images.forEach(async (imgName) => {
            const fullPath = path.resolve('uploads', 'articles', imgName);
            // console.log('fullPath', fullPath);
            // Use fs.unlink to delete each file
            fs.unlink(fullPath, (err) => {
                if (err) {
                    console.error('Error deleting image:', err);
                } else {
                    console.log('Image deleted successfully');
                }
            });
        });
    }
    sendData(200, "success", "Article deleted successfully", undefined, res);
});

export const getAllArticles = catchAsync(async (req, res, next) => {
    const apiFeatures = new APIFeatures(Article.find({}), req.query)
        .paginate()
        .filter()
        .sort()
        .limitFields()
        .search();
    let articles = await apiFeatures.query;
    sendData(200, "success", undefined, articles, res);
});

export const getSingleArticle = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) return next(new AppError("Article not found", 404));
    sendData(200, "success", undefined, article, res);
});