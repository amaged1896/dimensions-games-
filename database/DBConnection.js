import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/Dimensions-Games')
        .then(() => console.log('Database connection established successfully'))
        .catch((err) => console.log('Database connection failed', err.message));
};