const express = require('express');
const router = express.Router();
const controller = require('../services/caesarcipherController')

router.get('/encrypted', controller.getEncrypted);

module.exports = router;