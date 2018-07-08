const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Photo = mongoose.model('photo')
const Category = mongoose.model('category')
const { isLoggedIn } = require('../middleware')
const { upload, cloudinary } = require('../funcs/uploadMainImage')

//json photos
router.get('/json', async (req, res) => {
    console.log(req.query)

    let filter = { 'status.approved': true }
    let sort

    if (req.query.sort === 'likes') {
        sort = { likes: -1 }
    }
    else {
        sort = { created_on: -1 }
    }

    if (req.query.category !== 'All') {
        filter.category = req.query.category
    }
    console.log(req.query.category !== 'All')

    Photo.find(filter)
        .sort(sort)
        .skip(parseInt(req.query.skip))
        .limit(24)
        .populate('user', 'username')
        .exec((err, photos) => {
            if (err) {
                console.log(err)
                return res.send(err)
            }
            if (req.user) {
                res.json({ images: photos, cart: req.user.cart.photos, like: req.user.like.photos })
            } else {
                res.json({ images: photos, cart: undefined, like: undefined })
            }
        })
})

//get recent photos
// router.get('/p/:page', async (req, res) => {
//     const page = parseInt(req.params.page)

//     let queryParams = '?'

//     const queryValues = Object.values(req.query)
//     const queryKeys = Object.keys(req.query)

//     queryValues.forEach((value, i) => {
//         if (i === 0) {
//             queryParams = queryParams + `${queryKeys[i]}=` + value
//         } else {
//             queryParams = queryParams + `&${queryKeys[i]}=` + value
//         }
//     })

//     const currentUrl = `/photos${req.path}${queryParams}`
//     // console.log(queryParams)
//     // console.log(currentUrl)

//     //filter
//     let filter
//     let currentCategory
//     let sort
//     let userQuery

//     if (req.query.category === 'all') {
//         filter = {
//             'status.approved': true,
//         }
//     } else {
//         filter = {
//             'status.approved': true,
//             'category': req.query.category || null,
//         }
//         currentCategory = await Category.findById(req.query.category)
//             .then(cat => cat.name)
//     }

//     if (req.query.user) {
//         filter.user = req.query.user
//         userQuery = `&user=${req.query.user}`
//     }

//     console.log(userQuery)

//     console.log(filter)


//     const count = await Photo.count(filter)
//     const categories = await Category.find({})

//     let limit = 24

//     const numOfPages = Math.ceil(count / limit)

//     const skip = (page * limit) - limit;

//     Photo.find(filter)
//         .skip(skip)
//         .limit(limit)
//         .sort({ created_on: -1 })
//         .populate({ path: 'user', select: 'username image.name' })
//         .exec((err, photos) => {
//             if (err) {
//                 console.log(err)
//                 return res.send(err)
//             }
//             //console.log(photos)
//             res.render('photos/index', {
//                 photos,
//                 count,
//                 categories,
//                 numOfPages,
//                 page,
//                 currentUrl,
//                 currentCategory,
//                 queryParams,
//                 userQuery
//             })
//         })
// })

//get all categories

router.get('/browse', async (req, res) => {
    const categories = await Category.find({})
    res.render('photos/index', { categories })
})

router.get('/categories', (req, res) => {
    Category.find({}, (err, found) => {
        if (err) {
            return res.send(err)
        }
        res.render('photos/category', { categories: found })
    })
})

//get photos by category
router.get('/category/:id', (req, res) => {
    Photo.find({ category: req.params.id })
        .skip(0)
        .limit(12)
        .sort({ created_on: -1 })
        .exec((err, found) => {
            if (err) {
                return res.send(err)
            }
            console.log(found)
            res.render('photos/index', { photos: found })
        })
})

router.post('/', upload, async (req, res) => {
    console.log(req.file)
    try {
        const result = await cloudinary.v2.uploader.upload(req.file.path,
            { public_id: req.file.filename, folder: '/photos' })
        console.log('result', result)
        const photoObj = {
            title: 'temptitle' + Date.now(),
            user: req.user._id,
            image: {
                name: `${result.original_filename}.${result.format}`,
                url: result.url,
                secure_url: result.secure_url,
                public_id: result.public_id
            }
        }
        const created = await (new Photo(photoObj)).save()
        console.log('created', created)
        res.json({ "response": "uploaded", "id": created._id })
    } catch (err) {
        res.send(err)
        console.log(err)
    }
})

//single photo route
router.get('/:title', (req, res) => {
    console.log(req.params.title)
    Photo.findOne({ slug: req.params.title })
        .populate('user')
        .exec((err, photo) => {
            if (err) {
                console.log(err)
            } else {
                console.log(photo)
                res.render("photos/show", { photo })
            }
        })
})



//delete image
router.delete('/:id', (req, res) => {
    console.log(req.params.id)
    Photo.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err)
            return res.send(err)
        }
        res.redirect('back')
    })
})

module.exports = router