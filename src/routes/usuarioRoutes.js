const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController')

// Rota de login
router.post('/login', usuarioController.login);


// cadastro de usuario
router.post('/cadastro', usuarioController.cadastro)

module.exports = router;