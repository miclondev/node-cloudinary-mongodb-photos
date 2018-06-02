const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = mongoose.model('user');

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email.toLocaleLowerCase() }, (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false, 'Invalid Credentials') }
        user.comparePassword(password, (err, isMatch) => {
            if (err) { return done(err) }
            if (isMatch) {
                return done(null, user)
            }
            return done(null, false, 'Invalid credentials.')
        })
    })
}))

function signup({ fullname, email, password, req }) {
    const user = new User({ fullname, email, password })
    if (!email || !password) { throw new Error('You must provide an email and a password') }

    return User.findOne({ email })
        .then(existingUser => {
            if (existingUser) { throw new Error('Email in use') }
            return user.save()
        })
        .then(user => {
            return new Promise((resolve, reject) => { 
                req.login(user, (err) => {
                    if (err) { reject(err); }
                    resolve(user); 
                });
            })
    })
}

function login({ email, password, req }) {
    console.log(email)
    return new Promise((resolve, reject) => {
      passport.authenticate('local', (err, user) => {
        if (!user) { reject('Invalid credentials.') }
        console.log(user)
        req.login(user, () => resolve(user));
      })({ body: { email, password } });
    });
  }

module.exports = { signup, login };