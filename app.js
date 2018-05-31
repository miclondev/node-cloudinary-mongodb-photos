//initialize express bodyparser mongoose passport localstrategy
const express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        passport = require("passport"),
        LocalStrategy = require("passport-local"),
        methodOverride = require("method-override")

//Bring in the router   
