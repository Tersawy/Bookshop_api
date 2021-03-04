const mongoose = require("mongoose")

const Schema = mongoose.Schema

const sessionSchema = new Schema(
  {
    expired_at: { type: Date, default: Date.now() + 28800000, index: { expires: 28800 } }, // expired after 8h

    userId: { type: 'ObjectId', ref: "User" }, // UserId To Logout from all devices

    token: { type: String, default: null }
  },
  { versionKey: false }
)

module.exports = mongoose.model("Session", sessionSchema)
