const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        phone: {
            type: String,
            trim: true,
            minLength: [8, "Phone cannot be less than 8 characters"],
            maxLength: [20, "Phone cannot be greater than 20 characters"],
            required: [true, "Phone is required"],
            unique: true
        },

        username: {
            type: String,
            lowercase: true,
            trim: true,
            minLength: [3, "Username cannot be less than 3 characters"],
            maxLength: [54, "Username cannot be greater than 54 characters"],
            required: [true, "Username is required"],
            unique: true
        },

        email: {
            type: String,
            lowercase: true,
            trim: true,
            maxLength: [54, "Email cannot be greater than 54 characters"],
            required: [true, "Email is required"],
            unique: true
        },

        password: { type: String, required: [true, "Password is required"] },

        remmemberToken: { type: String, default: null },

        expiresToken: { type: Date, default: Date.now() },

        type: { type: Number, enum: [0, 1, 2], default: 0 }, // 0 User, 1 admin, 2 Owner

        created_at: { type: Date, default: Date.now() },

        deleted: { type: Boolean, default: false }
    },
    { versionKey: false }
)

module.exports = mongoose.model("User", userSchema)