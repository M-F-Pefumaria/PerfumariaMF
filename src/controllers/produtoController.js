const Produto = require('../models/Produto');

class ProdutoController {

    // Listagem de Produtos
    async index(req, res) {
        const produtos = await Produto.index();
        return res.status(200).json(produtos);
    }

    // Mostra um Produto
    async show(req, res) {
        const id = parseInt(req.params.id);
        const produto = await Produto.findById(id);

        if(!produto) {
            res.status(404).json({ message: 'Produto não encontrado' });
        }

        return res.status(200).json(produto);
    }

    // Cria um novo Produto
    async create(req, res) {

        let imagePath = '';

        if(req.file) {
            imagePath = `uploads/${req.file.filename}`;
        }

        const dadosProduto = {
            ...req.body,
            imagem_url: imagePath
        }

        const novoProduto = await Produto.create(dadosProduto);

        return res.status(201).json(novoProduto);
    }

    // Atualiza um Produto
    async update(req, res) {
        const id = parseInt(req.params.id);
        const dadosAtualizados = { ...req.body};

        if(req.file) {
            dadosAtualizados.imagem_url = `uploads/${req.file.filename}`;
        }

        const produtoAtualizado = await Produto.update(id, dadosAtualizados);

        if(!produtoAtualizado) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        return res.status(200).json({message: 'Produto atualizado com sucesso'});
    }

    // Exclui um Produto
    async destroy(req, res) {
        const id = parseInt(req.params.id);
        const produtoDeletado = await Produto.destroy(id);

        if(!produtoDeletado) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        return res.status(200).json({message: 'Produto excluido com sucesso'});

    }
}

module.exports = new ProdutoController();