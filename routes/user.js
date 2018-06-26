const express = require('express')
const router = express.Router()

//mongoose
const mongoose = require('mongoose')
const Photo = mongoose.model('photo')
const User = mongoose.model('user')
const Category = mongoose.model('category')

//middleware
const { isLoggedIn, canUpload } = require('../middleware')
//const moment = require('moment')

router.use(isLoggedIn)

router.get('/photos/new', canUpload, (req, res) => {
    Category.find({}, (err, found) => {
        if (err) {
            return res.send(err)
        }
        res.render('photos/new', { categories: found })
    })
})

router.get('/photos/new/edit', async (req, res) => {
    let now = new Date()
    let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const categories = await Category.find({})
    Photo.find({ created_on: { $gte: startOfToday }, user: req.user._id },
        (err, photos) => {
            if (err) {
                return res.send(err)
            }
            //console.log(photos)
            res.render('photos/edit', { photos, categories })
        })
})

router.put('/photos/new/edit', (req, res) => {
    console.log(req.body)
    const photoArr = Object.keys(req.body)
    photoArr.forEach(photo => {
        console.log(photo, req.body[photo])
        Photo.findByIdAndUpdate(photo, req.body[photo], (err, updated) => {
            if (err) {
                console.log(err)
                return res.send(err)
            }
            console.log('updated')
        })
    })
    res.redirect('back')
})

router.get('/photos/edit', async (req, res) => {
    let mongooseIds = []
    const ids = req.query.ids.split(',')
   // console.log(ids)
    ids.forEach(id => {
        mongooseIds.push(mongoose.Types.ObjectId(id))
    })
   // console.log(mongooseIds)
    const categories = await Category.find({})
    Photo.find({ _id: { $in: mongooseIds }, user: req.user._id })
        .populate('category')
        .exec((err, photos) => {
            if (err) {
                return res.send(err)
            }
            console.log(photos)
            res.render('photos/edit', { photos, categories })
        })
})

router.get('/profile', (req, res) => {
    console.log(req.user._id)
    User.findById(req.user._id, (err, found) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        res.render('user/profile', { userInfo: found })
    })
})

module.exports = router;
