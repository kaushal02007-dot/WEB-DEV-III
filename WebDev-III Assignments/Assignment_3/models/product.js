
const mongoose = require("mongoose")

const product = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    sku: {
        type: String,
        required: true,
        unique: true
    },

    category: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    quantity: {
        type: Number,
        required: true,
        min: 0
    },

    reorderLevel: {
        type: Number,
        required: true,
        min: 0
    },

    supplier: {
        type: String,
        required: true
    }

}, { timestamps: true }) // automatically add 2 date fields : createdAt, updatedAt


// define text index
product.index({
    name: "text",
    sku: "text",
    category: "text"
})

const productSchema = mongoose.model("product", product)

module.exports = productSchema
