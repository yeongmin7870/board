const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');

// 회원정보 가져오기
router.get('/users',UserController.doGetUser);
// 로그인
router.post('/user/sign-in',UserController.doSignIn)

// // 회원가입
// router.post('/users', (req, res) => {
//     const{user_id,user_passwd}=req.body;
//     var sql = "INSERT INTO user (user_id, user_passwd ) VALUES (?)";
//     var values = [
//         [user_id, user_passwd]
//     ];
//     connection.query(sql,values,function (err, rows, fields) {
//         if (err) throw err;
//         console.log(rows);
//     });
//     res.render('index');
// });
//
// //로그인
// router.get('/users',(req,res)=>{
//     const{user_id,user_passwd}=req.body;
//     var sql = "SELECT * FROM user WHERE user_id=?";
//     var values = [
//       [user_id]
//     ];
//     connection.query(sql, values, function (err, rows, fields){
//         if(err)throw err;
//         console.log(rows[0]);
//     });
//     res.render('home');
// });

module.exports = router;