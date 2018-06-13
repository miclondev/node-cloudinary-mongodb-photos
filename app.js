//initialize main app dependencies
const express = require('express'),
        app = express(),
        http = require('http').Server(app),
        io = require('socket.io')(http),
        path = require('path'),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        flash = require('connect-flash'),
        passport = require("passport"),
        LocalStrategy = require("passport-local"),
        cors = require('cors'),
        methodOverride = require("method-override"),
        session = require('express-session'),
        MongoStore = require('connect-mongo')(session),
        sassMiddleware = require('node-sass-middleware')


//mongoose models
const models = require('./models'),
        User = mongoose.model('user')

//routes
const indexRoutes = require('./routes/index')
const photoRoutes = require('./routes/photos')
const adminRoutes = require('./routes/admin')
const userRoutes = require('./routes/user')

//configuration keys
const Keys = require('./config/keys')

mongoose.connect(Keys.MONGOURI)
mongoose.connection
        .once('open', () => console.log('Connected to MongoLab'))
        .on('error', error => console.log('Error connecting to mongolab', error))

app.use('*', cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");


app.use(sassMiddleware({
        src: __dirname + '/sass',
        dest: path.join(__dirname, 'public'),
        debug: true,
        outputStyle: 'compressed',
})
)

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));

app.use(session({
        secret: Keys.SESSIONSECRET,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
                url: Keys.MONGOURI,
                autoReconnect: true
        })
}));


app.use(flash())
//passport settings
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//get access to current user
app.use((req, res, next) => {
        res.locals.currentUser = req.user
        res.locals.error = req.flash("error")
        res.locals.success = req.flash("success")
        next();
});


//using routes
app.use("/", indexRoutes)
app.use("/photos", photoRoutes)
app.use("/admin", adminRoutes)
app.use("/user", userRoutes)

//Application initiate

const PORT = process.env.PORT || 7800
// app.listen(PORT, () => {
//         console.log(`we are running on ${PORT}`)
// })

io.on('connection', (socket) => {
        console.log('a user is connected')
        socket.on('disconnect', () => {
                console.log('user disconnected')
        })
})

http.listen(PORT, () => {
        console.log(`we are running on ${PORT}`)
})