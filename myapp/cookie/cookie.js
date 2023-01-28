const express = require('express');
const MSG = require('../modules/responseMessage');
const util = require('../modules/util');
const jwt = require('../modules/jwt');

module.exports={

    getCookie: function(req,res){
        if(req.cookies.x_auth != ''){
            res.status(200).send(req.cookies.x_auth);
        } else {
            return res.json(util.fail(400, MSG.EMPTY_COOKIE));
        }
    },

    removeCookie: function(req,res){
        res.clearCookie('x_auth').status(201).send(`
        <script>
            alert("로그아웃 되었습니다.");
            location.href="/v2/login";
        </script>
        `);
    },
}
