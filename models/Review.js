import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Title is required'],
        maxlength: 100,
    },
    text: {
        type: String,
        required: [true, 'Text is required'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Rating between 1 and 10 is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
});

export default mongoose.model('Review', ReviewSchema);
