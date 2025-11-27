const db = require("../config/database");

class Pagamento {

    async create({id_pedido, forma_pagamento}){
        await db.query(`INSERT INTO pagamento (id_pedido, forma_pagamento, status_pagamento) VALUES (?, ?, 'PENDENTE')`, [id_pedido, forma_pagamento]);
    }

}

module.exports = new Pagamento();