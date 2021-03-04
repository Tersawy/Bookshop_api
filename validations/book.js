const { check } = require("express-validator")



let bookId = [ check("_id").not().isEmpty().withMessage("BookId is required").isMongoId().withMessage("BookId is not valid") ]

let genreId = [ check("genre").not().isEmpty().withMessage("Book genre is required").isMongoId().withMessage("Book genre is not valid") ]


let bookRules = [

  check("title")
    .not().isEmpty().withMessage("Title is required")
    .isString().withMessage("Title must be a string !")
    .isLength({ min: 3, max: 54 }).trim().withMessage("Title must be at least 3 characters and not more than 54 characters"),

  check("description")
    .not().isEmpty().withMessage("Description is required")
    .isString().withMessage("Description must be a string !")
    .isLength({ min: 3, max: 2000 }).trim().withMessage("Description must be at least 3 characters and not more than 2000 characters"),

  check("author")
    .not().isEmpty().withMessage("Author is required")
    .isString().withMessage("Author must be a string !")
    .isLength({ min: 3, max: 54 }).trim().withMessage("Author must be at least 3 characters and not more than 54 characters"),

    check("quantity")
      .not().isEmpty().withMessage("Quantity is required")
      .isNumeric({ no_symbols: true }).toInt().withMessage("Quantity is not valid"),

    check("price")
      .not().isEmpty().withMessage("Price is required")
      .isNumeric({ no_symbols: true }).toInt().withMessage("Price is not valid"),

    ...genreId
]


let create = [ ...bookRules ]


let update = [ ...bookId, ...bookRules ]


module.exports = { create, update, bookId }
