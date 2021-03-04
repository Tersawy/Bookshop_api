const mongoose = require("mongoose")

const Book = require("../Models/Book")

const Genre = require("../Models/BooksGenre")

const handleError = require("../helpers/handleError")



exports.readBooks = (req, res) => {

    const { perPage, page } = req.query
  
    let _limit = /^\d+$/.test(perPage) ? +perPage : 10
  
    let _page = /^\d+$/.test(page) ? +page : 1

    let userInfo = "_id username"

    Promise.all([

        Book.find({ deleted: false })
            .populate("genre", "_id name")
            .populate("created_by", userInfo)
            .populate("updated_by", userInfo)
            .sort({ created_at: -1 }).skip((_page - 1) * _limit).limit(_limit),

        Book.find({ deleted: false }).countDocuments()
    ]).then(result => {

        res.status(200).json({ books: { docs: result[0], count: result[1] } })

    }).catch(err => handleError(err, (status, error) => res.status(status).json(error)))
}


exports.getBook = (req, res) => {

    const { _id } = req.params

    Book.findOne({ _id: mongoose.Types.ObjectId(_id) }, (err, book) => {

        if (err) return handleError(err, (status, error) => res.status(status).json(error))

        if (!book) return res.status(404).json({ msg: "Book is not found" })

        res.status(200).json({ book })

    })

}


exports.createBook = async (req, res) => {

    const { title, description, author, quantity, price, genre, currentUser } = req.body

    try {

        let _genre = await Genre.findOne({ deleted: false, _id: mongoose.Types.ObjectId(genre)})

        if (!_genre) throw { status: 404, field: "genre", msg: "Genre is not found" }
        
        if (!_genre.approved) throw { status: 422, field: "genre", msg: "Please approve the Genre first before adding the book" } 
    
        let _book = new Book({ title, description, author, quantity, price, genre, created_by: currentUser._id })
    
        let book = await _book.save()
    
        res.status(200).json({ book })

    } catch(err) { handleError(err, (status, error) => res.status(status).json(error)) }

}


exports.updateBook = async (req, res) => {

    const { _id, title, description, author, quantity, price, genre, currentUser } = req.body

    try {

        let _genre = await Genre.findOne({ deleted: false, _id: mongoose.Types.ObjectId(genre) })
    
        if (!_genre) throw { status: 404, field: "genre", msg: "Genre is not found" }

        if (!_genre.approved) throw { status: 422, field: "genre", msg: "Please approve the Genre first before updating the book" } 

        let data = { title, description, author, quantity, price, genre, updated_by: currentUser._id, updated_at: Date.now() }
    
        let result = await Book.updateOne({ _id: mongoose.Types.ObjectId(_id) }, data)
    
        if (!result.n) throw { status: 404, field: "_id", msg: "Book is not found" }
    
        if (!result.nModified) throw { status: 422, field: "_id", msg: "Nothing changed to update!" }

        res.status(200).json({ msg: "The Book has been updated successfully" })

    } catch(err) { handleError(err, (status, error) => res.status(status).json(error)) }

}


exports.approveBook = (req, res) => {

    const { _id } = req.body

    let data = { approved: true }

    Book.updateOne({ _id: mongoose.Types.ObjectId(_id) }, data, (err, result) => {

        if (err) return handleError(err, (status, error) => res.status(status).json(error))

        if (!result.n) return res.status(404).json({ msg: "Book is not found" })

        res.status(200).json({ msg: "The Book has been approved successfully" })
    })

}


exports.moveBookToTrash = (req, res) => {

    const { _id, currentUser } = req.body

    let data = { deleted: true, deleted_at: Date.now(), deleted_by: currentUser._id }

    Book.updateOne({ _id: mongoose.Types.ObjectId(_id) }, data, (err, result) => {

        if (err) return handleError(err, (status, error) => res.status(status).json(error))

        if (!result.n) return res.status(404).json({ msg: "Book is not found" })

        res.status(200).json({ msg: "The Book has been moved to trash successfully" })
    })

}


exports.restoreBook = (req, res) => {

    const { _id } = req.body

    let data = { deleted: false }

    Book.updateOne({ _id: mongoose.Types.ObjectId(_id) }, data, (err, result) => {

        if (err) return handleError(err, (status, error) => res.status(status).json(error))

        if (!result.n) return res.status(404).json({ msg: "Book is not found" })

        res.status(200).json({ msg: "The Book has been restored successfully" })
    })
}


exports.deletedBooks = (req, res) => {

    const { perPage, page } = req.query
  
    let _limit = /^\d+$/.test(perPage) ? +perPage : 10
  
    let _page = /^\d+$/.test(page) ? +page : 1

    let userInfo = "_id username"

    Promise.all([

        Book.find({ deleted: true })
            .populate("genre", "_id name")
            .populate("created_by", userInfo)
            .populate("deleted_by", userInfo)
            .sort({ deleted_at: -1 }).skip((_page - 1) * _limit).limit(_limit),

        Book.find({ deleted: true }).countDocuments()
    ]).then(result => {

        res.status(200).json({ books: { docs: result[0], count: result[1] } })

    }).catch(err => handleError(err, (status, error) => res.status(status).json(error)))
}


exports.deleteBook = (req, res) => {

    const { _id } = req.body

    Book.deleteOne({ _id: mongoose.Types.ObjectId(_id) }, (err, result) => {

        if (err) return handleError(err, (status, error) => res.status(status).json(error))

        if (!result.n) return res.status(404).json({ msg: "Book is not found" })

        if (!result.deletedCount) throw { status: 500, msg: "Something went wrong" }

        res.status(200).json({ msg: "The Book has been deleted successfully" })
    })
}