const crypto = require('crypto');

// 소금값 생성
const createSalt = () => {
    return new Promise((resovle, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (err) reject(err);
            else resovle(buf.toString('base64'));
        });
    });
}
// 비밀번호 암호화 
const createHashedPassword = (user) => {
    let salt = "";
    return new Promise(async (resovle, reject) => {

        if (user.salt == undefined) salt = await createSalt(); // 소금 값이 없으면 생성
        else salt = user.salt;
        
        crypto.pbkdf2(user.password, salt, 9921, 64, 'sha512', (err, key) => {
            if (err) reject(err)
            else resovle({ password: key.toString('base64'), salt });
        });
    });
}


module.exports = { createSalt, createHashedPassword };