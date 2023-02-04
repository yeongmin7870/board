const express = require('express');
const Users = require('../models/Users');
const jwt = require('../modules/jwt');
const util = require('util');
const mailer = require('../modules/mail');
const { promise } = require('../config/mysqlconn');
const crypto = require('../modules/crypto');
const { logger } = require('../modules/logger');
const utcnow = new Date();
const fs = require('fs');

module.exports = {
    doGetUser: function (req, res, next) {
        Users.getUsers().then((result) => {
            res.send(result);
        });
    },
    /**
     * 로그인\
     * 아이디 비밀번호 입력하면
     *  입력 비번과 디비 비번, 비교 후\
     *  쿠키 뱉어주고 로그인\
     *  서로 다르면 다시 로그인 화면으로 보냄
    */
    doSignIn: async function (req, res, next) {

        Users.doSignIn(req.body.user_id).then(async (result) => {

            /**클라이언트에서 입력받은 비번, 디비에서 가져온 소금값, 입력 후 JSON으로 저장한 변수 */
            const user = { "password": req.body.user_passwd, "salt": result[0].user_salt };

            /** 비번, 소금값 입력후 해시비번값 리턴할 때 까지 기다리는 함수   */
            const client_pass = await crypto.createHashedPassword(user); // 받은 비번을 솔트랑 같이 해시 함수 돌려보기 

            if (result[0].user_passwd == client_pass.password) {
                const user_token = {
                    "iss": "ym_bookstore.kro.kr",  //토큰 발급자
                    "exp": Math.floor(utcnow / 1000)+ 60 * 30 *60, // 현재시간으로부터 + 30분 만료 시간 
                    "http://ym_bookstore.kro.kr/jwt_claims/is_admin": true, //공개 클레임 , 충돌을 방지하기 위해 uri 형식
                    "user_id": req.body.user_id,    // 비공개 클레임
                    "user_nickname": result[0].nickname, //비공개 클레임
                }
                const jwtToken = await jwt.sign(user_token); //토큰 발급

                logger.info(`'${req.body.user_id}' 님이 토큰을 발급받고 로그인 했습니다.`);


                res.cookie("x_auth", jwtToken.token, {
                    maxAge: 60 * 30 * 1000  // 30분 유효 시간
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
            console.log(err);
            res.send(`
            <script>
                alert('없는 사용자 입니다.');
                location.href='/v2/login'
            </script>
        `);
        });
    },
    /**
     * 회원가입\
     * @body {string} user_id  아이디
     * @body {string} user_passwd 비밀번호
     * @body {string} user_address 주소
     * @body {string} user_email 이메일
     * @body {string} nickname 닉네임
     * 
     * 위의 값들을 입력받아서 user 테이블에 추가 후 그에 따른 회원가입 결과 리턴
     * 
     */
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
                logger.info(`"${req.body.user_id}" 아이디로 계정을 생성했습니다.`);
                res.send(`
                    <script>
                        alert('회원가입 되었습니다.');
                        location.href='/v2/login'
                    </script>
                `)
            }
        });
    },

    /** 이메일 인증코드 보내기
     * 
     *  수신 코드를 입력 받고
     *  해당 이메일로 승인코드를 보내줌
     * 
     *  */
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

        logger.info(`'${receiverEmail}' 이메일을 가진 누군가가 승인코드를 성공적으로 요청했습니다. `);

        mailer.sendMail(emailParam);
        res.status(200).send({ "randcode": randCode });
    },
    /**
     * 닉네임 중복 확인
     * @param {object} data 
     *   @returns 
     *      msg:\
     *          OK: 닉네임 비중복\
     *          No: 닉네임 중복\
     *      err: 닉네임 찾는 디비 오류 반환
     */
    findNickname: async function (req, res) {
        try {
            /**닉네임 찾는 함수 반환 값 변수 */
            let msg = await Users.findNickname(req.params.data);
            res.send(msg);
        }
        catch (err) {
            res.send(err);
        }
    },
    /** 토큰을 입력받고
     *  닉네임을 보내주는 함수
     */
    verifyToken: async function (req, res) {
        const decode = await jwt.verify(req.body.data); //토큰 해독
        console.log(decode);
        if (decode == -2 || decode == -3) {
            res.send({ state: "not login" });
        } else {
            res.send({ state: "login" })
        }
    },
    /** 유저 프로필 업로드 함수*/
    uploadProfile: async function (req, res) {
        try {
            const decode = await jwt.verify(req.body.token); //토큰 해독
            let user_id = decode.user_id;
            let filename = req.file.filename;
            let user = {
                user_id: user_id,
                user_profile: filename
            }
            /** 프로필 수정하기 전에 삭제 수행 하는 알고리즘 */
            const findProfile = await Users.findProfilePath(user);
            const image_name = findProfile[0].user_profile;
            let file_path = './public/images/board/' + image_name;

            if (fs.existsSync(file_path)) {
                try {
                    fs.unlinkSync(file_path);
                    logger.info(`'${user_id}' 님이 ' 프로필 삭제 수행중에 '${image_name}' 이미지를 삭제했습니다.`);
                } catch (e) {
                    logger.error(e);
                    res.send({ msg: '서버 이미지 삭제 실패했습니다.' });
                }
            }

            /** 프로필 수정하는 알고리즘 */
            let result = await Users.uploadProfile(user);
            if (result.msg == "ok") {
                logger.info(`'${user_id}' 님이 '${filename}' 프로파일을 수정했습니다.`)
                res.status(200).send(
                    `
                    <script>
                        alert("프로파일을 성공적으로 수정했어요!");
                        opener.parent.location.reload();
                        window.close();
                    </script>
                    `
                );
            } else {
                res.status(200).send(
                    `
                    <script>
                        alert("프로파일 수정을 실패했습니다!");
                        window.close();
                    </script>
                    `
                );
            }

        } catch (err) {
            res.status(404).send(`<script>
            alert('이미지 파일이 아닙니다 🐱');
            window.close();
            </script>`);
        }
    },
    /** 토큰을 입력받고 
     *  닉네임만 리턴해주는 함수
     */
    getNickname: async function (req, res) {
        const decode = await jwt.verify(req.body.data); //토큰 해독
        const user_id = decode.user_id;
        if(user_id == undefined) {
            return res.send({nickname: "need login"})
        }
        const nickname = await Users.getNickname(user_id);
        res.send({ nickname: nickname[0].nickname });
    },
    /** 토큰, 자기 소개글 입력 받고
     *  결과 리턴해주는 함수
     */
    uploadIntroduce: async function(req,res){
        const decode = await jwt.verify(req.body.token); // 토큰 해독
        const user_id = decode.user_id;
        
        const result = await Users.uploadIntroduce(user_id, req.body.introduce);
        if(result.response == "Good"){
            logger.info(`'${user_id}' 가 "${req.body.introduce}" 으로 소개글을 등록 했습니다.`)
            res.send(`
            <script>
                alert("소개글이 정상적으로 등록되었습니다.");
                opener.parent.location.reload();
                window.close();
            </script>
            `)
        } else {
            logger.error(`'${user_id}' 가 소개글을 등록하다가 "${result}" 에러를 발생시켰습니다.`);
            res.send(`
            <script>
                alert("소개글 등록이 실패했습니다.");
                opener.parent.location.reload();
                window.close();
            </script>
            `);
        }
    },
}