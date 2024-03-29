require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const axios = require("axios");
const API_KEY = process.env.API_KEY;
const app = express();
const session = require("express-session");
const SECRET_SESSION = process.env.SECRET_SESSION;
const passport = require("./config/ppConfig");
const flash = require("connect-flash");
const router = express.Router();
const methodOverride = require("method-override");

// require authorization middleware at top of page
const isLoggedIn = require("./middleware/isLoggedIn");
const { response } = require('express');
const db = require('./models');

app.set('view engine', 'ejs');
app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use(methodOverride('_method'));

//secret: what we are giving back to the user to use our site / session cookie
//resave: save the session even if it's modified, make this false
//saveUninitialized: if its a new session, we'll save it, therefore setting this to true

app.use(session({
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}))

//initialize passport and run session as middleware
app.use(passport.initialize());
app.use(passport.session());

//flash for temporary messages to the user
app.use(flash());

//middleware to have our messages accessible to every view
app.use((req, res, next)=>{
  //before every route we will attach our current user to res.local
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
})

app.get('/', (req, res) => {
  //res.locals.alerts = req.flash();
  res.render('index', {alerts: res.locals.alerts });
});

//Recipes Page
//pulling data from API
app.get("/recipes", (req, res) => {
  //console.log(req.query)
  let search = req.query.searchRecipe;
  axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${search}&visualizeIngredients=true&apiKey=${API_KEY}`)
  .then((response) => {
    let searchResults = response.data.results;
    //console.log(searchResults)
    res.render("recipes", {recipes: searchResults, user: req.user});
  })
  .catch(err => {
    console.log(err);
  })
})

//grabbing recipe details based on id
app.get("/details/:id", (req,res) => {
  //console.log("71", req.params.id);
  let recipeID = req.params.id;
  //console.log(recipeID)
  axios.get(`https://api.spoonacular.com/recipes/${recipeID}/information?includeNutrition=true&apiKey=${API_KEY}`)
  .then((response)=>{
    let recipeDetails = response.data;
    //console.log(recipeDetails);
    //console.log("78", recipeDetails.nutrition.ingredients);
    db.comments.findAll({
      where: { recipeId: recipeID },
      include: [db.user]
    })
    .then(comments=>{
      //console.log(req.user)
      res.render("details", {details: recipeDetails, comments, user: req.user});
      }
    )
    .catch(err=>{
      res.send("error", err);
    })
  })
  .catch(err=>{
    console.log(err)
  })
})
// GET ROUTES
app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', {user: req.user});
});

app.use("/favorites", isLoggedIn, require("./routes/favorites")) 
app.use("/comments", require("./routes/comments"))
app.use("/user", require("./routes/user"))
//AUTH
app.use('/auth', require('./routes/auth'));
//GLOBAL ERROR PAGE
app.get('*', (req, res) => {
  res.render('error')
})
//PORT
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`YOU ARE ON PORT ${port} 😎`);
});

module.exports = server;
