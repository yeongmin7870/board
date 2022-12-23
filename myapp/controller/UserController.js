const express = require('express');
const Users = require('../models/Users');

module.exports = {
    doGetUser: function (req, res, next){
        Users.getUsers().then((result) => {
           res.send(result);
        });
    },

    doSignIn: function(req,res,next){
        // const{user_id, user_passwd} = req.body
        console.log(req.query);
        Users.doSignIn(user_id, user_passwd).then((result) => {
           res.send(result);
        });
    },
}