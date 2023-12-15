import fs from 'fs';
import path from 'path';
import { AppError } from "../../utils/appError.js";
import XLSX from 'xlsx';
import { catchAsync } from "../../utils/catchAsync.js";
import { sendData } from "../../utils/sendData.js";
import { Product } from './../../../database/models/product.model.js';
import { arraySchema } from './product.validation.js';

export const getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find();
    sendData(200, "success", undefined, products, res);
});


export const addProductsWithExcelFile = catchAsync(async (req, res, next) => {
    console.log(req.file);
    // console.log(req.files.fieldname);
    const productsFile = XLSX.readFile(req.file.path);
    const productSheet = productsFile.Sheets[productsFile.SheetNames[0]];
    // console.log(productSheet);
    let xlsxJson = XLSX.utils.sheet_to_json(productSheet);
    // here
    // const { error } = arraySchema.validate(xlsxJson, { abortEarly: false });
    // if (!error) {
    // if (req.body.name && req.body.course) {
    if (xlsxJson) {
        await Product.insertMany(xlsxJson);
        return res.json({ message: "success", numberOfAddedProducts: xlsxJson.length, products: xlsxJson });
    }
    // // }

    return res.status(401).json({ error: 'name & barcode is required' });
});

export const addProduct = catchAsync(async (req, res, next) => {
    // check product exists
    const isExist = await Product.findOne({ barcode: req.body.barcode });
    if (isExist) return next(new AppError("Product already exists", 400));

    const newProduct = await Product.create({
        name: req.body.name,
        barcode: req.body.barcode,
        year: req.body.year,
        quickDescription: req.body.quickDescription,
        description: req.body.description,
        minimumAge: req.body.minimumAge,
        minNumberOfPlayers: req.body.minNumberOfPlayers,
        maxNumberOfPlayers: req.body.maxNumberOfPlayers,
        minPlayingTime: req.body.minPlayingTime,
        maxPlayingTime: req.body.maxPlayingTime,
        boardGameCategory: req.body.boardGameCategory,
        boardGameMechanic: req.body.boardGameMechanic,
        boardGameSubdomain: req.body.boardGameSubdomain,
        boardGameTheme: req.body.boardGameTheme,
        rating: req.body.rating,
        boxSize: req.body.boxSize,
        finalPrice: req.body.finalPrice,
        currency: req.body.currency,
        arabicName: req.body.arabicName,
        quickDescriptionArabic: req.body.quickDescriptionArabic,
        descriptionArabic: req.body.descriptionArabic,
        images: req.files?.images?.map(obj => obj.filename),
    });
    sendData(201, "success", "Product added successfully", newProduct, res);
});

export const updateProduct = catchAsync(async (req, res, next) => {
    // Check if the product exists
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
        return next(new AppError("Product not found", 404));
    }

    // Update the product properties

    existingProduct.name = req.body.name,
        existingProduct.barcode = req.body.barcode,
        existingProduct.year = req.body.year,
        existingProduct.quickDescription = req.body.quickDescription,
        existingProduct.description = req.body.description,
        existingProduct.minimumAge = req.body.minimumAge,
        existingProduct.minNumberOfPlayers = req.body.minNumberOfPlayers,
        existingProduct.maxNumberOfPlayers = req.body.maxNumberOfPlayers,
        existingProduct.minPlayingTime = req.body.minPlayingTime,
        existingProduct.maxPlayingTime = req.body.maxPlayingTime,
        existingProduct.boardGameCategory = req.body.boardGameCategory,
        existingProduct.boardGameMechanic = req.body.boardGameMechanic,
        existingProduct.boardGameSubdomain = req.body.boardGameSubdomain,
        existingProduct.boardGameTheme = req.body.boardGameTheme,
        existingProduct.rating = req.body.rating,
        existingProduct.boxSize = req.body.boxSize,
        existingProduct.finalPrice = req.body.finalPrice,
        existingProduct.currency = req.body.currency,
        existingProduct.arabicName = req.body.arabicName,
        existingProduct.quickDescriptionArabic = req.body.quickDescriptionArabic,
        existingProduct.descriptionArabic = req.body.descriptionArabic;

    // Check if there are new images to be added
    if (req.files && req.files.images) {
        existingProduct.images = req.files.images.map(obj => obj.filename);
    }

    // Save the updated product
    const updatedProduct = await existingProduct.save();
    sendData(200, "success", "Product updated successfully", updatedProduct, res);
});

export const deleteProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // Find the product to get the image paths
    const product = await Product.findById(id);
    // Check if the product exists
    // we have issue here 
    if (!product) {
        return next(new AppError("product not found", 404));
        // sendData(404, "success", "product not found", undefined, res);
    }
    // Delete the product
    await Product.findByIdAndDelete(id);

    // Delete the associated images
    if (product.images && product.images.length > 0) {
        // Assuming imagePaths is an array of file paths stored in the product model
        product.images.forEach(async (imgName) => {
            const fullPath = path.resolve('uploads', 'product', imgName);
            console.log('fullPath', fullPath);
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
    sendData(200, "success", "Product deleted successfully", undefined, res);
});

export const getSingleProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return next(new AppError("Product not found", 404));
    sendData(200, "success", undefined, product, res);
});