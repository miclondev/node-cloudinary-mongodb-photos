const express = require('express')
const router = express.Router()
const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('user')
const Info = require('../data/info')
const Category = mongoose.model('category')
const Photo = mongoose.model('photo')
const { doneLogged } = require('../middleware')

//create a function to get render pages

//pages rendered
const { pageTitles } = Info

router.get('/', async (req, res) => {
    try {
        const photos = await Photo.find({}).limit(8).sort({ created_on: -1 })
        const categories = await Category.find({}).limit(4)
        res.render('landing', { photos, categories })
    } catch (err) {
        console.log(err)
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

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login"
}), (req, res) => {
    let backURL = req.header('Referer') || '/';
    res.redirect(backURL)
})

router.post("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})

module.exports = router;