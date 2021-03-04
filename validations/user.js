const { check } = require("express-validator")



let userId = [ check("_id").not().isEmpty().withMessage("UserId is required").isMongoId().withMessage("UserId is not valid") ]


let userRules = [
  
  check("username")
    .not().isEmpty().withMessage("Username is required")
    .isString().withMessage("Username must be a string !")
    .isLength({ min: 3, max: 54 }).trim().withMessage("Username must be at least 3 characters and not more than 54 characters")
    .isAlpha().withMessage("Username is not valid"),


  check("phone")
    .not().isEmpty().withMessage("Phone is required")
    .isLength({ min: 8, max: 20 }).trim().withMessage("Phone must be at least 8 number and not more than 20 number"),


  check("email")
    .not().isEmpty().withMessage("Email cannot be empty !")
    .isEmail().withMessage("Email is not valid")
    .isLength({ max: 54 }).withMessage("Email is not valid !")

]


let create = [

  ...userRules,

  check("password")
    .not().isEmpty().withMessage("Password cannot be empty !")
    .isString().withMessage("Password must be a string !")
    .isLength({ min: 8, max: 54 }).withMessage("Password must be at least 8 number and not more than 54 number !"),

]


let update = [ ...userId, ...userRules ]


module.exports = { create, update, userId }
