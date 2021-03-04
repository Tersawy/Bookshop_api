const mongoose = require("mongoose")

const Schema = mongoose.Schema

const bookSchema = new Schema(
    {
        title: {
            type: String,
            lowercase: true,
            trim: true,
            minLength: [3, "Title cannot be less than 3 characters"],
            maxLength: [54, "Title cannot be greater than 54 characters"],
            required: [true, "Title is required"]
        },

        description: {
            type: String,
            lowercase: true,
            trim: true,
            minLength: [3, "Description cannot be less than 3 characters"],
            required: [true, "Description is required"]
        },

        author: {
            type: String,
            lowercase: true,
            trim: true,
            minLength: [3, "Author cannot be less than 3 characters"],
            maxLength: [54, "Author cannot be greater than 54 characters"],
            required: [true, "Author is required"]
        },

        quantity: {
            type: Number,
            min: [1, "Quantity cannot be less than 1"],
            required: [true, "Quantity is required"]
        },

        price: {
            type: Number,
            min: [1, "Price quantity cannot be less than 1"],
            required: [true, "Quantity is required"]
        },

        genre: {
            type: "ObjectId",
            ref: "BooksGenre",
            required: [true, "Book genre is required"]
        },

        approved: { type: Boolean, default: false },

        created_at: { type: Date, default: Date.now() },

        updated_at: { type: Date, default: null },

        deleted_at: { type: Date, default: null },

        created_by: { type: "ObjectId", ref: "User", required: [true, "UserId is required"] },

        updated_by: { type: "ObjectId", ref: "User", default: null },

        deleted_by: { type: "ObjectId", ref: "User", default: null },

        deleted: { type: Boolean, default: false }
    }
)

module.exports = mongoose.model("Book", bookSchema)