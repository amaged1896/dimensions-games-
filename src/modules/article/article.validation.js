import joi from 'joi';
import { isValidObjectId } from './../../middlewares/validation.js';


export const articleSchema = joi.object({
    title: joi.string(),
    content: joi.string(),
    author: joi.string(),
});


export const idSchema = joi.object({
    productId: joi.string().custom(isValidObjectId).required(),
}).required();