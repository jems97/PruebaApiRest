const express = require('express');
const productoController = require('../controllers/productoController');

const router = express.Router();

router.get('/getAll', productoController.getAll);
router.get('/getById/:id', productoController.getById);
router.post('/create', productoController.create);
router.put('/update', productoController.update);

module.exports = router;