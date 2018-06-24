const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Photo = mongoose.model('photo')
const Category = mongoose.model('category')
const { isLoggedIn } = require('../middleware')
const { upload, cloudinary } = require('../funcs/uploadMainImage')
//get recent photos
router.get('/p/:page', async (req, res) => {
    const page = parseInt(req.params.page)
    let limit = 12
    const skip = (page * limit) - limit;
    let filter = { 'status.approved': true }
    const count = await Photo.count(filter)
    console.log(count)
    Photo.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ created_on: -1 })
        .exec((err, photos) => {
            if (err) {
                console.log(err)
                return res.send(err)
            }
            res.render('photos/index', { photos, count })
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

router.post('/', upload, async (req, res) => {
    try {
        const result = await cloudinary.v2.uploader.upload(req.file.path,
            { public_id: req.file.filename, folder: '/photos' })
        console.log('result', result)
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
        const created = await (new Photo(photoObj)).save()
        console.log('created', created)
        
        res.send('uploaded')
    } catch (err) {
        res.send(err)
        console.log(err)
    }
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

//delete image
router.delete('/:id', (req, res) => {
    console.log(req.params.id)
    Photo.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        res.redirect('back')
    })
})

module.exports = router