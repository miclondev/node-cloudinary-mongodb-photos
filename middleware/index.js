const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

middlewareObj.isAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        return next()
    }
    res.redirect('/')
}


middlewareObj.doneLogged = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect("/")
    }
    return next()
}

middlewareObj.canUpload = (req, res, next) => {
    if (req.user.isAdmin || req.user.canUpload) {
        return next()
    }
    res.redirect('/')
}

module.exports = middlewareObj