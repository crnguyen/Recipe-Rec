const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/editUser', (req, res) => {
    res.render('editUser', {user: req.user});
  })

  //add put and update route to profile page
router.put('/editUser', (req, res) => {
    db.user.update({email: req.body.email}, {where: {email: req.user.email},})
    .then(() => {
        res.redirect('/profile')
    })
})
  
router.delete('/editUser', (req, res) => {
    db.user.destroy({
        where: {id: req.user.id}
    }).then(response => {
        res.redirect('/')
    }).catch(err => {
        console.log(err)
    })
})

module.exports = router;