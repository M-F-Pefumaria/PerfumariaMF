const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController')
const {isAuth, isAdmin} = require('../middlewares/auth');


// Rota de login
router.post('/login', usuarioController.login);


// cadastro de usuario
router.post('/cadastro', usuarioController.cadastro)

// logout do usuario
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao fazer logout' });
        }
        res.status(200).json({ message: 'Logout realizado com sucesso' });
    });
});

router.get('/admin', isAuth, isAdmin, (req, res) => {
    res.status(200).json({
        message: 'Sucesso! Você é um Admin!',
        usuario: req.session.usuarioLogado
    });
});

module.exports = router;