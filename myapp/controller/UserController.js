const express = require('express');
const Users = require('../models/Users');

module.exports = {
    doGetUser: function (req, res, next){
        Users.getUsers().then((result) => {
           res.send(result);
        });
    },

    doSignIn: function(req,res,next){
       Users.doSignIn(req.body.user_id, req.body.user_passwd).then((result) => {
            if(result==1){
                res.render('home');
            }else{
                res.send(`
                    <script>
                        alert('아이디 또는 비밀번호가 틀렸습니다.');
                        location.href='/v2/'
                    </script>
                `);
            }
       });
    },

    doSignUp: function(req,res){
        let user = {
            user_id: req.body.user_id,
            user_passwd: req.body.user_passwd
        };
        Users.doSignUp(user).then((result)=>{
            if(result==-1){
                res.send(`
                    <script>
                        alert('이미 존재하는 회원 입니다.');
                        location.href='/v2/register'
                    </script>
                `)
            } else if(result==1) {
                res.send(`
                    <script>
                        alert('회원가입 되었습니다.');
                        location.href='/v2/'
                    </script>
                `)
            }
        });
    },
}