const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Category = mongoose.model('category')

router.post('/create_categories', (req, res) => {
    const newCat = { name: req.body.name }
    Category.create(newCat, (err, created) => {
        err ? console.log(err) : console.log(created)
    })
    res.redirect('back')
})

module.exports = router