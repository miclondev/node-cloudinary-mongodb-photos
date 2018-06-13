const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Photo = mongoose.model('photo')
const Category = mongoose.model('category')
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


router.get('/recent_uploaded', isLoggedIn, (req, res) => {
    let now = new Date()
    let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    Photo.find({ created_on: { $gte: startOfToday }, user: req.user._id },
        (err, found) => {
            if (err) {
                return res.send(err)
            }
            console.log(found)
            res.send(found)
        })
})

module.exports = router;
