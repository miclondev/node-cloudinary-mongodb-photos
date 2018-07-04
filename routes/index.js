const express = require('express')
const router = express.Router()
const passport = require('passport')

//mongoose
const mongoose = require('mongoose')
const User = mongoose.model('user')
const Info = require('../data/info')
const Category = mongoose.model('category')
const Photo = mongoose.model('photo')
const Setting = mongoose.model('setting')

const { doneLogged } = require('../middleware')
const { SETTINGSID } = require('../config/keys')
//pages rendered
const { pageTitles } = Info

router.get('/', async (req, res) => {
    try {
        const setting = await Setting.findById(SETTINGSID).populate('homeImage')
        const photos = await Photo.find({ 'status.featured' : true }).populate('user').limit(8).sort({ created_on: -1 })
        const categories = await Category.find({}).limit(4)
        res.render('landing', { photos, categories, setting })
    } catch (err) {
        res.send(err)
    }
})

//register route
router.get("/register", doneLogged, (req, res) => {
    res.render("register")
})

//login route
router.get("/login", doneLogged, (req, res) => {
    res.render("login")
})

//registration post route
router.post("/register", (req, res) => {
    const { username, email, password } = req.body

    const newUser = new User({ username, email })
    User.register(newUser, password, (err, user) => {
        if (err) {
            console.log(err)
            return res.send('error registering user')
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect('/')
        })
    })
})

//login
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login"
}), (req, res) => {
    let backURL = req.header('Referer') || '/';
    res.redirect(backURL)
})

//logout
router.post("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})


//search items
router.get("/search", async (req, res) => {
    console.log(req.query)
    const { type } = req.query;
    if (type === 'image') {
        const photos = await Photo.find({ $text: { $search: req.query.q } })
        console.log(photos)
        res.render('search', { photos })
    } else {
        res.render('search')
    }

})

module.exports = router;