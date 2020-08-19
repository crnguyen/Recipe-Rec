const express = require("express");
const db = require("../models");
const router = express.Router();

router.get("/favorites", (req, res) => {
    db.favoriteRecipes.findAll()
    .then(response=>{
        res.render("favorites", {favorites: response})
    })
    .catch(err=>{
        console.log("error", err)
    })
  });

  router.post("/favorites", (req,res)=>{
      let formData = req.body;
      db.favoriteRecipes.findOrCreate({
          where: {name: formData.name}
      })
      .then(([newFave,created])=>{
          console.log("favorite recipe created");
          res.redirect("favorites");
      })
      .catch(err=>{
          console.log("error", err);
      })
  });

module.exports = router;