# RecipeRec

## Concept and User Stories

Site concept: A way to stay connected through food. Search, save, and comment on recipes.

* User needs to be able to login to access recipes and add comments
* User needs to be able to navigate between homepage, favorited recipes, and recipes page
* User needs to be able to have the option to add to/delete from their favorites
* User needs to be able to comment on the recipes that they find, and view other people's comments

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

## Installation and Setup Instructions

* Install node modules from the package.json
```
npm i
```
* If starting from scratch -  install express, express layouts, axios, session, passport, connect-flash, dotenv
```
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
* Install method-override to create a delete feature
```
npm i method-override
```

## Sprints
#### 1st sprint: ERD, Wireframing, and Planning : Thursday - Sunday

I spend the first 2-3 days planning what I wanted my app to look like by working on my ERD and hand drawing each page. I also made sure to have a basic understanding of my models and how to set them up. 

#### 2nd sprint: API data, Models, and Routes : Sunday - Tuesday

I chose to build my models and routes first to see how the pages on my app would interact with each other, and to have a basic template for my API data. This took about 2 hours at max. The bulk of the second sprint was spent navigating my API data and incorporating that into my app. 

I used the Spoonacular API, which is an API that you have to sign up for and it comes with a daily limit unless you pay. The more information that you pull from the API, the faster the daily limit is reached. I did't run into any issues with this until I actually got to pull data from my page and search for recipes to test out the functionality of the API, but this was all manageable until the 4th sprint. 

#### 3rd sprint: Models, Sequelize, and Relational Databases : Wednesday - Thursday

I started with the models that I did have, and ended up redoing them because they did not encompass all the information that I wanted. However, this was an easy fix because I just had to undo the sequelize migration and redo it after adding changes. 

This portion of the project was difficult for me to setup because I wasn't too experienced with Sequelize and it got confusing when I was trying to get attributes from different databases using either req.body or req.params. My code structure was setup correctly, but there were minor nuiances that caused my page to crash - either I was redirecting to the wrong page or I was calling the wrong database.

#### 4th sprint: CSS, README, and final test : Thursday - Friday

After I was happy with the functionality of my app, it was time to complete the CSS portion. I didn't change too much, since I wanted to keep my app simple and minimalistic for the user.  

Changes made:
* Redid the colors of the Materialize layout that I had
* Added a footer to the index page
* Change font
* Included a picture of food as a background for the homepage
* Added divs to my page that contained a scrollbar, so that the div would scroll and the main page would remain static
* Fixe comments section

Final test: My biggest issue was when I reached MVP (a project that checks all the requirements), but my API decided to stop working because I reached the limit. I tried to sign up for a new account, log into an existing account, and reset my password but nothing worked. The Spoonacular site appeared to be down. At this point I couldn't search for recipes and couldn't edit the CSS on the recipes page, so I spent the remaining time completeing the readme, any CSS that I could fix, and cleaning up my code. 

## Models
#### User Model
| Column name   | Data Type     | Column name                         | 
| ------------- | ------------- | ----------------------------------  | 
| id            | integer       | Serial primary key - auto generated |
| name          | string        | must be provided                    |
| email         | string        | must be unique, used for login      |
| password      | string        | stored as a hash                    |
| createdAt     | date          | auto generated                      |
| updatedAt     | date          | auto generated                      |

#### Comments Model


#### Favorite Recipe Model










