import Joi from 'joi';

export const productSchemaValidation = Joi.object({
    name: Joi.string(),
    barcode: Joi.number(),
    year: Joi.date(),
    quickDescription: Joi.string(),
    description: Joi.string(),
    minimumAge: Joi.number(),
    minNumberOfPlayers: Joi.number(),
    maxNumberOfPlayers: Joi.number(),
    minPlayingTime: Joi.number(),
    maxPlayingTime: Joi.number(),
    boardGameCategory: Joi.string(),
    boardGameMechanic: Joi.string(),
    boardGameSubdomain: Joi.string(),
    boardGameTheme: Joi.string(),
    rating: Joi.number(),
    boxSize: Joi.number(),
    finalPrice: Joi.number(),
    currency: Joi.string(),
    arabicName: Joi.string(),
    quickDescriptionArabic: Joi.string(),
    descriptionArabic: Joi.string(),
});
export const arraySchema = Joi.array().items(productSchemaValidation);