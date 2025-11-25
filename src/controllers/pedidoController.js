// CORREÇÃO 1: Nome do arquivo correto (database)
const db = require('../config/database');
const Pedido = require('../models/Pedido');
const PedidoProduto = require('../models/PedidoProduto');
const Pagamento = require('../models/Pagamento');
const Produto = require('../models/Produto');

class pedidoController {

    async finalizarCompra(req, res) {
        try {
            // CORREÇÃO: Usar id_usuario (conforme salvo no login)
            const id_usuario = req.session.usuarioLogado.id;
            const { itensCarrinho, id_endereco, forma_pagamento } = req.body;

            // 1. Calcula o valor total
            let valorTotal = 0;

            for (let item of itensCarrinho) {
                const ProdutoBanco = await Produto.findById(item.id_produto);
                // Adicionei parseFloat para garantir conta certa
                valorTotal += parseFloat(ProdutoBanco.preco) * item.quantidade;
            }

            // 2. Cria o Pedido
            // CORREÇÃO 2: Passando como OBJETO {} porque o Model Pedido.js espera desestruturação
            const idPedidoCriado = await Pedido.create({
                id_usuario: id_usuario,
                id_endereco: id_endereco,
                valor_total: valorTotal
            });
            
            console.log(`Pedido ${idPedidoCriado} criado com sucesso!`);

            // 3. Salva os Itens do Pedido
            for (let item of itensCarrinho) {
                const produtoBanco = await Produto.findById(item.id_produto);

                // CORREÇÃO 3: Passando como OBJETO {} para o Model PedidoProduto.js
                await PedidoProduto.addItem({
                    id_pedido: idPedidoCriado,
                    id_produto: item.id_produto,
                    quantidade: item.quantidade,
                    preco: produtoBanco.preco
                });
            }

            // 4. Salva o Pagamento
            // CORREÇÃO 4: Passando como OBJETO {} para o Model Pagamento.js
            await Pagamento.create({
                id_pedido: idPedidoCriado,
                forma_pagamento: forma_pagamento
            });

            res.status(201).json({
                message: 'Pedido Realizado com sucesso!',
                id_pedido: idPedidoCriado
            });

        } catch (error) {
            console.error("Erro no checkout:", error);
            res.status(500).json({ message: 'Erro ao processar o pedido', erro: error.message });
        }
    }
}

module.exports = new pedidoController();