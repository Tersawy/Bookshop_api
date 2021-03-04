const { check } = require("express-validator")


let genreId = [ check("_id").not().isEmpty().withMessage("Genre is required").isMongoId().withMessage("Genre is not valid") ]


let bookRules = [

  check("name")
    .not().isEmpty().withMessage("Genre is required")
    .isString().withMessage("Genre must be a string !")
    .isLength({ min: 3, max: 54 }).trim().withMessage("Genre must be at least 3 characters and not more than 54 characters"),
]


let create = [ ...bookRules ]


let update = [ ...genreId, ...bookRules ]


module.exports = { create, update, genreId }
