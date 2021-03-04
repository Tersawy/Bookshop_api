const router = require("express").Router()

const { auth, admin } = require("../middlewares/auth.guard")

const permissions = require("../middlewares/permission.guard")

const validate = require("../validations/genre")

const errorBody = require("../validations/errorBody")

const {
    readGenres,
    getGenre,
    createGenre,
    updateGenre,
    approveGenre,
    getBooksByGenre,
    moveGenreToTrash,
    deletedGenres,
    restoreGenre,
    deleteGenre
} = require("../Controllers/BookGenreController")



router.get("/", auth, admin, readGenres)

router.get("/trash", auth, admin, deletedGenres)

router.get("/:id/books", auth, admin, getBooksByGenre)

router.get("/:id", auth, admin, getGenre)

router.post("/create", auth, admin, permissions.createGenre, validate.create, errorBody, createGenre)

router.post("/update", auth, admin, permissions.updateGenre, validate.update, errorBody, updateGenre)

router.post("/approve", auth, admin, permissions.approveGenre, validate.genreId, errorBody, approveGenre)

router.post("/move-to-trash", auth, admin, permissions.moveGenreToTrash, validate.genreId, errorBody, moveGenreToTrash)

router.post("/restore", auth, admin, permissions.restoreGenre, validate.genreId, errorBody, restoreGenre)

router.post("/delete", auth, admin, permissions.deleteGenre, validate.genreId, errorBody, deleteGenre)

module.exports = router
