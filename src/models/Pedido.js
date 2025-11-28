const db = require("../config/database");

class Pedido {

    // Criar pedido
    async create({id_usuario, id_endereco, valor_total}) {
        const [result] = await db.query("INSERT INTO pedido (id_usuario, id_endereco, valor_total, status_pedido, tipo_entrega, data_hora) VALUES (?, ?, ?, 'PENDENTE', 'RECEBER', NOW())", [id_usuario, id_endereco, valor_total]);

        return result.insertId;
    }

    async findAllAdmin() {
        const query = `
            SELECT p.id_pedido, p.data_hora, p.valor_total, p.status_pedido, u.nome as nome_cliente, u.email FROM pedido p JOIN usuario u ON p.id_usuario = u.id_usuario ORDER BY p.data_hora DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    async updateStatus(idPedido, novoStatus) {
        const [result] = await db.query(
            "UPDATE pedido SET status_pedido = ? WHERE id_pedido = ?", 
            [novoStatus, idPedido]
        );
        return result.affectedRows;
    }

}

module.exports = new Pedido();