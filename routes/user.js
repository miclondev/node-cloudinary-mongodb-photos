const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Photo = mongoose.model('photo')
const Category = mongoose.model('category')


router.get('/photos/new', async (req, res) => {
    try {
        categories = await Category.find({})
    } catch (e) {
        console.log(e)
        res.send(e)
    }
    res.render('photos/new', { categories })
})

module.exports = router;
