const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Photo = mongoose.model('photo')
const Category = mongoose.model('category')
const { isLoggedIn } = require('../middleware')
const { upload, cloudinary } = require('../funcs/uploadMainImage')
//get recent photos
router.get('/p/:page', (req, res) => {
    const page = parseInt(req.params.page)
    let limit = 12
    const skip = (page * limit) - limit;
    Photo.find({}).skip(skip).limit(limit).sort({ created_on: -1 })
        .exec((err, found) => {
            if (err) {
                console.log(err)
                return res.send(err)
            }
            console.log(found)
            res.render('photos/index', { photos: found })
        })
})

//get all categories
router.get('/categories', (req, res) => {
    Category.find({}, (err, found) => {
        if (err) {
            return res.send(err)
        }
        res.render('photos/category', { categories: found })
    })
})

//get photos by category
router.get('/category/:id', (req, res) => {
    Photo.find({ category: req.params.id })
        .skip(0)
        .limit(12)
        .sort({ created_on: -1 })
        .exec((err, found) => {
            if (err) {
                return res.send(err)
            }
            console.log(found)
            res.render('photos/index', { photos: found })
        })
})

router.post('/', upload, (req, res) => {
    console.log(req.file)
    cloudinary.v2.uploader.upload(req.file.path,
        { public_id: req.file.filename, folder: '/photos' },
        (err, result) => {
            if (err) {
                return res.send(err)
            }
            console.log(result)
            const photoObj = {
                title: 'temptitle' + Date.now(),
                user: req.user._id,
                image: {
                    name: `${result.original_filename}.${result.format}`,
                    url: result.url,
                    secure_url: result.secure_url,
                    public_id: result.public_id
                }
            }
            Photo.create(photoObj, (err, created) => {
                if (err) {
                    console.log(err)
                    return res.send(err)
                }
                console.log(created)
                res.send('uploaded')
            })
        }
    )
})

//single photo route
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