
const express = require("express")

const app = express()

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config()
}

require("./database/config")

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//
//
//
//
////////////////////////////////////////////////////////////////////////////////////////////////

/*/*/ const auth = require("./routes/auth.routes")
/*/*/ const users = require("./routes/user.routes")
/*/*/ const books = require("./routes/book.routes")
/*/*/ const genres = require("./routes/genre.routes")

/*/*/ app.use("/api/v1/", auth)


/*/*/ app.use("/api/v1/users", users)
/*/*/ app.use("/api/v1/books", books)
/*/*/ app.use("/api/v1/genres", genres)

////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//
//
//
//
////////////////////////////////////////////////////////////////////////////////////////////////

const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`Server Listenning On Port: ${PORT}`))
