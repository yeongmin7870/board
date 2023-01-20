const express = require('express');
const Users = require('../models/Users');
const jwt = require('../modules/jwt');
const util = require('util');
const mailer = require('../modules/mail');
const { promise } = require('../config/mysqlconn');

module.exports = {
    doGetUser: function (req, res, next) {
        Users.getUsers().then((result) => {
            res.send(result);
        });
    },

    doSignIn: function (req, res, next) {
        Users.doSignIn(req.body.user_id, req.body.user_passwd).then(async (result) => {
            if (result == 1) {
                const user = {
                    'user_id': req.body.user_id,
                    'user_passwd': req.body.user_passwd
                }
                const jwtToken = await jwt.sign(user); //토큰 발급
                const userToken = { token: jwtToken.token }
                res.cookie("x_auth", userToken, {
                    maxAge: 60 * 60 * 1000  // 1시간 유효 시간
                }).status(201).redirect('/v2/home/0'); // 쿠키 넣어놓고 보냄
            } else {
                res.send(`
                    <script>
                        alert('아이디 또는 비밀번호가 틀렸습니다.');
                        location.href='/v2/0'
                    </script>
                `);
            }
        });
    },

    doSignUp: function (req, res) {
        let user = {
            user_id: req.body.user_id,
            user_passwd: req.body.user_passwd,
            user_address: req.body.user_address,
            user_email: req.body.user_email
        };
        Users.doSignUp(user).then((result) => {
            if (result == -1) {
                res.send(`
                    <script>
                        alert('이미 존재하는 회원 입니다.');
                        location.href='/v2/register'
                    </script>
                `)
            } else if (result == 1) {
                res.send(`
                    <script>
                        alert('회원가입 되었습니다.');
                        location.href='/v2/home/0'
                    </script>
                `)
            }
        });
    },

    // 승인코드 보내기 
    doAuthMail: function (req, res) {
        const { receiverEmail } = req.body;
        let today = new Date();
        let randCode = "";
        let randCodeInfo = ""; //디비 세션에 저장해 둘 정보
        for (let i = 0; i < 6; i++) {
            randCode += Math.floor(Math.random() * 10).toString()
        };

        let emailParam = {
            toMail: receiverEmail,
            subject: "전공책 싸게 사자 승인 코드 입니다.",
            html: "<h4>" + randCode + " 승인코드입니다. </h4>",
        };
        mailer.sendMail(emailParam);
        req.session.code = randCode;
        console.log(today + " " + receiverEmail + " 님의 승인코드는 " + randCode);
        res.status(200).send(randCode);
    },

    findCode: function (req, res) {
        if (req.params.data == req.session.code) {
            return res.json({
                msg: "Good"
            })
        } else {
            return res.json({
                msg: "Bad"
            })
        }

    },
}