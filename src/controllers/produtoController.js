const { parse } = require('dotenv');
const Produto = require('../models/Produto');

const produtoController = {

    cadastrarProduto: async (req, res) => {
        try {
            const novoProduto = await Produto.create(req.body);
            res.status(201).json(novoProduto);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao cadastrar produto', erro: error.message })
            console.log(error);
        }
    },

    atualizarProduto: async (req, res) => {
        const {id} = req.params;

        try {

            const produtoAtualizado = await Produto.update(id, req.body);
           
            if (produtoAtualizado === 0) {
                res.status(404).json({ message: 'Produto não encontrado' })
            }
                
            res.status(200).json({ id: id, ...req.body });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar produto', erro: error.message })
            console.log(error);
        }

    }

}

module.exports = produtoController;