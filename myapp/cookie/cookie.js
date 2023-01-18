const express = require('express');
const MSG = require('../modules/responseMessage');
const util = require('../modules/util');
module.exports={

    getCookie: function(req,res){
        if(req.cookies.x_auth != ''){
            res.status(200).send(req.cookies.x_auth);
        } else {
            return res.json(util.fail(400, MSG.EMPTY_COOKIE));
        }
    },

    removeCookie: function(req,res){
        res.clearCookie('x_auth').status(201).redirect('/v2/login');
    },
}
