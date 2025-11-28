const Pedido = require('../models/Pedido');
const PedidoProduto = require('../models/PedidoProduto');
const Pagamento = require('../models/Pagamento');
const Produto = require('../models/Produto');

class pedidoController {

    async finalizarCompra(req, res) {
        try {
            const id_usuario = req.session.usuarioLogado.id;
            const { itensCarrinho, id_endereco, forma_pagamento } = req.body;

            let valorTotal = 0;

            for (let item of itensCarrinho) {
                const ProdutoBanco = await Produto.findById(item.id_produto);
                valorTotal += parseFloat(ProdutoBanco.preco) * item.quantidade;
            }

            const idPedidoCriado = await Pedido.create({
                id_usuario: id_usuario,
                id_endereco: id_endereco,
                valor_total: valorTotal
            });
            
            console.log(`Pedido ${idPedidoCriado} criado com sucesso!`);

            for (let item of itensCarrinho) {
                const produtoBanco = await Produto.findById(item.id_produto);

                await PedidoProduto.addItem({
                    id_pedido: idPedidoCriado,
                    id_produto: item.id_produto,
                    quantidade: item.quantidade,
                    preco: produtoBanco.preco
                });
            }

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

    async listarPedidosAdmin(req, res) {
        try {
            const pedidos = await Pedido.findAllAdmin();
            res.status(200).json(pedidos);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar pedidos.' });
        }
    }

    async atualizarStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const statusPermitidos = ['PENDENTE', 'PROCESSANDO', 'ENVIADO', 'ENTREGUE', 'CANCELADO'];
            if (!statusPermitidos.includes(status)) {
                return res.status(400).json({ message: 'Status inválido.' });
            }

            const affectedRows = await Pedido.updateStatus(id, status);

            if (affectedRows > 0) {
                return res.status(200).json({ message: 'Status atualizado com sucesso!' });
            } else {
                return res.status(404).json({ message: 'Pedido não encontrado.' });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao atualizar status.' });
        }
    }
}

module.exports = new pedidoController();