const express = require('express');
const router = express.Router();
const cookie = require('../cookie/cookie');
/*
    쿠키 관련 uri
*/
//쿠키 가져오기
router.get('/cookie', (req, res) => {
    cookie.getCookie(req, res);
});
// 쿠키 삭제
router.get('/cookie-remove', (req, res) => {
    cookie.removeCookie(req, res);
});

module.exports = router;