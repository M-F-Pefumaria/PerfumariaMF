const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController')
const {isAuth, isAdmin} = require('../middlewares/auth');


// Rota de login
router.post('/login', usuarioController.login);


// cadastro de usuario
router.post('/cadastro', usuarioController.cadastro)

router.get('/admin', isAuth, isAdmin, (req, res) => {
    res.status(200).json({
        message: 'Sucesso! Você é um Admin!',
        usuario: req.session.usuarioLogado
    });
});

module.exports = router;