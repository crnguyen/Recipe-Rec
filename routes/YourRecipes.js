const express = require("express");
const db = require("../models");
const router = express.Router();

router.get('/yourRecipes', (req, res) => {
    res.render('YourRecipes');
  });