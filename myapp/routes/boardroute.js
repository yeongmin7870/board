const express = require('express');
const router = express.Router();
const authUtil = require('../middlewares/auth').checkToken;
const boardcontroller = require('../controller/BoardController');

router.post('/board',boardcontroller.doWriteBoard);
router.get('/book',boardcontroller.findBybookClassification);
module.exports=router;