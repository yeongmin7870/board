const express = require('express');
const router = express.Router();
const univerController = require('../controller/UniversityController');

router.get('/find/university', univerController.findUniversity);

module.exports= router;