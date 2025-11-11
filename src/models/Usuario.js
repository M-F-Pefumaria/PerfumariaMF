const db = require('../config/database');

const Usuario = {

    // criar usuario




    // buscar usuario por email

    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
        return rows[0] || null;
    }

};

module.exports = Usuario;