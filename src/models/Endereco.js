const db = require('../config/database');

class Endereco {

    async create(id_usuario, cep, logradouro, numero, bairro, cidade, estado, complemento) {
        const [result] = await db.query(`INSERT INTO endereco (cep, logradouro, numero, bairro, cidade, estado, complemento, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [cep, logradouro, numero, bairro, cidade, estado, complemento, id_usuario]);

        return { id_endereco: result.insertId, id_usuario: id_usuario};
    }

    async findById(idUsuario) {
        const [rows] = await db.query('SELECT * FROM endereco WHERE id_usuario = ?', [idUsuario]);
        return rows;
    }
    
    async destroy(idEndereco, idUsuario) {
        const [result] = await db.query("DELETE FROM endereco WHERE id_endereco = ? AND id_usuario = ?", [idEndereco, idUsuario]);
        return result.affectedRows
    }
}

module.exports = new Endereco();