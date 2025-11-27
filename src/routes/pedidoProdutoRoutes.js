const express = require('express');
const router = express.Router();
const pedidoProdutoController = require('../controllers/pedidoProdutoController');
const {isAuth} = require('../middlewares/auth');

module.exports = router;