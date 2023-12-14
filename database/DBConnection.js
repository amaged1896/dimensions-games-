import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose.connect('mongodb+srv://ahmedmaged1896:YVttUAcGmNDgsWyP@cluster0.9mdq3qq.mongodb.net/')
        .then(() => console.log('Database connection established successfully'))
        .catch((err) => console.log('Database connection failed', err.message));
};