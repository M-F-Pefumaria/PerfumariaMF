const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const usuarioController = {

    login: async (req, res) => {
        const { email, senha } = req.body;

        // verifica se email e senha existem
        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios' })
        }

        // busca email do usuario
        const usuario = await Usuario.findByEmail(email);
        if (!usuario) {
            return res.status(401).json({ message: 'Email nao cadastrado ou invalido' })
        }

        // compara e valida senha
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaCorreta) {
            return res.status(401).json({ message: 'Senha incorreta' })
        }

        req.session.usuarioLogado = {
            id: usuario.id_usuario,
            email: usuario.email,
            tipo: usuario.tipo_usuario
        }

        res.status(200).json(req.session.usuarioLogado);
    },

    cadastro: async (req, res) => {
        try {
            const { nome, sobrenome, cpf, data_nascimento, celular, email, senha, tipo_usuario } = req.body;

            // verifica se todos os campos foram preenchidos
            if (!email || !senha || !nome || !sobrenome || !cpf || !data_nascimento || !celular) {
                return res.status(400).json({ message: 'Preencha todos os campos obrigatórios' })
            }

            // verifica tamanho da senha
            if (req.body.senha.length < 4) {
                return res.status(400).json({ message: 'Senha muito curta' })
            }

            // verifica correspondencia das senhas
            if (req.body.senha != req.body.senha_confirmacao) {
                return res.status(400).json({ message: 'As senhas são diferentes, tente novamente' })
            }

            // verifica se email ja existe no banco
            const usuario = await Usuario.findByEmail(email);
            if (usuario) {
                return res.status(400).json({ message: 'Email já cadastrado' })
                //req.flash('error_msg', 'Email já cadastrado')
                //res.redirect('/login')
            } else {

                // criptografa senha
                const salt = await bcrypt.genSalt(10);
                const senha_hash = await bcrypt.hash(senha, salt);

                // atribui automaticamente o tipo cliete para o cliente
                const tipo = tipo_usuario || 'CLIENTE';

                // Manda para o model usuario para inserir usuario no banco
                await Usuario.create(nome, sobrenome, cpf, data_nascimento, celular, email, senha_hash, tipo);

                res.status(201).json({ message: 'Usuario cadastrado com sucesso' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Erro ao cadastrar usuario', erro: error.message })
            console.log(error);
        }
    }

};

module.exports = usuarioController;