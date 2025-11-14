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
        const { nome, marca, codigo, imagem_url, descricao, preco, qtd_estoque, categoria, genero, nota_olfativa } = req.body;
        const novoProduto = await Produto.create(req.body);

        return res.status(201).json(novoProduto);
    }

    // Atualiza um Produto
    async update(req, res) {
        const id = parseInt(req.params.id);
        const produtoAtualizado = await Produto.update(id, req.body);

        if(!produtoAtualizado) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        return res.status(200).json({menssage: 'Produto atualizado com sucesso'});
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