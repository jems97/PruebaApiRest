const express = require('express');
const ordenesController = require('../controllers/ordenesController');

const router = express.Router();

router.post('/create', ordenesController.create);

module.exports = router;