const crypto = require('crypto');

/** 소금값 랜덤으로 버퍼 생성 후 'base64'로 string 변환 후 리턴하는 함수*/ 
const createSalt = () => {
    return new Promise((resovle, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (err) reject(err);
            else resovle(buf.toString('base64'));
        });
    });
}
/** user객체 입력받고 salt 값 존재 여부 확인 후,\
 *  소금값을 생성하거나 그냥 입력받은 소금값으로\
 *  pbkdf2 암호화 방식으로 해시 알고리즘 적용한 비번 + 소금값 리턴
 */
const createHashedPassword = (user) => {
    let salt = "";
    return new Promise(async (resovle, reject) => {
        /** 소금 값이 없으면 생성 */
        if (user.salt == undefined) salt = await createSalt(); 
        else salt = user.salt;
        /** 9921 리터럴, 64 길이, sha512 암호화 알고리즘,  */
        crypto.pbkdf2(user.password, salt, 9921, 64, 'sha512', (err, key) => {
            if (err) reject(err)
            else resovle({ password: key.toString('base64'), salt });
        });
    });
}


module.exports = { createSalt, createHashedPassword };