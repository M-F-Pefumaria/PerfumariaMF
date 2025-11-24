const Endereco = require('../models/Endereco');
const Produto = require('../models/Endereco');

class enderecoController {


    async index(req, res) {
        const id_usuario = req.session.usuarioLogado.id_usuario;

        const enderecos = await Endereco.findById(id_usuario);

        res.status(200).json(enderecos);
    }

    async create(req, res) {
        const id_usuario = req.session.usuarioLogado.id_usuario;

        const novoEndereco = await Endereco.create({
            ...req.body,
            id_usuario
        });

        res.status(201).json(novoEndereco);
    }

    async destroy(req, res) {
        const id_usuario = req.session.usuarioLogado.id_usuario;
        const id_endereco = req.params.id

        const deletarEndereco = await Endereco.destroy(id_endereco, id_usuario);

        if (deletado) {
            res.status(200).json({ message: 'Endereço removido.' });
        } else {
            res.status(404).json({ message: 'Endereço não encontrado.' });
        }
    }

}

module.exports = new enderecoController();
