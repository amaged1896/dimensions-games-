import mongoose from "mongoose";

const articleSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
    },
    content: String,
    author: String,
    publishDate: {
        type: Date,
        default: Date.now()
    },
    images: [String]
});

articleSchema.pre('save', function (next) {
    if (this.images && this.images.length > 0) {
        this.images = this.images.map(image => process.env.BASE_URL + "/articles/" + image);
    }
    next();
});

export const Article = mongoose.model('article', articleSchema);