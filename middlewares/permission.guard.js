exports.createBook = (req, res, next) => {
    if (hasAccess(req, "createBook")) return next()
    return sendResponse(res)
}


exports.updateBook = (req, res, next) => {
    if (hasAccess(req, "updateBook")) return next()
    return sendResponse(res)
}


exports.moveBookToTrash = (req, res, next) => {
    if (hasAccess(req, "moveBookToTrash")) return next()
    return sendResponse(res)
}


exports.restoreBook = (req, res, next) => {
    if (hasAccess(req, "restoreBook")) return next()
    return sendResponse(res)
}


exports.deleteBook = (req, res, next) => {
    if (hasAccess(req, "deleteBook")) return next()
    return sendResponse(res)
}


exports.approveBook = (req, res, next) => {
    if (hasAccess(req, "approveBook")) return next()
    return sendResponse(res)
}


exports.createGenre = (req, res, next) => {
    if (hasAccess(req, "createGenre")) return next()
    return sendResponse(res)
}


exports.updateGenre = (req, res, next) => {
    if (hasAccess(req, "updateGenre")) return next()
    return sendResponse(res)
}


exports.moveGenreToTrash = (req, res, next) => {
    if (hasAccess(req, "moveGenreToTrash")) return next()
    return sendResponse(res)
}


exports.restoreGenre = (req, res, next) => {
    if (hasAccess(req, "restoreGenre")) return next()
    return sendResponse(res)
}


exports.deleteGenre = (req, res, next) => {
    if (hasAccess(req, "deleteGenre")) return next()
    return sendResponse(res)
}


exports.approveGenre = (req, res, next) => {
    if (hasAccess(req, "approveGenre")) return next()
    return sendResponse(res)
}


exports.createUser = (req, res, next) => {
    if (hasAccess(req, "createUser")) return next()
    return sendResponse(res)
}


exports.updateUser = (req, res, next) => {

    let isItSelf = req.body.currentUser._id == req.body._id

    if (hasAccess(req, "updateUser") && !isItSelf) return next()

    return sendResponse(res)
}


exports.moveUserToTrash = (req, res, next) => {

    let isItSelf = req.body.currentUser._id == req.body._id

    if (hasAccess(req, "moveUserToTrash") && !isItSelf) return next()

    return sendResponse(res)
}


exports.restoreUser = (req, res, next) => {
    if (hasAccess(req, "restoreUser")) return next()
    return sendResponse(res)
}


exports.deleteUser = (req, res, next) => {

    let isItSelf = req.body.currentUser._id == req.body._id

    if (hasAccess(req, "deleteUser") && !isItSelf) return next()

    return sendResponse(res)
}


let hasAccess = (request, actionName) => request.body.currentUser.permissions[actionName]

let err = { msg: "Sorry you currently don't have permission to access this service. Contact your administrator to change permissions." }

let sendResponse = response => response.status(403).json(err)