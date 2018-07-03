const express = require('express')
const router = express.Router() 
//mongo
const mongoose = require('mongoose')
const Category = mongoose.model('category')
const User = mongoose.model('user')
const Photo = mongoose.model('photo')
const Collection = mongoose.model('collection')
//middleware
const { isLoggedIn, isAdmin } = require('../middleware')
//upload image to cloud
const { upload, cloudinary } = require('../funcs/uploadCategoryImage')


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
                Cats
            })
        }
    })
})

//admin index
router.get('/', (req, res) => {
    res.render('admin/index')
})

//admin home settings
router.get('/home', async (req, res) => {
    res.render('admin/home')
})

//get users
router.get('/users', (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        res.render('admin/users', { users })
    })
})

//get photos
router.get('/photos', async (req, res) => {
    const count = await Photo.count({})
    console.log(count)
    Photo.find({})
        .populate('user', 'username')
        .limit(50)
        .sort({ created_on: -1 })
        .exec((err, photos) => {
            if (err) {
                console.log(err)
                return res.send(err)
            }
            res.render('admin/photos', { photos, count })
        })
})

router.put('/photos/approve/:id', (req, res) => {
    const { id } = req.params
    const item = {
        status: {
            approved: true
        }
    }

    Photo.findByIdAndUpdate(id, item, (err, updated) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        console.log('update', updated)
        res.redirect('back')
    })
})

router.put('/photos/unapprove/:id', (req, res) => {
    const { id } = req.params
    const item = {
        status: {
            approved: false
        }
    }

    Photo.findByIdAndUpdate(id, item, (err, updated) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        res.redirect('back')
    })
})

router.post('/multi/approve', (req, res) => {
    console.log(req.body)
    const { ids } = req.body
    ids.forEach(id => {
        const item = { status: { approved: true } }
        Photo.findByIdAndUpdate(id, item, (err, updated) => {
            if (err) {
                console.log(err)
                return res.send(err)
            }
            console.log('updated')
        })
    })
    res.send('successful')
})

router.post('/multi/delete', (req, res) => {
    const { ids } = req.body
    ids.forEach(id => {
        Photo.findByIdAndRemove(id, (err) => {
            if (err) {
                return res.send(err)
                console.log(err)
            }
            console.log('deleted')
        })
    })
    res.send('successful')
})


// router.put('/multi/collection/approve', (req,res) => {

// })

module.exports = router