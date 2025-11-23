const db = require('../config/database');

class Produto {

    // listar produtos
    async index() {
        const [result] = await db.query("SELECT * FROM produto")
        return result
    }

    // buscar produto
    async findById(id) {
        const [result] = await db.query("SELECT * FROM produto WHERE id_produto = ?", [id])
        return result[0]
    }

    // cadastrar produto
    async create({nome, marca, codigo, imagem_url, descricao, preco, qtd_estoque, categoria, genero, nota_olfativa}){
        const [result] = await db.query("INSERT INTO produto (nome, marca, codigo, imagem_url, descricao, preco, qtd_estoque, categoria, genero, nota_olfativa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [nome, marca, codigo, imagem_url, descricao, preco, qtd_estoque, categoria, genero, nota_olfativa])
        
        return {id: result.insertId, nome: nome };
    }

    // atualizar produto
    async update(id, {nome, marca, codigo, imagem_url, descricao, preco, qtd_estoque, categoria, genero, nota_olfativa}) {

        const [result] = await db.query("UPDATE produto SET nome = ?, marca = ?, codigo = ?, imagem_url = ?, descricao = ?, preco = ?, qtd_estoque = ?, categoria = ?, genero = ?, nota_olfativa = ? WHERE id_produto = ?", [nome, marca, codigo, imagem_url, descricao, preco, qtd_estoque, categoria, genero, nota_olfativa, id])

        return result.affectedRows
    }

    // Apagar Produto
    async destroy(id) {
        const [result] = await db.query("DELETE FROM produto WHERE id_produto = ?", [id])
        return result.affectedRows
    }
    
}

module.exports = new Produto();