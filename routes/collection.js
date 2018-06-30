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
    .exec((err, collections) => {
        if(err){
            return res.send(err)
        }
        res.render('collection/new', { collections, categories })
    })
    
})



module.exports = router