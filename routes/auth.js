const express = require('express');
const router = express.Router();
const db = require("../models");
const passport = require("../config/ppConfig");
//const flash = require("connect-flash");

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post("/signup", (req,res)=>{
  console.log(req.body);
  db.user.findOrCreate({
    where: { email: req.body.email},
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  })
  .then(([user, created])=> {
    if (created){
      //if created, success redirect back to home
      console.log(`${user.name} was created`);
      //FLASH MESSAGE - success flash
      passport.authenticate("local", {
        successRedirect: "/",
        successFlash: "Account created and logging in"
      })(req,res);
      //before passport authenticate
      //res.redirect("/");
    } else {
      //email already exists
      console.log("email already exists")
      //FLASH MESSAGE
      req.flash("error", "Email already exists. Please try again");
      res.redirect("/auth/signup");
    }
  })
  .catch(err=>{
    console.log("error", err);
    req.flash("error", err)
    res.redirect("/auth/signup");
  });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  successFlash: "Welcome back!",
  failureFlash: "Password or email is incorrect."
}));


router.get('/logout', (req, res)=>{
  req.logOut();
  req.flash('success', 'Byeeee see you soon!')
  res.redirect('/')
})

module.exports = router;
