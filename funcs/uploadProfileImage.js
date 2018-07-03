const multer = require('multer')
const path = require('path')
const cloudinary = require('cloudinary')
const { CLOUDINARYKEY,CLOUDINARYSECRET,CLOUDINARYNAME } = require('../config/keys')
//set storage engine
const storage = multer.diskStorage({
    filename: function(req, file, cb){
        cb(null, 'userimage-' + Date.now());
    }
});

const imageFilter = function (req, file, cb){
    if(!file.originalname.match(/\.(jpg|png|jpeg|gif)$/i)){
        return cb(new Error('Only Image files are allowed'))
    }
    cb(null, true)
}

const upload = multer({
    storage,
    fileFilter: imageFilter
}).single('image')

cloudinary.config({
    cloud_name: CLOUDINARYNAME,
    api_key: CLOUDINARYKEY,
    api_secret: CLOUDINARYSECRET
})

module.exports = { upload, cloudinary };