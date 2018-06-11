const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Category = mongoose.model('category')
const { isLoggedIn, isAdmin } = require('../middleware')
const { upload, cloudinary } = require('../funcs/uploadCategoryImage')
const Icons = require('../data/faIcons.json')

router.use(isLoggedIn)
router.use(isAdmin)

router.post('/category', upload, (req, res) => {
    if (req.file) {
        cloudinary.v2.uploader.upload(req.file.path,
            { public_id: req.file.filename, folder: '/categories' },
            (err, result) => {
                console.log(result)
                if (err) {
                    console.log(err)
                    res.send(err)
                }
                //create a new category
                const newCategory = new Category(req.body.category)
                //set image url and name
                newCategory.image = {
                    name: `${result.original_filename}.${result.format}`,
                    url: result.url,
                    secure_url: result.secure_url,
                    public_id: result.public_id
                }
                
                newCategory.save((err, Cat) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(Cat)
                        res.redirect('back')
                    }
                })
            })
    } else {
        Category.create(req.body.category, (err, Cat) => {
            if (err) {
                console.log(err)
            } else {
                res.redirect('back')
            }
        })
    }
})


router.get('/category', (req, res) => {
    Category.find({}, (err, Cats) => {
        if (err) {
            console.log(err)
        } else {
            res.render('admin/category', {
                Icons,
                Cats
            })
        }
    })
})

router.get('/', (req, res) => {
    res.render('admin/index')
})

module.exports = router