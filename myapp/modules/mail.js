const nodemailer = require('nodemailer');
const senderInfo = require('../config/senderInfo.json');

// 메일 발송 객체

const mailSender = {
    // 메일 발송 함수
    sendMail: function (param) { // 메일 발송 함수 
        let transporter = nodemailer.createTransport({ 
            service: 'gmail',
            auth: {
                user: senderInfo.user,
                pass: senderInfo.pass
            }
        });
        let mailOptions = { //메일 옵션 
            from: senderInfo.user,
            to: param.toMail,
            subject: param.subject,
            text: param.text,
            html: param.html
        };
        console.log(mailOptions);

        transporter.sendMail(mailOptions, function(err, info){
            if(err) {
                console.log(err);
            } else {
                console.log("finish, send Email" + info);
            }
        })
    }
}

module.exports = mailSender