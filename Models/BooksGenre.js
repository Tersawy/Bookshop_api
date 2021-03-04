const mongoose = require("mongoose")

const Schema = mongoose.Schema

const bookGenreSchema = new Schema(
    {
        name: {
            type: String,
            lowercase: true,
            trim: true,
            minLength: [3, "Genre cannot be less than 3 characters"],
            maxLength: [54, "Genre cannot be greater than 54 characters"],
            required: [true, "Genre is required"],
            unique: true
        },

        approved: { type: Boolean, default: false },

        created_at: { type: Date, default: Date.now() },
        updated_at: { type: Date, default: null },
        deleted_at: { type: Date, default: null },

        created_by: { type: "ObjectId", ref: "User", required: [true, "userId is required"] },
        updated_by: { type: "ObjectId", ref: "User", default: null },
        deleted_by: { type: "ObjectId", ref: "User", default: null },

        deleted: { type: Boolean, default: false }
    },
    { versionKey: false }
)

module.exports = mongoose.model("BooksGenre", bookGenreSchema)
