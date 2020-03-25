require('dotenv').config()
const express = require("express");
const POST = process.env.PORT;
const mongoose = require("mongoose")
const expressLayouts = require("express-ejs-layouts")


const authRoutes = require("./routes/auth.routes")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("./helper/ppConfig")

const app = express();

mongoose.connect(
    process.env.MONGODB,
    {
        useNewUrlParser : true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
    () => {
      console.log("mongodb running!");
    },
    err => {
      console.log(err);
    }
  );

  mongoose.set("debug", true)
  app.use(express.static("public"))
  app.use(express.urlencoded({extended: true}))
  app.use(expressLayouts)
  app.set("view engine", "ejs")

  app.use(
    session({
      secret: process.env.SECRET,
      saveUninitialized: true,
      resave: false
      // cookie: { maxAge: 360000 } //duration of session
    })
  );

  app.use(passport.initialize());
  app.use(passport.session())
  app.use(flash())

  app.use((req, res, next) => {
    res.locals.alert = req.flash();
    res.locals.currentUser = req.user;
    console.log(res.locals.alerts);
    next();
  })

  app.use(authRoutes)

  app.get("*", (request, response) => {

    response.send("doesnt exist yet!");
  
  });

app.listen(POST, () => console.log(`Express running on ${POST}`))