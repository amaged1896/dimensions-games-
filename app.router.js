import { AppError } from "./src/utils/appError.js";
import articleRouter from "./src/modules/article/article.router.js";
import productRouter from "./src/modules/product/product.router.js";
import { errorController } from "./src/utils/errorController.js";
import authRouter from './src/modules/auth/auth.router.js';
import cors from 'cors';

export const appRouter = (app, express) => {
    // Global Middleware 
    app.use(cors());
    app.use(express.json());
    app.use(express.static('uploads'));

    // auth
    app.use('/api/v1/auth', authRouter);

    // product
    app.use('/api/v1/products', productRouter);

    // article
    app.use('/api/v1/articles', articleRouter);

    // not found page router
    app.all("*", (req, res, next) => {
        return next(new AppError('Page not found', 404));
    });
    // global error handling middleware
    app.use(errorController);
};