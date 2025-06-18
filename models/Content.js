"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var contentSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.Mixed,
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
if (mongoose_1.default.models.Content) {
    delete mongoose_1.default.models.Content;
}
exports.default = mongoose_1.default.model('Content', contentSchema);
