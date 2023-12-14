import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose.connect(process.env.DATABASE_ATLAS)
        .then(() => console.log('Database connection established successfully'))
        .catch((err) => console.log('Database connection failed', err.message));
};