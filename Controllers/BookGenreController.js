const mongoose = require("mongoose")

const Genre = require("../Models/BooksGenre")

const Book = require("../Models/Book")

const handleError = require("../helpers/handleError")


exports.readGenres = (req, res) => {

    const { perPage, page } = req.query
  
    let _limit = /^\d+$/.test(perPage) ? +perPage : 10
  
    let _page = /^\d+$/.test(page) ? +page : 1

    let userInfo = "_id username"

    Promise.all([

        Genre.find({ deleted: false })
            .populate("created_by", userInfo)
            .populate("updated_by", userInfo)
            .sort({ created_at: -1 }).skip((_page - 1) * _limit).limit(_limit),

        Genre.find({ deleted: false }).countDocuments()
    ]).then(result => {

        res.status(200).json({ genres: { docs: result[0], count: result[1] } })

    }).catch(err => handleError(err, (status, error) => res.status(status).json(error)))

}


exports.getGenre = (req, res) => {

    const { _id } = req.params

    Genre.findOne({ _id: mongoose.Types.ObjectId(_id) }, (err, genre) => {

        if (err) return handleError(err, (status, error) => res.status(status).json(error))

        if (!genre) return res.status(404).json({ msg: "Genre is not found" })

        res.status(200).json({ genre })

    })
}


exports.createGenre = (req, res) => {

    const { name, currentUser } = req.body

    let _genre = new Genre({ name, created_by: currentUser._id })

    _genre.save((err, genre) => {

        if (err) return handleError(err, (status, error) => res.status(status).json(error))

        res.status(200).json({ genre })
    })

}


exports.updateGenre = (req, res) => {

    const { _id, name, currentUser } = req.body

    let data = { name, updated_by: currentUser._id, updated_at: Date.now() }

    Genre.updateOne({ _id: mongoose.Types.ObjectId(_id) }, data, (err, result) => {

        if (err) return handleError(err, (status, error) => res.status(status).json(error))

        if (!result.n) return res.status(404).json({ msg: "Genre is not found" })

        if (!result.nModified) return res.status(422).json({ msg: "Nothing changed to update!" })

        res.status(200).json({ msg: "The Genre has been updated successfully" })
    })
}



exports.approveGenre = (req, res) => {

    const { _id } = req.body

    let data = { approved: true }

    Genre.updateOne({ _id: mongoose.Types.ObjectId(_id) }, data, (err, result) => {

        if (err) return handleError(err, (status, error) => res.status(status).json(error))

        if (!result.n) return res.status(404).json({ msg: "Genre is not found" })

        res.status(200).json({ msg: "The Genre has been approved successfully" })
    })

}


exports.moveGenreToTrash = async (req, res) => {

    const { _id, currentUser } = req.body

    try {

        let bookCount = await Book.find({ deleted: false, genre: mongoose.Types.ObjectId(_id) }).countDocuments()
    
        if (bookCount) throw { status: 422, msg: "The genre cannot be moved to the trash because it contains books" }
    
        let data = { deleted: true, deleted_at: Date.now(), deleted_by: currentUser._id }
    
        let result = await Genre.updateOne({ _id: mongoose.Types.ObjectId(_id) }, data)
        
        if (!result.n) throw { msg: "Genre is not found" }
    
        res.status(200).json({ msg: "The Genre has been moved to trash successfully" })

    } catch (err) { handleError(err, (status, error) => res.status(status).json(error)) }

}


exports.restoreGenre = (req, res) => {

    const { _id } = req.body

    let data = { deleted: false }

    Genre.updateOne({ _id: mongoose.Types.ObjectId(_id) }, data, (err, result) => {

        if (err) return handleError(err, (status, error) => res.status(status).json(error))

        if (!result.n) return res.status(404).json({ msg: "Genre is not found" })

        res.status(200).json({ msg: "The Genre has been restored successfully" })
    })
}


exports.deletedGenres = (req, res) => {

    const { perPage, page } = req.query
  
    let _limit = /^\d+$/.test(perPage) ? +perPage : 10
  
    let _page = /^\d+$/.test(page) ? +page : 1

    let userInfo = "_id username"

    Promise.all([

        Genre.find({ deleted: true })
            .populate("created_by", userInfo)
            .populate("deleted_by", userInfo)
            .sort({ deleted_at: -1 }).skip((_page - 1) * _limit).limit(_limit),

        Genre.find({ deleted: true }).countDocuments()
    ]).then(result => {

        res.status(200).json({ genres: { docs: result[0], count: result[1] } })

    }).catch(err => handleError(err, (status, error) => res.status(status).json(error)))
}


exports.deleteGenre = async (req, res) => {

    const { _id } = req.body

    try {

        let bookCount = await Book.find({ deleted: false, genre: mongoose.Types.ObjectId(_id) }).countDocuments()
    
        if (bookCount) throw { status: 422, msg: "The genre cannot be deleted because it contains books" }
    
        let result = await Genre.deleteOne({ _id: mongoose.Types.ObjectId(_id) })
        
        if (!result.n) return res.status(404).json({ msg: "Genre is not found" })
    
        if (!result.deletedCount) throw { status: 500, msg: "Something went wrong" }
    
        res.status(200).json({ msg: "The Genre has been deleted successfully" })

    } catch(err) { handleError(err, (status, error) => res.status(status).json(error)) }
}

exports.getBooksByGenre = (req, res) => {

    const { id } = req.params

    const { perPage, page } = req.query
  
    let _limit = /^\d+$/.test(perPage) ? +perPage : 10
  
    let _page = /^\d+$/.test(page) ? +page : 1

    let userInfo = "_id username"

    let query = { deleted: false, genre: mongoose.Types.ObjectId(id) }

    Promise.all([

        Book.find(query)
            .populate("created_by", userInfo)
            .populate("updated_by", userInfo)
            .sort({ created_at: -1 }).skip((_page - 1) * _limit).limit(_limit),

        Book.find(query).countDocuments()
    ]).then(result => {

        res.status(200).json({ books: { docs: result[0], count: result[1] } })

    }).catch(err => handleError(err, (status, error) => res.status(status).json(error)))

}