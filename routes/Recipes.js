const express = require("express");
const db = require("../models");
const router = express.Router();

router.get('/recipes', (req, res) => {
    res.render('recipes');
  });

