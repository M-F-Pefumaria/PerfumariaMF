document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
});

async function carregarProdutos() {

    const produtoContainer = document.getElementById('produtos-container');

    fetch('/produto')
    .then(res => res.json())
    .then(data => {
        produtoContainer.innerHTML = '';

        data.forEach(produto => {
            const divProduto = document.createElement('div');
            divProduto.classList.add('produto-card');

            divProduto.innerHTML = `
                <a href="produto.html?id=${produto.id_produto}">
                    <span class="produto-favorite material-icons-outlined">favorite_border</span>
                    <img src="${produto.imagem_url}" alt="${produto.nome}">
                    <div class="produto-info">
                        <p class="produto-marca">${produto.marca}</p>
                        <h3 class="produto-nome">${produto.nome}</h3>
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

// Função para alternar o carrinho
function toggleCart() {
    document.getElementById("cart-sidebar").classList.toggle('open-sidebar');
    document.getElementById("cart-overlay").classList.toggle('open-sidebar'); 
}

const openCartBtn = document.getElementById("open-cart");
if (openCartBtn) {
    openCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCart();
    });
}

const closeBtns = document.querySelectorAll('.close-btn');
closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCart();
    });
});

const cartOverlay = document.getElementById("cart-overlay");
if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) {
            toggleCart();
        }
    });
}