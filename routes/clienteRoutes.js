const express = require('express');
const clienteController = require('../controllers/clienteController');

const router = express.Router();

router.get('/getAll', clienteController.getAll);
router.get('/getById/:id', clienteController.getById);
router.post('/create', clienteController.create);
router.put('/update', clienteController.update);

module.exports = router;
