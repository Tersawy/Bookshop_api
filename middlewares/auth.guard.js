const jwt = require("jsonwebtoken")

const mongoose = require("mongoose")

const User = require("../Models/User")

const Session = require("../Models/Session")

const Permission = require("../Models/Permission")


let auth = (req, res, next) => {

    // const token = req.headers.authorization
    const { authorization: token } = req.headers

    let unauthenticationError = { msg: "unauthentication" }

    if (!token) return res.status(401).json(unauthenticationError)

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {

        try {

            if (err) throw unauthenticationError
            
            let userId = mongoose.Types.ObjectId(decoded.userId)

            let session = await Session.findOne({ userId, token })

            if (!session) throw unauthenticationError

            let user = await User.findOne({ _id: userId, deleted: false }, { password: 0 })

            if (!user) throw unauthenticationError

            let permissions = await Permission.findOne({ userId }, { _id: 0, userId: 0 })

            req.body.currentUser = { ...user._doc, permissions }

            next()

        } catch (err) { res.status(401).json(err) }
    })
}


let errorMsg = "Sorry you currently don't have permission to access this service. Contact your administrator to change permissions."


let owner = (req, res, next) => {

    if (req.body.currentUser.type === 2) return next()

    if (req.body.currentUser.type !== 1) errorMsg = "access forbidden!"

    return res.status(403).json({ msg: errorMsg })

}


let admin = (req, res, next) => {

    let userTypes = [1, 2] // Admin & Owner

    if (userTypes.includes(req.body.currentUser.type)) return next()

    return res.status(403).json({ msg: errorMsg })

}


module.exports = { auth, admin, owner }
