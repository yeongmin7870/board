const jwt = require('../modules/jwt');
const MSG = require('../modules/responseMessage');
const CODE = require('../modules/statusCode');
const util = require('../modules/util');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const authUtil = {
    checkToken: async (req, res, next) => { 
               
        var token = req.body.token;
        
        if (!token) //토큰이 없을때 
            return res.render('index');
        const user = await jwt.verify(token); // 토큰 해독
        if (user === TOKEN_EXPIRED)
            return res.render('index');
        if (user === TOKEN_INVALID)
            return res.render('index');
        if (user.user_id == undefined)
            return res.render('index');
        next();
    }
}

module.exports = authUtil;