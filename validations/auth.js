const { check, header } = require("express-validator")

let checkBody_login = [

	check("email")
		.not().isEmpty().withMessage("Email cannot be empty !")
		.isEmail().withMessage("Email is not valid")
		.isLength({ max: 54 }).withMessage("Email is not valid !"),

	check("password")
		.not().isEmpty().withMessage("Password cannot be empty !")
		.isString().withMessage("Password must be a string !")
		.isLength({ min: 8, max: 54 }).withMessage("Password is not valid !")

]

let checkToken = [

	header("authorization").isJWT().withMessage("token is not valid")

]


let checkBody_newPass = [

  check("token")
    .not().isEmpty().withMessage("Token is required")
    .isString().withMessage("Token must be a string !"),
    

  check("password")
    .not().isEmpty().withMessage("New password cannot be empty !")
    .isString().withMessage("New password must be a string !")
    .isLength({ min: 8, max: 54 }).withMessage("New password must be at least 8 number and not more than 54 number !")

]


let checkBody_email = [

	check("email")
		.not().isEmpty().withMessage("Email cannot be empty !")
		.isEmail().withMessage("Email doesn't exist !")
		.isLength({ max: 54 }).withMessage("Email doesn't exist !"),

]


module.exports = { checkBody_login, checkToken, checkBody_newPass, checkBody_email }
