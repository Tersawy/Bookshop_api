const router = require("express").Router()

const { login, logout, checkAuth, verifyToken, reset, newPassword } = require("../Controllers/AuthController")

const { auth } = require("../middlewares/auth.guard")

const { checkBody_login, checkToken, checkBody_newPass, checkBody_email } = require("../validations/auth")

const errorBody = require("../validations/errorBody")


router.post("/check-auth", checkToken, errorBody, checkAuth)

router.post("/login", checkBody_login, errorBody, login)

router.post("/logout", auth, checkToken, errorBody, logout)

router.post("/reset-password", checkBody_email, errorBody, reset)

router.post("/new-password", checkBody_newPass, errorBody, newPassword)

router.post("/verify", verifyToken)

module.exports = router
