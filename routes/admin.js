const express = require('express')
const router = express.Router()
//mongo
const mongoose = require('mongoose')
const Category = mongoose.model('category')
const User = mongoose.model('user')
const Photo = mongoose.model('photo')
const Collection = mongoose.model('collection')
const Setting = mongoose.model('setting')
//middleware

const { isLoggedIn, isAdmin } = require('../middleware')
//upload image to cloud
const { upload, cloudinary } = require('../funcs/uploadCategoryImage')


router.use(isLoggedIn)
router.use(isAdmin)


//upload category
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

//category route
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

//
router.get('/collections/:page', (req, res) => {
    Collection.find({})
        .sort({ created_on: -1 })
        .populate('content.images')
        .exec((err, collections) => {
            // console.log(collections)
            res.render('admin/collection', { collections })
        })
})

//admin index
router.get('/', (req, res) => {
    res.render('admin/index')
})

//admin home settings
router.get('/home', async (req, res) => {
    Setting.findById('5b3c6a6b8d4ece12788f4290')
        .populate('homeImage')
        .exec((err, setting) => {
            if (err) {
                return res.send(err)
            }
            console.log(setting)
            res.render('admin/home', { setting })
        })
})

//get users
router.get('/users', (req, res) => {
    User.find({})
        .sort({ joined_on: -1 })
        .exec((err, users) => {
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
    Photo.findById(id).then((found) => {
        found.status.approved = !found.status.approved
        found.save((err, saved) => {
            if (err) {
                return res.send(err)
            }
            console.log('update', saved)
            res.redirect('back')
        })
    })
})

router.put('/photos/featured/:id', (req, res) => {
    const { id } = req.params
    Photo.findById(id).then((found) => {
        found.status.featured = !found.status.featured
        found.save((err, saved) => {
            if (err) {
                return res.send(err)
            }
            console.log('update', saved)
            res.redirect('back')
        })
    })
})


// router.put('/photos/unapprove/:id', (req, res) => {
//     const { id } = req.params

//     Photo.findByIdAndUpdate(id, item, (err, updated) => {
//         if (err) {
//             console.log(err)
//             return res.send(err)
//         }
//         res.redirect('back')
//     })
// })

router.post('/multi/approve', (req, res) => {
    console.log(req.body)
    const { ids } = req.body
    ids.forEach(id => {
        Photo.findById(id).then((found) => {
            found.status.approved = true
            found.save((err, saved) => {
                if (err) {
                    console.log(err)
                    return res.send(err)
                }
                console.log('updated')
            })
        })
    })
    res.send('successful')
})

router.post('/multi/featured', (req, res) => {
    console.log(req.body)
    const { ids } = req.body
    ids.forEach(id => {
        Photo.findById(id).then((found) => {
            found.status.featured = true
            found.save((err, saved) => {
                if (err) {
                    console.log(err)
                    return res.send(err)
                }
                console.log('updated')
            })
        })
    })
    res.send('successful')
})

router.post('/multi/unfeatured', (req, res) => {
    console.log(req.body)
    const { ids } = req.body
    ids.forEach(id => {
        Photo.findById(id).then((found) => {
            found.status.featured = false
            found.save((err, saved) => {
                if (err) {
                    console.log(err)
                    return res.send(err)
                }
                console.log('updated')
            })
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


router.put('/home', (req, res) => {
    console.log(req.body)
    Setting.findByIdAndUpdate('5b3c6a6b8d4ece12788f4290', req.body, (err, updated) => {
        if (err) {
            return res.send(err)
        }
        res.redirect('back')
    })
})

router.put('/set-featured-image', (req, res) => {
    console.log(req.body.imageId)
    Setting.findByIdAndUpdate('5b3c6a6b8d4ece12788f4290',
        { homeImage: req.body.imageId },
        (err, updated) => {
            if (err) {
                return res.send(err)
            }
            res.redirect('back')
        })
})

router.get('/photos/fetch', (req, res) => {
    console.log('skip', req.query.skip)
    const skipValue = parseInt(req.query.skip)

    Photo.find({})
        .sort({ created_on: -1 })
        .populate('user', 'username')
        .limit(9)
        .skip(skipValue)
        .exec((err, photos) => {
            if (err) {
                return res.send(err)
            }
            console.log('photos fetched')
            res.json(photos)
        })
})

router.get('/generate-related', async (req, res) => {
    const initialPhotos = await Photo.find({}).limit(1).sort({ created_on: -1 })

    initialPhotos.forEach(async (photo, number) => {
        let relatedIds = []
        const photoTags = photo.tags.split(',')

        photoTags.forEach(async (tag, num) => {
            console.log(num)
            relatedIds.push([])
            const images = await Photo.find({ $text: { $search: tag } })
            images.forEach(image => {
                console.log(image._id)
                relatedIds[num].push(image._id)
            })
            console.log(relatedIds)
        })


        res.send('complete')

    })
})

router.post('/collection/edit', (req, res) => {
    const { action, id } = req.body
    console.log(id)
 
    
    Collection.findById(id).then(collection => {
        console.log(action === 'approve')
        if (action === 'approve') {
            collection.status.approved = !collection.status.approved
        }
        if(action === 'feature'){
            collection.status.featured = !collection.status.featured
        }
        
        collection.save((err, saved) => {
            if (err) {
                console.log(err)
                return res.send(err)
            }
            res.json({ status: 'success', response: collection.status})
        })
    })
})


module.exports = router