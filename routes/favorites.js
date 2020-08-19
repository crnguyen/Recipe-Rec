const express = require("express");
const db = require("../models");
const user = require("../models/user");
const router = express.Router();

router.get("/", (req, res) => {
    console.log("_____________", req.user.id)
    db.favoriteRecipes.findAll({
        where: {userId: req.user.id} //whover is logged in
    })
    .then(response=>{
        //console.log(response);
        res.render("favorites", {favorites: response})
    })
    .catch(err=>{
        console.log("error", err)
    })
  });

  router.post("/", (req,res)=>{
      let formData = req.body;
      db.favoriteRecipes.findOrCreate({
          where: {name: formData.name},
          defaults: { 
              userId: req.user.id,
            recipeId: formData.recipeId }
      })
      .then(([newFave,created])=>{
          console.log("favorite recipe created");
          res.redirect("/favorites");
      })
      .catch(err=>{
          console.log("error", err);
      })
  });

module.exports = router;