const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Category = mongoose.model('category')


router.post('/create_category', (req, res) => {
    const newCat = { name: req.body.name }
    Category.create(newCat, (err, created) => {
        err ? console.log(err) : console.log(created)
    })
    res.redirect('back')
})

router.get('/create_categories', (req,res) => {
    res.render('/admin/categories')
})

module.exports = router