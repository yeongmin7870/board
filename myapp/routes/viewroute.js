const express = require('express');
const router = express.Router();
const authUtil = require('../middlewares/auth').checkToken;


router.get('/', (req, res) => {
    res.render('index');
});
router.get('/register',authUtil,(req, res) => {
    res.render('register');
});

router.get('/home', (req, res) => {
    res.render('home');
});
module.exports = router;