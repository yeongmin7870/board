const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const dbconfig = require('../config/mysqlconn.js');
const connection = mysql.createConnection(dbconfig);
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended:false}));

// 회원가입
router.post('/users', (req, res) => {
    const{user_id,user_passwd}=req.body;
    var sql = "INSERT INTO user (user_id, user_passwd ) VALUES (?)";
    var values = [
        [user_id, user_passwd]
    ];
    connection.query(sql,values,function (err, rows, fields) {
        if (err) throw err;
        console.log(rows);
    });
    res.render('index');
});

//로그인
router.get('/users',(req,res)=>{
    const{user_id,user_passwd}=req.body;
    var sql = "SELECT * FROM user WHERE user_id=?";
    var values = [
      [user_id]
    ];
    connection.query(sql, values, function (err, rows, fields){
        if(err)throw err;
        console.log(rows[0]);
    });
    res.render('home');
});

module.exports = router;