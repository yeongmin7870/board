const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, cb) => {
    const reg = new RegExp('\.jpg|\.png|\.jpeg|\.gif$', 'i'); // i: 대소문자 구분하지말고, 이미지 확장자를 찾아라
    if (reg.test(file.originalname) == true) {
        cb(null, true);
    } else {
        req.fileValidationError = 'error';
        cb(null, false);
    }
};

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.resolve(__dirname, "../public/images"));
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + path.extname(file.originalname));
        },
    }),
    fileFilter: fileFilter,
    limits: { fileSize: 3 * 1024 * 1024 },
});

module.exports = { upload };