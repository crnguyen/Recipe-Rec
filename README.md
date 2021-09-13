# RecipeRec

Homepage - not logged in 
![Imgur Image](https://i.imgur.com/pb3hvSv.jpg)

Example of recipe page after a search
![Imgur Image](https://i.imgur.com/vdKzSuD.jpg)

Details page for a recipe
![Imgur Image](https://i.imgur.com/s0kuYVs.jpg)

Favorite Recipes page
![Imgur](https://imgur.com/nCCHbu5.jpg)

## Link to App

https://reciperec-cristina.herokuapp.com

## Concept and User Stories

Site concept: A way to stay connected through food. Search, save, and comment on recipes.

* User needs to be able to login to access recipes, and add comments and favorites.
* User needs to be able to navigate between homepage, favorited recipes, and recipes page.
* User needs to be able to have the option to add to/delete from their favorites.
* User needs to be able to comment on the recipes that they find, and view other people's comments.
* User need to have a profile page where they can edit account information.

## Features

* Login Authentication
* Sessions to keep user logged in between pages
* Flash messages for login/logout errors and successes
* EJS Templating and EJS Layouts
* Models that interact with databases using Sequelize
* RESTful routing
* Search recipes using the Spoonacular API
* Favorites page that can be updated by adding, deleting, and editing recipes
* Profile page where user can edit their email or delete their account

## Models
#### User Model
| Column name   | Data Type     | Notes                               | 
| ------------- | ------------- | ----------------------------------  | 
| id            | integer       | Serial primary key - auto generated |
| name          | string        | must be provided                    |
| email         | string        | must be unique, used for login      |
| password      | string        | stored as a hash                    |
| createdAt     | date          | auto generated                      |
| updatedAt     | date          | auto generated                      |

#### Comments Model
| Column name   | Data Type     | Notes                               | 
| ------------- | ------------- | ----------------------------------  | 
| id            | integer       | auto generated                      |
| userId        | integer       | based on user that's logged in      |
| content       | text          | comment that the user makes         |
| recipeId      | integer       | recipe id from API                  |
| createdAt     | date          | auto generated                      |
| updatedAt     | date          | auto generated                      |

#### Favorite Recipe Model
| Column name   | Data Type     | Notes                               | 
| ------------- | ------------- | ----------------------------------  | 
| id            | integer       | auto generated                      |
| name          | string        | based on recipe name from API       |
| userId        | integer       | based on user that's logged in      |
| recipeId      | integer       | ibased on recipe id from API        |
| createdAt     | date          | auto generated                      |
| updatedAt     | date          | auto generated                      |

## Installation and Setup Instructions

* Create a new project in VSCode or fork and clone a project of your choosing
* Install node modules from the package.json
```
npm i
```
* If starting from scratch -  install express, express layouts, pg, axios, session, passport, connect-flash, dotenv, sequelize, nodemon, method-override
```
npm i {name of package}
```

* Setup models using Sequelize

In terminal (either VSCode, iTerm, etc), type in the following:
```sequelize
sequelize init
```

Create sequelize database
```sequelize
sequelize db:create {nameOfYourProject}_development
```

Create models and migrations (replace user with name of model; firstName/lastName/age/email can be replaced with any other attributes )
```sequelize
sequelize model:create --name user --attributes firstName:string,lastName:string,age:integer,email:string
```

Run the migration
```sequelize
sequelize db:migrate
```

In your models folder, you can make associations between different models that you create. Create a new association under //define association here. Below is one example for the user model:
```javascript
 static associate(models) {
      // define association here
      models.user.hasMany(models.comments)
      models.user.hasMany(models.favoriteRecipes)
    }
```

In your main js file, require the necessary packages:
```javascript
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

// require authorization middleware at top of page
const isLoggedIn = require("./middleware/isLoggedIn");
const { response } = require('express');
const db = require('./models');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

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
```

## Routes
| Routes        | Route Methods Used    | Notes                                             | 
| ------------- | ----------------------| ----------------------------------                | 
| auth.js       | GET, POST             | controls signup/login and auth of user            |
| comments.js   | POST                  | create comment data on details page               |
| favorites.js  | GET, POST, PUT, DELETE| favorite, delete a recipe, update recipe's title  |
| user.js       | GET, PUT, DELETE      | account info page, user can update their email    |


## Sprints
#### 1st sprint: ERD, Wireframing, and Planning : Thursday - Sunday

I spent the first 2-3 days planning what I wanted my app to look like by working on my ERD and hand drawing the wireframes for each page. I also made sure to have a basic understanding of my models and how to set them up. 

#### 2nd sprint: API data, Models, and Routes : Sunday - Tuesday

I chose to build my models and routes first to see how the pages on my app would interact with each other, and to have a basic template for my API data. This took about 2 hours at max. The bulk of the second sprint was spent navigating my API data and incorporating that into my app. 

I used the Spoonacular API, which is an API that you have to sign up for and it comes with a daily limit unless you pay. The more information that you pull from the API, the faster the daily limit is reached. I didn't run into any issues with this until I actually got to pull data from my page and search for recipes to test out the functionality of the API, but this was all manageable until the 4th sprint. 

Code snippet - grabbing API data
```javascript
//Recipes Page
//pulling data from API using search query
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
```

#### 3rd sprint: More Models, Sequelize, and Relational Databases : Wednesday - Thursday

I started with the models that I did have, and ended up redoing them because they did not encompass all the information that I wanted. However, this was an easy fix (tedious yet necessary) because I just had to undo the sequelize migration and redo it after adding changes. 

This portion of the project was difficult for me to setup because I wasn't too experienced with Sequelize and it got confusing when I was trying to get attributes from different databases using either req.body or req.params. My code structure was setup correctly, but there were minor nuiances that caused my page to crash - either I was redirecting to the wrong page or I was calling the wrong database.

Code snippet - update title in favoriteRecipes database and favorites page using PUT and UPDATE
```ejs
 <!-- form to update recipe name  -->
        <form method="POST" action="/favorites/<%=f.name%>?_method=PUT">
            <input class="form-control" style="text-align:center; font-size:15px" id="new-name" type="name" name="name" value="<%= f.name %>">
            <button class="formButton" type="submit">Update Recipe Name</button>
        </form>
        <br>
```
```javascript
//add put and update route to change title of recipe to something you like
 router.put('/:name', (req, res) => {
    db.favoriteRecipes.update(
        {name: req.body.name}, 
        {where: {name: req.params.name}}
        )
    .then(() => {
        res.redirect('/favorites')
    })
})
```

#### 4th sprint: CSS, README, and final test : Thursday - Friday

After I was happy with the functionality of my app, it was time to complete the CSS portion. I didn't change too much, since I wanted to keep my app simple and minimalistic for the user.  

Changes made:
* Redid the colors of the Materialize layout that I had
* Added a footer to the index page
* Change font
* Included a picture of food as a background for the homepage
* Added divs to my page that contained a scrollbar, so that the div would scroll and the main page would remain static
* Fixed comments section
* Added in other features

Final test: My biggest issue was when I reached MVP (a project that checks all the requirements), but my API decided to stop working because I reached the limit. I tried to sign up for a new account, log into an existing account, and reset my password but nothing worked. The Spoonacular site appeared to be down. At this point I couldn't search for recipes and couldn't edit the CSS on the recipes page, so I spent the remaining time completeing the readme, any CSS that I could fix, cleaning up my code, and waiting for the API to work again. 

Code snippet - cool feature I was able to add after I got the API working again. It provides an image for each ingredient, lets you toggle between viewing the ingredients as a list or grid, and you can even adjust the serving size
```ejs
<!-- INGREDIENT WIDGET-->
    <pre id="spoonacular-ingredients" style="display:none">
            <% details.nutrition.ingredients.forEach(d=>{ %>
              <%=d.amount%> <%=d.unit%> of <%= d.name %>
            <% }) %> 
            </pre>
    <div id="spoonacular-ingredient-visualizer"></div>
    <script type="text/javascript" class="widget">
      var spoonacularServings = `${details.servings}`;
      var spoonacularMeasure = 'us';
      var spoonacularView = 'grid';
    </script>
    <script type="text/javascript" src="https://code.jquery.com/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="https://spoonacular.com/cdn/spoonacular-1.6.min.js"></script>
```

## Conclusion
I had alot of fun with this (especially the CSS!) and felt that it strengthened by understanding of sequelize databases and relationships between models. This is definitely an app that I will be using in order to find recipes that I want to make. Although there are features that I hope to add in the future, I'm happy with the final product. Also shoutout to the TA's that walked me through certain concepts during the start of my project! Because of this I was able to take what I learned to build other features.

## Ideas to Implement
* Mobile optimization
* Fix styling of layout and colors
* Create another route for nutrition facts












