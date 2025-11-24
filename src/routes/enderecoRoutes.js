const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController')
const {isAuth} = require('../middlewares/auth');

router.post('/', isAuth, enderecoController.create);
router.get('/', isAuth, enderecoController.listarMeusEnderecos);
router.delete('/:id', isAuth, enderecoController.deletar);