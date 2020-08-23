const express = require("express");
const db = require("../models");
const user = require("../models/user");
const router = express.Router();
const methodOverride = require("method-override");
router.use(methodOverride("_method"));

// complete RESTful routes for at least one of your resources (models)
// GET, POST, PUT, and DELETE

//get 
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

  //post recipe to db
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

//delete recipe
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