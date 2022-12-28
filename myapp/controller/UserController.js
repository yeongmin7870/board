const express = require('express');
const Users = require('../models/Users');

module.exports = {
    doGetUser: function (req, res, next){
        Users.getUsers().then((result) => {
           res.send(result);
        });
    },

    doSignIn: function(req,res,next){
       Users.doSignIn(req.body.user_id).then((result) => {
            res.send(result);
        });
    },
}