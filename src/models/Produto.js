const db = require('../config/database');

const Produto = {

    // cadastrar produto

    create: async ({nome, marca, codigo, imagem_url, descricao, preco, qtd_estoque, categoria, genero, nota_olfativa}) => {
        const [result] = await db.query("INSERT INTO produto (nome, marca, codigo, imagem_url, descricao, preco, qtd_estoque, categoria, genero, nota_olfativa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [nome, marca, codigo, imagem_url, descricao, preco, qtd_estoque, categoria, genero, nota_olfativa])
        
        return {id: result.insertId, nome: nome };
    
    },

    // atualizar produto

    update: async (id, {nome, marca, codigo, imagem_url, descricao, preco, qtd_estoque, categoria, genero, nota_olfativa}) => {

        const [result] = await db.query("UPDATE produto SET nome = ?, marca = ?, codigo = ?, imagem_url = ?, descricao = ?, preco = ?, qtd_estoque = ?, categoria = ?, genero = ?, nota_olfativa = ? WHERE id_produto = ?", [nome, marca, codigo, imagem_url, descricao, preco, qtd_estoque, categoria, genero, nota_olfativa, id])

        return result.affectedRows
    }

}

module.exports = Produto;