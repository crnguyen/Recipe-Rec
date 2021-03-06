const express = require('express');
const router = express.Router();
const db = require("../models");

//post comment on recipe and then redirect to details comment page
router.post("/", (req,res)=> {
    let commentData = req.body;
    console.log("this is the comment data: ", commentData);
    db.comments.create(commentData)
    .then(()=>{
        res.redirect(`/details/${commentData.recipeId}`)
    })
    .catch((err)=>{
        res.send("error", err);
    })
})

module.exports = router;