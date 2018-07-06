const express = require('express')
const router = express.Router()
const { upload, cloudinary } = require('../funcs/uploadProfileImage')

//mongoose
const mongoose = require('mongoose')
const Photo = mongoose.model('photo')
const User = mongoose.model('user')
const Category = mongoose.model('category')

//middleware
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

router.get('/photos/new/edit', async (req, res) => {
    let now = new Date()
    let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const categories = await Category.find({})
    Photo.find({ created_on: { $gte: startOfToday }, user: req.user._id },
        (err, photos) => {
            if (err) {
                return res.send(err)
            }
            //console.log(photos)
            res.render('photos/edit', { photos, categories })
        })
})

router.put('/photos/new/edit', (req, res) => {
    console.log(req.body)
    const photoArr = Object.keys(req.body)
    photoArr.forEach(photo => {
        console.log(photo, req.body[photo])
        Photo.findByIdAndUpdate(photo, req.body[photo], (err, updated) => {
            if (err) {
                console.log(err)
                return res.send(err)
            }
            console.log('updated')
        })
    })
    res.redirect('back')
})

router.get('/photos/edit', async (req, res) => {
    let mongooseIds = []
    const ids = req.query.ids.split(',')
    // console.log(ids)
    ids.forEach(id => {
        mongooseIds.push(mongoose.Types.ObjectId(id))
    })
    // console.log(mongooseIds)
    const categories = await Category.find({})
    Photo.find({ _id: { $in: mongooseIds }, user: req.user._id })
        .populate('category')
        .exec((err, photos) => {
            if (err) {
                return res.send(err)
            }
            console.log(photos)
            res.render('photos/edit', { photos, categories })
        })
})

router.get('/profile', async (req, res) => {
    try {
        const photos = await Photo.find({ user: req.user._id }).limit(4).sort({ created_on: -1 })
        await User.findById(req.user._id, (err, user) => {
            if (err) {
                console.log(err)
                return res.send(err)
            }
            res.render('user/profile', { user,photos })
        })
    } catch (error) {
        res.send(error)
    }
})

router.put('/', (req, res) => {
    console.log(req.body)

    User.findByIdAndUpdate(req.user._id, req.body.user, (err, updated) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        res.redirect('back')
    })
})

//response for jquery get adding to gallery
router.get('/photos', (req, res) => {
    console.log('skip', req.query.skip)
    const skipValue = parseInt(req.query.skip)

    Photo.find({ user: req.user._id })
        .sort({ created_on: -1 })
        .populate('category', 'name')
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


//upload profile image
router.put('/profile-image', upload, (req, res) => {
    try {
        User.findById(req.user._id).then(async (user) => {
            if (user.image.name) {
                await cloudinary.v2.uploader.destroy(user.image.public_id, (err, deleted) => {
                    console.log(deleted)
                })
            }
            const result = await cloudinary.v2.uploader.upload(req.file.path,
                { public_id: req.file.filename, folder: '/user' })
            console.log('result', result)

            user.image = {
                name: `${result.original_filename}.${result.format}`,
                url: result.url,
                secure_url: result.secure_url,
                public_id: result.public_id
            }
            console.log(user)
            user.save()
            res.redirect('back')
        })
    } catch (e) {
        res.send(e)
    }
})


router.put('/follow/:id', async (req, res) => {
    try {
        await User.findById(req.params.id).then(follow => {
            follow.followers.account.push(req.user._id)
            follow.save()
        })

        await User.findById(req.user._id).then(user => {
            user.following.account.push(req.params.id)
            user.save()
        })

        res.redirect('back')
    } catch (e) {
        res.send(e)
    }
})

router.post('/like', async (req, res) => {
    const { photoId } = req.body
    await Photo.findById(photoId).then(photo => {
        console.log(photo)
        photo.likes = photo.likes+1
        console.log(photo.likes)

        photo.save((err, save) => {
            if(err){
                console.log(err)
            }
        })
    })
    await User.findById(req.user._id).then(user => {
        user.like.photos.push(photoId)
        user.save()
    })
    res.send('liked')
})

router.post('/add-to-cart', (req, res) => {
    const { photoId } = req.body
    User.findById(req.user._id).then(user => {
        user.cart.photos.push(photoId)
        user.save((err, save) => {
            if (err) {
                return res.send(err)
            }
            res.send('added')
        })
    })
})

module.exports = router;
