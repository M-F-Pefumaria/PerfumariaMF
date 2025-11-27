const Endereco = require('../models/Endereco');

class enderecoController {

    async index(req, res) {
        const id_usuario = req.session.usuarioLogado.id;
        const enderecos = await Endereco.findAll(id_usuario);

        res.status(200).json(enderecos);
    }

    async show(req, res) {
        const id_usuario = req.session.usuarioLogado.id;
        const id_endereco = req.params.id;

        const endereco = await Endereco.findById(id_endereco, id_usuario);

        if (!endereco) {
            return res.status(404).json({ error: "Endereço não encontrado" });
        }

        res.status(200).json(endereco);
    }

    async create(req, res) {
        const id_usuario = req.session.usuarioLogado.id;
        const { cep, logradouro, numero, bairro, cidade, estado, complemento} = req.body;

        const novoEndereco = await Endereco.create(id_usuario, cep, logradouro, numero, bairro, cidade, estado, complemento);

        res.status(201).json(novoEndereco);
    }

    async update(req, res) {
        const id_usuario = req.session.usuarioLogado.id;
        const id_endereco = req.params.id;
        const dadosAtualizados = { ...req.body };

        await Endereco.update(id_endereco, id_usuario, dadosAtualizados);

        return res.status(200).json({ message: 'Endereço atualizado com sucesso' });
    }

    async destroy(req, res) {
        const id_usuario = req.session.usuarioLogado.id;
        const id_endereco = req.params.id

        const deletado = await Endereco.destroy(id_endereco, id_usuario);

        if (deletado) {
            res.status(200).json({ message: 'Endereço removido.' });
        } else {
            res.status(404).json({ message: 'Endereço não encontrado.' });
        }
    }

}

module.exports = new enderecoController();
