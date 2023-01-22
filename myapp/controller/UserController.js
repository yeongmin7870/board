const express = require('express');
const Users = require('../models/Users');
const jwt = require('../modules/jwt');
const util = require('util');
const mailer = require('../modules/mail');
const { promise } = require('../config/mysqlconn');
const crypto = require('../modules/crypto');
module.exports = {
    doGetUser: function (req, res, next) {
        Users.getUsers().then((result) => {
            res.send(result);
        });
    },

    doSignIn: async function (req, res, next) {
        Users.doSignIn(req.body.user_id).then(async (result) => {

            const user = { "password": req.body.user_passwd, "salt": result[0].user_salt };

            const client_pass = await crypto.createHashedPassword(user); // 받은 비번을 솔트랑 같이 해시 함수 돌려보기 

            if (result[0].user_passwd == client_pass.password) {

                const user_token = {
                    'user_id': req.body.user_id,
                    'user_passwd': req.body.user_passwd
                }

                const jwtToken = await jwt.sign(user_token); //토큰 발급
                const userToken = { token: jwtToken.token }
                res.cookie("x_auth", userToken, {
                    maxAge: 60 * 60 * 1000  // 1시간 유효 시간
                }).status(201).redirect('/v2/home/0'); // 쿠키 넣어놓고 보냄

            } else {
                res.send(`
                        <script>
                            alert('비밀번호가 틀렸습니다.');
                            location.href='/v2/login'
                        </script>
                    `);
            }
        }).catch((err) => {
            res.send(`
            <script>
                alert('없는 사용자 입니다.');
                location.href='/v2/login'
            </script>
        `);
        });
    },

    doSignUp: async function (req, res) {
        let client = { "password": req.body.user_passwd }
        
        const { password, salt } = await crypto.createHashedPassword(client); // 비밀번호 해시값, 소금값

        let user = {
            user_id: req.body.user_id,
            user_passwd: password,
            user_salt: salt,
            user_address: req.body.user_address,
            user_email: req.body.user_email,
            nickname: req.body.nickname
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
                        location.href='/v2/login'
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
        for (let i = 0; i < 6; i++) {
            randCode += Math.floor(Math.random() * 10).toString()
        };

        let emailParam = {
            toMail: receiverEmail,
            subject: "전공책 싸게 사자 승인 코드 입니다.",
            html: "<h4>" + randCode + " 승인코드입니다. </h4>",
        };

        mailer.sendMail(emailParam);
        console.log(today + " " + receiverEmail + " 님의 승인코드는 " + randCode);
        res.status(200).send({ "randcode": randCode });
    },

    findNickname: async function (req, res) {
        try {
            let msg = await Users.findNickname(req.params.data);
            res.send(msg);
        }
        catch (err) {
            res.send(err);
        }
    },
}