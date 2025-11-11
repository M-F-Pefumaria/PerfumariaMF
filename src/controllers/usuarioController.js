const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const usuarioController = {

    login: async (req, res) => {
        const { email, senha } = req.body;

        // verifica se email e senha existem
        if (!email || !senha) {
            return res.status(400).json({message: 'Email e senha são obrigatórios'})
        }

        // busca email do usuario
        const usuario = await Usuario.findByEmail(email);
        if (!usuario) {
            return res.status(401).json({message: 'Email nao cadastrado ou invalido'})
        }


        // compara e valida senha
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

        if(!senhaCorreta) {
            return res.status(401).json({message: 'Senha incorreta'})
        }

        req.session.usuarioLogado = {
            id: usuario.id_usuario,
            email: usuario.email,
            tipo: usuario.tipo_usuario
        }

        res.status(200).json(req.session.usuarioLogado);
    }

};

module.exports = usuarioController;