const db = require('../config/database');

const Usuario = {

    // cadastrar usuario

    create: async (nome, sobrenome, cpf, data_nascimento, celular, email, senha_hash) => {
        await db.query("INSERT INTO usuario (nome, sobrenome, cpf, data_nascimento, celular, email, senha_hash, tipo_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, 'CLIENTE')", [nome, sobrenome, cpf, data_nascimento, celular, email, senha_hash])
    },


    // buscar usuario por email

    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
        return rows[0] || null;
    }

};

module.exports = Usuario;