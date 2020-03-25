const router = require("express").Router()
const User = require("../models/user.model")
const passport = require("../helper/ppConfig")
const isLoggedId = require("../helper/isLoggedin")
const {check, validationResult} = reqire("express-validator")

router.get("/auth/signup", (req, res) => {
    res.render("auth/signup")
})

router.post("/auth/signup", 
  [
    check("firstname").isLength({ min: 2 }),
    check("lastname").isLength({ min: 2 }),
    // username must be an email
    check("email").isEmail(),
    // password must be at least 5 chars long
    check("password").isLength({ min: 5 })
  ],
    (req, res) => {
    
    const errors = validationResult(request);
    console.log(errors);
    if (!errors.isEmpty()) {//if is error
      request.flash("autherror", errors.errors);
      return response.redirect("/auth/signup");//and start from her
    }
//     If hes input is rgiht
    let user = new User(req.body);
    user
      .save()
      .then(() => {
        // response.redirect("/home");
    //user login after registration
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
    }
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
  req.flash('success', 'Yey! your out!');
  res.redirect("/auth/signin");</div>
})

// router.get("/auth/signin", (req, res) => {
//     res.render("auth/signin");
// })
module.exports = router
