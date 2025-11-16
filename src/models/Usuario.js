const db = require('../config/database');
const { create } = require('./Produto');

class Usuario {

    // cadastrar usuario

    async create(nome, sobrenome, cpf, data_nascimento, celular, email, senha_hash, tipo_usuario) {
        await db.query("INSERT INTO usuario (nome, sobrenome, cpf, data_nascimento, celular, email, senha_hash, tipo_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [nome, sobrenome, cpf, data_nascimento, celular, email, senha_hash, tipo_usuario])
    }


    // buscar usuario por email

    async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
        return rows[0] || null;
    }

};

module.exports = new Usuario();