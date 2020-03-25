const router = require("express").Router()
const User = require("../models/user.model")
const passport = require("../helper/ppConfig")
const isLoggedId = require("../helper/isLoggedin")

router.get("/auth/signup", (req, res) => {
    res.render("auth/signup")
})

router.post("/auth/signup", (req, res) => {
    let user = new User(req.body);
    user
      .save()
      .then(() => {
        // response.redirect("/home");
        passport.authenticate('local', {
          successRedirect: "/home",
          successFlash: "Account created and You have logged In!"
        })(req, res)
      })
      .catch(err => {
        // console.log(err);
        if(err.code == 11000){
          console.log("Email Exists");
          req.fresh("error", "Email Exists");
          return res.redirect("/auth/signup")
        }
        res.send("error!!!");
      });
  });
  
  router.get("/auth/signin", (request, response) => {
  
    response.render("auth/signin");
  
  });
  
  router.get("/home", isLoggedId, (req, res) => {

    User.find().then(user => {
      res.render("home", {user});
    })
  });


router.post("/auth/signin", passport.authenticate('local', 
  {
    successRedirect:'/home', 
    failureRedirect: '/auth/sigin',
    failureFlash: 'Invalid Username or Password',
    successFlash: 'You have logged In!'
  })
)

router.get("/auth/logout", (req, res) => {
  req.logout();
  req.flash('Success', 'Yey! your out!');
  res.redirect("/auth/signin");</div>
})

// router.get("/auth/signin", (req, res) => {
//     res.render("auth/signin");
// })
module.exports = router