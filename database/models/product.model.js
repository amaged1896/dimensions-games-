import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    barcode: Number,
    year: Number,
    quickDescription: String,
    description: String,
    minimumAge: Number,
    minNumberOfPlayers: Number,
    maxNumberOfPlayers: Number,
    minPlayingTime: Number,
    maxPlayingTime: Number,
    boardGameCategory: String,
    boardGameMechanic: String,
    boardGameSubdomain: String,
    boardGameTheme: String,
    rating: {
        type: Number,
        min: [1, 'min rating should be 1'],
        max: [5, 'max rating should be 5'],
        default: 5
    },
    boxSize: Number,
    finalPrice: Number,
    currency: String,
    arabicName: String,
    quickDescriptionArabic: String,
    descriptionArabic: String,
    images: [String],
}, { timestamps: true });


productSchema.post('init', function (doc) {
    console.log('hello');
    console.log(process.env.BASE_URL);
    if (doc.images && doc.images.length > 0) {
        doc.images = doc.images.map(image => process.env.BASE_URL + "/products/" + image);
    }
});

export const Product = mongoose.model('product', productSchema);