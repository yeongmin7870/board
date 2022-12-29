const jwt = require('../modules/jwt');
const MSG = require('../modules/responseMessage');
const CODE = require('../modules/statusCode');
const util = require('../modules/util');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const authUtil = {
    checkToken: async (req, res, next) => {
        var token = req.headers.token;
        if (!token)
            return res.json(util.fail(CODE.BAD_REQUEST, MSG.EMPTY_TOKEN));
        const user = await jwt.verify(token); // 토큰 해독
        if (user === TOKEN_EXPIRED)
            return res.json(util.fail(CODE.UNAUTHORIZED, MSG.EXPIRED_TOKEN));
        if (user === TOKEN_INVALID)
            return res.json(util.fail(CODE.UNAUTHORIZED, MSG.INVALID_TOKEN));
        if (user.email == undefined)
            return res.json(util.fail(CODE.UNAUTHORIZED, MSG.INVALID_TOKEN));
        req.user_id = user.email;
        next();
    }
}

module.exports = authUtil;