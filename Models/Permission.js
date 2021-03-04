const mongoose = require("mongoose")

const Schema = mongoose.Schema

let type = { type: Boolean, default: false }

const permissionSchema = new Schema(
    {
        userId: { type: "ObjectId", required: [true, "UserId is required"] },

        createBook: type,
        updateBook: type,
        moveBookToTrash: type,
        restoreBook: type,
        deleteBook: type,
        approveBook: type,

        createGenre: type,
        updateGenre: type,
        moveGenreToTrash: type,
        restoreGenre: type,
        deleteGenre: type,
        approveGenre: type,

        createUser: type,
        updateUser: type,
        moveUserToTrash: type,
        restoreUser: type,
        deleteUser: type
    },
    { versionKey: false }
)
  
module.exports = mongoose.model("Permission", permissionSchema)
