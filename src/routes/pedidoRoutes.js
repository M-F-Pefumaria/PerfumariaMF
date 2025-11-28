const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const {isAuth, isAdmin} = require('../middlewares/auth');

router.post('/finalizar', isAuth, pedidoController.finalizarCompra);

router.get('/', isAuth, isAdmin, pedidoController.listarPedidosAdmin);

router.put('/:id', isAuth, isAdmin, pedidoController.atualizarStatus);

module.exports = router;