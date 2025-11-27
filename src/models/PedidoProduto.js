const db = require("../config/database");

class PedidoProduto {
    async addItem({id_pedido, id_produto, quantidade, preco}){
        await db.query(`INSERT INTO pedido_produto (id_pedido, id_produto, quantidade, preco_unitario_momento) VALUES (?, ?, ?, ?)`, [id_pedido, id_produto, quantidade, preco]);
    }
}

module.exports = new PedidoProduto();