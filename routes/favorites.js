const express = require("express");
const db = require("../models");
const user = require("../models/user");
const router = express.Router();
const methodOverride = require("method-override");
router.use(methodOverride("_method"));

router.get("/", (req, res) => {
    //console.log("_____________", req.user.id)
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
          //console.log("favorite recipe created");
          res.redirect("/favorites");
      })
      .catch(err=>{
          console.log("error", err);
      })
  });

  router.delete("/:name", (req,res)=>{
      db.favoriteRecipes.destroy({
          where: {name: req.params.name}
      })
      .then(()=>{
        res.redirect("/favorites");
    })
    .catch(err=>{
        console.log("___ERROR____")
    })
  })
  
module.exports = router;