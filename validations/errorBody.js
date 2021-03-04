const { validationResult } = require("express-validator")

module.exports = (req, res, next) => {

  if (!validationResult(req).isEmpty()) {

    let error = validationResult(req).errors[0]

    return res.status(422).json({ field: error.param, msg: error.msg })
  }

  next()
}
