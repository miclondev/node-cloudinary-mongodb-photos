const multer = require('multer')
const multers3 = require('multer-s3')
const AWS = require('aws-sdk')
const path = require('path')

// AWS.config.update({
//     accessKeyId: ,
//     secretAccessKey: ,
// })

const s3 = new AWS.s3()

const storage = multers3({
    s3,
    bucket: '',
    acl: 'public-read',
    key: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage
}).single('image')

module.exports = upload;