const nodemailer = require('nodemailer');
const senderInfo = require('../config/senderInfo.json');
const {logger} = require('../modules/logger');
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
        transporter.sendMail(mailOptions, function(err, info){
            if(err) {
                logger.error(err);
            } else {
                logger.info("승인코드가 성공적으로 보내졌습니다.");
            }
        })
    }
}

module.exports = mailSender