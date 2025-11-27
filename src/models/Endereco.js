const db = require('../config/database');

class Endereco {

    async create(id_usuario, cep, logradouro, numero, bairro, cidade, estado, complemento) {
        const [result] = await db.query(`INSERT INTO endereco (cep, logradouro, numero, bairro, cidade, estado, complemento, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [cep, logradouro, numero, bairro, cidade, estado, complemento, id_usuario]);

        return { id_endereco: result.insertId, id_usuario: id_usuario};
    }

    async findAll(id_usuario) {
        const [result] = await db.query('SELECT * FROM endereco WHERE id_usuario = ?', [id_usuario]);
        return result;
    }

    // buscar endereco
    async findById(id_endereco, id_usuario) {
        const [result] = await db.query('SELECT * FROM endereco WHERE id_endereco = ? AND id_usuario = ?', [id_endereco, id_usuario]);
        return result[0];
    }

    // atualizar endereco
    async update(id_endereco, id_usuario,{cep, logradouro, numero, bairro, cidade, estado, complemento}) {

        const [result] = await db.query(
            "UPDATE endereco SET cep = ?, logradouro = ?, numero = ?, bairro = ?, cidade = ?, estado = ?, complemento = ? WHERE id_endereco = ? AND id_usuario = ?", [cep, logradouro, numero, bairro, cidade, estado, complemento, id_endereco, id_usuario]
        );

        return result.affectedRows;
    }
    
    async destroy(id_endereco, id_usuario) {
        const [result] = await db.query("DELETE FROM endereco WHERE id_endereco = ? AND id_usuario = ?", [id_endereco, id_usuario]);
        return result.affectedRows
    }
}

module.exports = new Endereco();