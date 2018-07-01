const express = require('express')
const router = express.Router()
//mongoose
const mongoose = require('mongoose')
const Collection = mongoose.model('collection')
const Photos = mongoose.model('photo')
const Category = mongoose.model('category')
const { isLoggedIn } = require('../middleware')

router.get('/', (req, res) => {
    Collection.find({})
        .populate('content.images')
        .exec((err, collections) => {
            if (err) {
                return res.send(err)
            }
            res.render('collection/index', { collections })
        })
})

router.post('/', isLoggedIn, (req, res) => {

    const { collection } = req.body
    collection.user = req.user._id
    // console.log(collection)
    // res.redirect('back')
    Collection.create(collection, (err, created) => {
        if (err) {
            return res.send(err)
        }
        console.log(created)
        res.redirect('back')
    })
})

router.get('/new', isLoggedIn, async (req, res) => {
    const categories = await Category.find({})
    Collection.find({ user: req.user._id })
        .sort({ created_on: -1 })
        .populate('content.images')
        .exec((err, collections) => {
            if (err) {
                return res.send(err)
            }
            console.log(collections)
            res.render('collection/new', { collections, categories })
        })
})

router.put('/', isLoggedIn, (req, res) => {
    const images = req.body.images.split(',')
    console.log(images)
    Collection.findById(req.body.collection).exec((err, col) => {
        console.log(col)
        images.forEach(image => {
            col.content.images.push(image)
            col.contentCount++
        })
        console.log(col)
        col.save()
        res.redirect('back')
    })

})


module.exports = router