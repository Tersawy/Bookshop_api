const mongoose = require("mongoose")

const bcrypt = require("bcrypt")

const handleError = require("../helpers/handleError")

const User = require("../Models/User")

const Permission = require("../Models/Permission")

const Session = require("../Models/Session")


exports.admins = (req, res) => {

  const { perPage, page } = req.query

  const { currentUser } = req.body

  let _limit = /^\d+$/.test(perPage) ? +perPage : 10

  let _page = /^\d+$/.test(page) ? +page : 1

  let collectionQuery = { _id: { $ne: currentUser._id }, type: 1 , deleted: false }

  let projection = { remmemberToken: 0, expiresToken: 0, password: 0, "permissions._id": 0, "permissions.userId": 0 }

  let aggregate = [
    { $match: collectionQuery },
    {
      $facet: {
        count: [{ $count: "count" }],
        docs: [
          { $lookup: { from: Permission.collection.name, localField: "_id", foreignField: "userId", as: "permissions" } },
          { $unwind: "$permissions" },
          { $project: projection },
          { $sort: { created_at: -1 } },
          { $skip: (_page - 1) * _limit },
          { $limit: _limit },
        ]
      }
    }
  ]

  User.aggregate(aggregate).then(result => {

    let count = result[0].count.length ? result[0].count[0].count : 0

  res.status(200).json({ users: { docs: result[0].docs, count } })

  }).catch(err => handleError(err, (status, error) => res.status(status).json(error)))
}


exports.getUser = (req, res) => {
  
  User.aggregate()
    .match({ _id: mongoose.Types.ObjectId(req.params.id), type: 1 })
    .lookup({ from: Permission.collection.name, localField: "_id", foreignField: "userId", as: "permissions" })
    .unwind("permissions")
    .project({ remmemberToken: 0, expiresToken: 0, password: 0, "permissions._id": 0, "permissions.userId": 0 })
    .exec((err, users) => {

      if (err) return handleError(err, (status, error) => res.status(status).json(error))

      if (!users.length) return res.status(404).json({ msg: "User is not found" })

      res.status(200).json({ user: users[0] })
    })
}


exports.createUser = async (req, res) => {

  const { email, password, username, phone } = req.body

  try {

    let _password = await bcrypt.hash(password, 10)

    let _user = new User({ email, password: _password, username, phone, type: 1 })
  
    let user = await _user.save()
  
    createPermissions(req.body.permissions, user._id, (err, permissions) => {

      if (err) throw err

      delete user._doc.password
      delete user._doc.expiresToken
      delete user._doc.remmemberToken
      delete user._doc.deleted

      return res.status(200).json({ user: { ...user._doc, permissions } })
    })

  } catch (err) { handleError(err, (status, error) => res.status(status).json(error)) }

}


exports.updateUser = async (req, res) => {

  const { _id, email, password, username, phone, permissions } = req.body

  try {

    userDate = { email, username, phone }

    if (password) {

      let pass = password.toString()

      if (!pass) throw { status: 422, field: "password", msg: "password must be a string !" }

      if (pass.length < 8 || pass.length > 54) {
        throw { status: 422, field: "password", msg: "password must be at least 8 number and not more than 54 number !" }
      }

      userDate.password = bcrypt.hashSync(password, 10)
    }

    let userResult = await User.updateOne({ _id, deleted: false, type: 1 }, userDate)
  
    if (!userResult.n) throw { status: 404, msg: "User is not found" }

    let permissionResult = await updatePermissions(permissions, _id)

    if (!userResult.nModified && !permissionResult.nModified) throw { status: 422, msg: "Nothing changed to update!" }

    res.status(200).json({ msg: "User has been updated successfully" })
  
  } catch (err) { handleError(err, (status, error) => res.status(status).json(error)) }

}


exports.moveUserToTrash = async (req, res) => {

  const { _id } = req.body

  try {
  
    let result = await User.updateOne({ _id: mongoose.Types.ObjectId(_id), type: 1 }, { deleted: true })

    if (!result.n) throw { status: 404, msg: "User is not found" }

    await Session.deleteOne({ userId: _id })

    res.status(200).json({ msg: "User has been moved to trash successfully" })

  } catch (err) { handleError(err, (status, error) => res.status(status).json(error)) }

}


exports.usersDeleted = (req, res) => {

  const { perPage, page } = req.query

  let _limit = /^\d+$/.test(perPage) ? +perPage : 10

  let _page = /^\d+$/.test(page) ? +page : 1

  collectionQuery = { deleted: true }

  let selected = "username email phone type"

  Promise.all([

    User.find(collectionQuery, { username: 1, phone: 1, created_by: 1, created_at: 1, deleted_at: 1, deleted_by: 1 })
      .populate("created_by", selected)
      .populate("deleted_by", selected)
      .sort({ deleted_at: -1 })
      .skip((_page - 1) * _limit).limit(_limit),

    User.find(collectionQuery).countDocuments()

  ]).then(result => {

    res.status(200).json({ users: { docs: result[0], count: result[1] } })

  }).catch(err => handleError(err, (status, error) => res.status(status).json(error)))
    
}


exports.restoreUser = async (req, res) => {

  const { _id } = req.body

  try {
  
    let result = await User.updateOne({ _id, type: 1 }, { deleted: false })

    if (!result.n) throw { status: 404, msg: "User is not found" }

    res.status(200).json({ msg: "User has been restored successfully" })

  } catch (err) { handleError(err, (status, error) => res.status(status).json(error)) }

}


exports.deleteUser = async (req, res) => {

  const { _id } = req.body

  try {
  
    let result = await User.deleteOne({ _id, type: 1 })

    if (!result.n) throw { status: 404, msg: "User is not found" }

    if (!result.deletedCount) throw { status: 500, msg: "Something went wrong" }

    await Session.deleteOne({ userId: _id })

    res.status(200).json({ msg: "User has been deleted successfully" })

  } catch (err) { handleError(err, (status, error) => res.status(status).json(error)) }

}


async function createPermissions(permissions, userId, callback) {

    let permissionResult = field => {

      if (!permissions) return false

      return permissions[field] === true ? true : false

    }

    let data = {
      userId,
      createBook: permissionResult("createBook"),
      updateBook: permissionResult("updateBook"),
      moveBookToTrash: permissionResult("moveBookToTrash"),
      restoreBook: permissionResult("restoreBook"),
      deleteBook: permissionResult("deleteBook"),
      approveBook: permissionResult("approveBook"),
      createGenre: permissionResult("createGenre"),
      updateGenre: permissionResult("updateGenre"),
      moveGenreToTrash: permissionResult("moveGenreToTrash"),
      restoreGenre: permissionResult("restoreGenre"),
      deleteGenre: permissionResult("deleteGenre"),
      approveGenre: permissionResult("approveGenre"),
      createUser: permissionResult("createUser"),
      updateUser: permissionResult("updateUser"),
      moveUserToTrash: permissionResult("moveUserToTrash"),
      restoreUser: permissionResult("restoreUser"),
      deleteUser: permissionResult("deleteUser")
    }

    let _permissions = new Permission(data)

    try {

      await _permissions.save()
      
      delete data.userId

      callback(null, data)

    } catch (err) { callback(err) }

}


async function updatePermissions(permissions, userId) {

  let permissionResult = field => {

    if (!permissions) return false

    return permissions[field] === true || permissions[field] === false ? permissions[field] : false

  }

    let data = {
      createBook: permissionResult("createBook"),
      updateBook: permissionResult("updateBook"),
      moveBookToTrash: permissionResult("moveBookToTrash"),
      restoreBook: permissionResult("restoreBook"),
      approveBook: permissionResult("approveBook"),
      deleteBook: permissionResult("deleteBook"),
      createGenre: permissionResult("createGenre"),
      updateGenre: permissionResult("updateGenre"),
      moveGenreToTrash: permissionResult("moveGenreToTrash"),
      restoreGenre: permissionResult("restoreGenre"),
      approveGenre: permissionResult("approveGenre"),
      deleteGenre: permissionResult("deleteGenre"),
      createUser: permissionResult("createUser"),
      updateUser: permissionResult("updateUser"),
      moveUserToTrash: permissionResult("moveUserToTrash"),
      restoreUser: permissionResult("restoreUser"),
      deleteUser: permissionResult("deleteUser")
    }

    return new Promise((resolve, reject) => {

      Permission.updateOne({ userId }, data, (err, result) => {
  
        if (err) return reject(err)
  
        resolve({ result })
      })

    })
}
