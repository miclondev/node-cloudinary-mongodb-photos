const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Footage = mongoose.model('footage')
const Category = mongoose.model('category')
const { isLoggedIn } = require('../middleware')
const { upload, cloudinary } = require('../funcs/uploadFootage')

router.post('/', upload, async (req, res) => {
    console.log(req.file)
    try {
        const result = await cloudinary.v2.uploader.upload(req.file.path,
            { resource_type: "video",public_id: req.file.filename, folder: '/footage' })
        console.log('result', result)
        const footageObj = {
            title: 'temptitle' + Date.now(),
            user: req.user._id,
            image: {
                name: `${result.original_filename}.${result.format}`,
                url: result.url,
                secure_url: result.secure_url,
                public_id: result.public_id
            }
        }
        const created = await (new Footage(footageObj)).save()
        console.log('created', created)
        res.json({ "response": "uploaded", "id": created._id })
    } catch (err) {
        res.send(err)
        console.log(err)
    }
})

module.exports = router