const jwt = require('../modules/jwt');
const MSG = require('../modules/responseMessage');
const CODE = require('../modules/statusCode');
const util = require('../modules/util');

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const authUtil = {
    checkToken: async (req, res, next) => {

        var token = req.body.token;
        if (!token) {//토큰이 없을때
            console.log('토큰이 없습니다.');
            return res.send(`
            <script>
                console.log('로그인을 해주세요!');
                location.href = '/v2/login';
            </script>
            `);
        } else {

            const user = await jwt.verify(token); // 토큰 해독
            if (user === TOKEN_EXPIRED) { //토큰 유효기간 끝남
                console.log('토큰 유효기간 끝났습니다.');
                return res.send(`
            <script>
                console.log('로그인을 한지 오래되었습니다.');
                location.href = '/v2/login';
            </script>
            `);
            } else if (user === TOKEN_INVALID) { //토큰 불일치
                console.log('토큰이 유효하지 않습니다.');
                return res.send(`
            <script>
                console.log('정상적인 로그인을 해주세요!');
                location.href = '/v2/login';
            </script>
            `);
            } else {
                next();
            }
        }
    }
}

module.exports = authUtil;