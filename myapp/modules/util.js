module.exports = {
    fail: function (code, msg) {
        const result = {
            statusErrorCode: code,
            responseErrorMessage: msg
        };
        console.log(result);
        return result;
    }
}