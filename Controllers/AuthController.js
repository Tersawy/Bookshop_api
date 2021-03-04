const jwt = require("jsonwebtoken")

const crypto = require("crypto")

const bcrypt = require("bcrypt")

const sgMail = require("@sendgrid/mail")

const handleError = require("../helpers/handleError")

const User = require("../Models/User")

const Session = require("../Models/Session")

const Permission = require("../Models/Permission")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


let login = async (req, res) => {

  const { email, password } = req.body

  try {

    let user = await User.findOne({ email, deleted: false })

    if (!user) throw { status: 401, msg: "Email or password are not valid" }

    let same = await bcrypt.compare(password, user.password)

    if (!same) throw { status: 401, msg: "Email or password are not valid" }

    jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "8h" }, async (err, token) => {

      if (err) throw err

      let _session = new Session({ userId: user._id, token })

      await _session.save()

      res.status(200).json({ token })

    })

  } catch (err) { handleError(err, (status, error) => res.status(status).json(error)) }

}


let register = async (req, res) => {

  const { username, email, password } = req.body

  try {

    let _user = new User({ firstName, lastName, email, username })

    let hashPassword =  await bcrypt.hash(password, 10)

    _user.password = hashPassword

    let user = await _user.save()

    res.status(200).json({ user })

  } catch (err) { handleError(err, (status, error) => res.status(status).json(error)) }
}


let logout = (req, res) => {

  Session.deleteMany({ userId: req.body.currentUser._id }, err => {

    if (err) return handleError(err, (status, error) => res.status(status).json(error))

    res.status(200).json({ msg: "Logged Out Successfuly" })

  })
}


let checkAuth = (req, res) => {

  const { authorization: token } = req.headers

  if (!token) return res.status(401).json({ msg: "unauthentication" })

  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {

    try {

        if (err) throw { status: 401, msg: "unauthentication" }

        let session = await Session.findOne({ userId: decoded.userId, token: token })

        if (!session) throw { status: 401, msg: "unauthentication" }

        let user = await User.findOne({ _id: decoded.userId, deleted: false }, { password: 0 })

        if (!user) throw { status: 401, msg: "unauthentication" }

        let permissions = await Permission.findOne({ userId: decoded.userId }, { _id: 0, userId: 0 })

        // let _user = { ...user._doc, permissions }
        
        res.status(200).json({ user: { ...user, permissions } })

    } catch(err) { handleError(err, (status, error) => res.status(status).json(error)) }
  })
}


let reset = (req, res) => {

  const { email } = req.body

  crypto.randomBytes(32, async (err, buffer) => {

    if (err) return handleError(err, (status, error) => res.status(status).json(error))

    const token = buffer.toString("hex")

    try {

      let _user = await User.findOne({ email, deleted: false })

      if (!_user) throw { status: 422, field: "email", msg: "Email doesn't exist !" }

      _user.remmemberToken = token

      _user.expiresToken = Date.now() + 1200000 //expired after 20 min

      await _user.save()

      let url = `http://localhost:8080/reset-password/${token}`

      const msg = {
        to: _user.email,
        from: process.env.EMAIL,
        subject: "🌻 Book Store Password Reset 🌻",
        text: 'and easy to do anywhere, even with Book Store',
        html: `
          <p>Hey ${_user.username},</p>
          <p>We heard that you lost your Book store password. Sorry about that!</p>
          <p>But don’t worry! You can use the following link to reset your password:</p>
          <a href=${url}>${url}</a>
          <p>If you don’t use this link within 20 minutes, it will expire.</p>
          <p>Do something outside today! </p>
          <p>–Your friends at Book Store</p>
          `,
      }

      await sgMail.send(msg)

      res.status(200).json({ msg: "Email sent" })

    } catch(err) { handleError(err, (status, error) => res.status(status).json(error)) }

  })

}


let newPassword = async (req, res) => {

  const { token, password } = req.body

  try {

    let _user = await User.findOne({ remmemberToken: token, expiresToken: { $gt: Date.now() }, deleted: false })

    if (!_user) throw { status: 404, msg: "Url has been expired !" }

    let _password = await bcrypt.hash(password, 10)

    _user.password = _password

    _user.remmemberToken = null

    await _user.save()

    res.status(200).json({ status: 200, msg: "password has been changed successfuly" })

  } catch (err) { handleError(err, (status, error) => res.status(status).json(error)) }

}


let verifyToken = async (req, res) => {

  const { token } = req.body

  try {

    if (!token) throw { status: 404, msg: "Url has been expired !" }

    let user = await User.findOne({ remmemberToken: token, expiresToken: { $gt: Date.now() }, deleted: false })

    if (!user) throw { status: 404, msg: "Url has been expired !" }

    res.status(200).json({ msg: "Url is valid" })

  } catch (err) { handleError(err, (status, error) => res.status(status).json(error)) }

}


module.exports = { login, register, logout, checkAuth, reset, verifyToken, newPassword }
