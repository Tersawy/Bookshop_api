const router = require("express").Router()

const { auth, admin } = require("../middlewares/auth.guard")

const permissions = require("../middlewares/permission.guard")

const validate = require("../validations/book")

const errorBody = require("../validations/errorBody")

const { createBook, deletedBooks, getBook, moveBookToTrash, readBooks, restoreBook, updateBook, deleteBook, approveBook } = require("../Controllers/BookController")



router.get("/", auth, admin, readBooks)

router.get("/trash", auth, admin, deletedBooks)

router.get("/:id", auth, admin, getBook)

router.post("/create", auth, admin, permissions.createBook, validate.create, errorBody, createBook)

router.post("/update", auth, admin, permissions.updateBook, validate.update, errorBody, updateBook)

router.post("/approve", auth, admin, permissions.approveBook, validate.bookId, errorBody, approveBook)

router.post("/move-to-trash", auth, admin, permissions.moveBookToTrash, validate.bookId, errorBody, moveBookToTrash)

router.post("/restore", auth, admin, permissions.restoreBook, validate.bookId, errorBody, restoreBook)

router.post("/delete", auth, admin, permissions.deleteBook, validate.bookId, errorBody, deleteBook)

module.exports = router
