const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const {isAuth} = require('../middlewares/auth');

router.post('/finalizar', isAuth, pedidoController.finalizarCompra);

module.exports = router;