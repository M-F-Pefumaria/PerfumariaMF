const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController')
const {isAuth} = require('../middlewares/auth');

module.exports = router;