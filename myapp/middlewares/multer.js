const multer = require('multer');

const upload =
    multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, '/images/');
            },
            filename: function (req, file, cb) {
                cb(null, new Date().valueOf() + path.extname(file.originalname));
            }
        })
    });
module.exports = upload;