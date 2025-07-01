"use strict";
const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    metadata: {
        color: String,
        image: String,
        order: Number,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the updatedAt timestamp before saving
contentSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Remove the model from the cache if it exists
if (mongoose.models.Content) {
    delete mongoose.models.Content;
}

module.exports = mongoose.model('Content', contentSchema);
