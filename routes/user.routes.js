const router = require("express").Router()

const { auth, admin } = require("../middlewares/auth.guard")

const validate = require("../validations/user")

const errorBody = require("../validations/errorBody")

const permissions = require("../middlewares/permission.guard")

const { admins, getUser, createUser, updateUser, moveUserToTrash, restoreUser, deleteUser, usersDeleted } = require("../Controllers/UserController")


router.get("/", auth, admin, admins)

router.get("/trash", auth, admin, usersDeleted)

router.get("/:id", auth, admin, getUser)

router.post("/create", /* auth, admin, permissions.createUser, */ validate.create, errorBody, createUser)

router.post("/update", auth, admin, permissions.updateUser, validate.update, errorBody, updateUser)

router.post("/move-to-trash", auth, admin, permissions.moveUserToTrash, validate.userId, errorBody, moveUserToTrash)

router.post("/restore", auth, admin, permissions.restoreUser, validate.userId, errorBody, restoreUser)

router.post("/delete", auth, admin, permissions.deleteUser, validate.userId, errorBody, deleteUser)

module.exports = router
