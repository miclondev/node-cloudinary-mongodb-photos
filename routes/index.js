const express = require('express')
const router = express.Router()
const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('user')
const Info = require('../data/info') 
const Category = mongoose.model('category')
//create a function to get render pages
renderPages = (route, page, title) => {
    router.get(route, (req, res) => {
        res.render(page, { title: title })
    })
}
//pages rendered
const { pageTitles } = Info

router.get('/', (req, res) => {
    Category.find({}, (err, found) => {
        if (err) { return res.send(err) }
        res.render('landing', { categories: found })
    })
})

renderPages("/register", "register", pageTitles.register) //registration page
renderPages("/login", "login", pageTitles.login) //login

router.post("/register", (req, res) => {
    const { username, email, password } = req.body

    const newUser = new User({ username, email })

    User.register(newUser, password, (err, user) => {
        if (err) {
            console.log(err)
            return res.send('error registering user')
        }
        passport.authenticate("local")(req, res, () => {
            let backURL = req.header('Referer') || '/';
            res.redirect(backURL)
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