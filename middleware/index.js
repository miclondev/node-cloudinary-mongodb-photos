const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

middlewareObj.isAdmin = (req, res, next) => {
    if(req.user.isAdmin){
        return next()
    }
    res.redirect('/')
}

module.exports = middlewareObj