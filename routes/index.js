const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get("/", (req, res) => {
    console.log('we work')
    res.send("get on up")
})

module.exports = router;