const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Photo = mongoose.model('photos')
const { isLoggedIn } = require('../middleware')

//get recent photos
router.get('/p/:page', (req, res) => {
    const page = parseInt(req.params.page)
    let limit = 12
    const skip = (page * limit) - limit;
    // page === 1 ? skip = 0 : skip = page * limit
    console.log(skip)
    Photo.find({}).skip(skip).limit(limit).sort({ created_on: -1 })
        .exec((err, found) => {
            if (err) {
                console.log(err)
                return res.send(err)
            }
            console.log(found)
            res.render('photos/index')
        })
})

router.post('/', isLoggedIn, (req, res) => {
    const { title, shortDesc } = req.body;
    const newPhoto = { title, shortDesc, user: req.user._id }
    Photo.create(newPhoto, (err, created) => {
        if (err) {
            console.log(err)
        } else {
            console.log(created)
        }
    })
    res.redirect('back')
})

router.get('/:title', (req, res) => {
    console.log(req.params.title)
    Photo.find({ slug: req.params.title }, (err, found) => {
        if (err) {
            console.log(err)
        } else {
            console.log(found)
            res.render("photos/show", { photos: found })
        }
    })
})

module.exports = router