document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    atualizarCarrinho();
});

async function carregarProdutos() {

    const produtoContainer = document.getElementById('produtos-container');

    fetch('/produto')
        .then(res => res.json())
        .then(data => {
            produtoContainer.innerHTML = '';

            data.forEach(produto => {

                if (produto.qtd_estoque > 0) {
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
                    produtoContainer.appendChild(divProduto);
                }

            });
        });
}

function atualizarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const containerItems = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total-final');

    if (!containerItems) return;

    containerItems.innerHTML = '';
    let total = 0;

    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        containerItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.imagem_url}">
                <div class="cart-item-info">
                    <h4>${item.nome}</h4>
                    <p>Preço: R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                    <p>Quantidade: ${item.quantidade}</p>
                </div>
                <span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
                <button onclick="removerItem(${index})" class="btn-remove-item">
                    <span class="material-icons-outlined">delete_outline</span>
                </button>
            </div>
        `;
    });

    totalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

window.removerItem = function (index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinho();
}

const btnCheckout = document.querySelector('.btn-checkout');
if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio.");
            return;
        }
        window.location.href = '/checkout.html';
    });
}

// Função para alternar o carrinho

document.getElementById("open-cart").addEventListener('click', () => {
    document.getElementById("cart-sidebar").classList.toggle('open-sidebar');
})

document.getElementById("close-btn").addEventListener('click', () => {
    document.getElementById("cart-sidebar").classList.remove('open-sidebar');
})

/* Menu Conta */

const accountIcon = document.getElementById('account-icon');
const userMenu = document.querySelector('.user-menu');
const userDropdown = document.querySelector('.user-menu .dropdown-content');

if (accountIcon && userDropdown && userMenu) {
    accountIcon.addEventListener('click', function (e) {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    // Fecha o dropdown ao clicar fora
    document.addEventListener('click', function (e) {
        if (!userMenu.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });

    // Fecha com Esc
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            userDropdown.classList.remove('show');
        }
    });

    // Logout
    const logoutBtnEl = document.getElementById('logout-btn');
    if (logoutBtnEl) {
        logoutBtnEl.addEventListener('click', function (e) {
            e.preventDefault();
            fetch('/usuario/logout', { method: 'POST' }).finally(() => {
                window.location.href = '/login.html';
            });
        });
    }

    document.getElementById('meu-perfil').addEventListener('click', () => {
        window.location.href = '/perfil.html';
    })


}