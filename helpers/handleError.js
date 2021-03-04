module.exports = (err, callback) => {

  console.log("handleError From @/helpers/handleError ", err)

  if (err.code === 11000 && err.name === "MongoError") {

    let field, msg

    if (err.keyValue) {

      field = Object.keys(err.keyValue)[0]

      msg = err.keyValue[Object.keys(err.keyValue)[0]] + " is exist !"

      return callback(422, { field, msg })
    }

    field = err.message.slice(err.message.indexOf("index: "), err.message.indexOf("_1")).split(" ")[1]

    msg = err.message.slice(err.message.indexOf(": \"") + 3).split("\"")[0] + " is exist !"

    return callback(422, { field, msg })

  }


  if (Object.keys(err)[0] === "status" && (Object.keys(err)[1] === "field" || Object.keys(err)[1] === "msg")) {

    let error = { msg: err.msg }

    if (err.field) error.field = err.field

    return callback(err.status, error)

  }

  let firstError = err.errors ? Object.keys(err.errors)[0] : null // first error of mongoose schema validation

  let properties = firstError ? err.errors[firstError].properties : null

  if (properties) return callback(422, { field: properties.path, msg: properties.message })

  return callback(500, { field: "server", msg: "Something went wrong!" })

}