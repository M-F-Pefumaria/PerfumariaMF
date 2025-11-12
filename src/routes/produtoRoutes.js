const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController')
const { isAuth, isAdmin } = require('../middlewares/auth');

router.post('/cadastro', isAuth, isAdmin, produtoController.cadastrarProduto);

router.put('/:id', isAuth, isAdmin, produtoController.atualizarProduto);
module.exports = router;