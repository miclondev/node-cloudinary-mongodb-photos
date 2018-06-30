const express = require('express')
const router = express.Router()
//mongoose
const mongoose = require('mongoose')
const Collection = mongoose.model('collection')

router.get('/', (req, res) => {
    Collection.find({})
        .exec((err, collections) => {
            if (err) {
                return res.send(err)
            }
            res.render('collection/index', { collections })
        })
})


module.exports = router