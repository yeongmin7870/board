const multer = require('multer');
const path = require('path');

const file_size_set = 3 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
    const reg = new RegExp('\.jpg|\.png|\.jpeg|\.gif$', 'i'); // i: 대소문자 구분하지말고, 이미지 확장자를 찾아라
    const req_file_size = parseInt(req.headers["content-length"])
    if (reg.test(file.originalname) == true) cb(null, true);
    else if (reg.test(file.originalname) != true) cb(new Error("not image extension"))
    else if (req_file_size <= file_size_set) cb(null, true);
    else cb(new Error("File too large"));
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
    limits: { fileSize: file_size_set } // 3MB 
},
);



module.exports = { upload };