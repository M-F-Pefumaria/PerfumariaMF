const produtoContainer = document.getElementById('produtos-container');

carregarProdutos();

function carregarProdutos() {
    fetch('/produto')
    .then(res => res.json())
    .then(data => {
        produtoContainer.innerHTML = '';

        data.forEach(produto => {
            const divProduto = document.createElement('div');

            divProduto.innerHTML = `
                <a href="produto.html?id=${produto.id_produto}" class="produto-card">
                    <span class="produto-favorite material-icons-outlined">favorite_border</span>
                    <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=500" alt="${produto.nome}">
                    <div class="produto-info">
                        <p class="produto-marca">${produto.marca}</p>
                        <h3 class="produto-nome">${produto.nome}</h3>
                        <p class="produto-volume">100ml</p>
                        <div class="produto-preco">
                            <span>${produto.preco}</span>
                        </div>
                    </div>
                </a>
            `;

            produtoContainer.appendChild(divProduto)
        });
    });
}

document.getElementById("open-cart").addEventListener('click', () => {
    document.getElementById("cart-sidebar").classList.toggle('open-sidebar');
})

document.getElementById("close-btn").addEventListener('click', () => {
    document.getElementById("cart-sidebar").classList.remove('open-sidebar');
})