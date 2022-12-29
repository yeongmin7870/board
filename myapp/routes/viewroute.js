const express = require('express');
const router = express.Router();
const authUtil = require('../middlewares/auth').checkToken;
const BoardController = require('../controller/BoardController');

router.get('/', (req, res) => {
    res.render('index');
});
router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/home', authUtil ,(req, res) => {
    res.render('home');
});

router.get('/write', authUtil ,(req, res) => {
    res.render('writeboard');
});

router.get('/my', authUtil ,(req, res) => {
    res.render('mylist');
});

module.exports = router;