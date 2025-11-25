const db = require("../config/database");

class Pedido {

    // Criar pedido
    async create({id_usuario, id_endereco, valor_total}) {
        const [result] = await db.query("INSERT INTO pedido (id_usuario, id_endereco, valor_total, status_pedido, tipo_entrega, data_hora) VALUES (?, ?, ?, 'PENDENTE', 'RECEBER', NOW())", [id_usuario, id_endereco, valor_total]);

        return result.insertId;
    }

}

module.exports = new Pedido();