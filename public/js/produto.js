document.addEventListener("DOMContentLoaded", async () => {

    atualizarCarrinho();

    const productContainer = document.getElementById("product-container");
    const params = new URLSearchParams(window.location.search);
    const idProduto = params.get('id');

    fetch(`produto/${idProduto}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(produto => {
            productContainer.innerHTML = `
            <div class="img-wrapper">
                <img src="${produto.imagem_url}" alt="${produto.nome}">
            </div>
            
            <section class="product-details">
                <div class="header-info">
                    <h1>${produto.nome}</h1>
                    <span class="price">R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}</span>
                </div>

                <div class="description-box">
                    <span class="description-title">Descrição:</span>
                    <p>${produto.descricao}</p>
                </div>

                <div class="tags-box">
                    <strong>Notas:</strong> ${produto.nota_olfativa || '-'}
                </div>

                <div class="purchase-controls">
                    <div class="qtd-selector">
                        <button id="decrementQuantity">-</button>
                        <span id="quantity">1</span>
                        <button id="incrementQuantity">+</button>
                    </div>
                    
                    <button id="btn-adicionar" class="btn-add-cart">Adicionar ao Carrinho</button>
                </div>
            </section>
        `;

            const incrementQuantityButton = document.getElementById('incrementQuantity');
            const decrementQuantityButton = document.getElementById('decrementQuantity');
            const quantity = document.getElementById("quantity");
            const btnAdicionar = document.getElementById("btn-adicionar");

            incrementQuantityButton.addEventListener('click', () => {
                let currentQuantity = Number(quantity.innerText);

                if (currentQuantity < produto.qtd_estoque) {
                    currentQuantity++;
                    quantity.innerText = currentQuantity;
                }

                if (currentQuantity >= produto.qtd_estoque) {
                    incrementQuantityButton.disabled = true;
                }
            });

            decrementQuantityButton.addEventListener('click', () => {
                let currentQuantity = Number(quantity.innerText);

                if (currentQuantity > 1) {
                    currentQuantity--;
                    quantity.innerText = currentQuantity;

                    incrementQuantityButton.disabled = false;
                }
            });

            if (produto.qtd_estoque > 0) {
                btnAdicionar.addEventListener('click', () => {
                    let currentQuantity = parseInt(quantity.innerText);
                    adicionarProduto(produto, currentQuantity);
                });
            } else {
                btnAdicionar.textContent = "ESGOTADO";
                btnAdicionar.disabled = true;
                btnAdicionar.style.cursor = "not-allowed";
            }

        })
});

function adicionarProduto(produto, quantidade) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    const itemExistente = carrinho.find(item => item.id_produto === produto.id_produto);

    if (itemExistente) {
        itemExistente.quantidade = quantidade;
    } else {
        carrinho.push({
            id_produto: produto.id_produto,
            nome: produto.nome,
            preco: parseFloat(produto.preco),
            imagem_url: produto.imagem_url,
            quantidade: quantidade
        });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    atualizarCarrinho();
    document.getElementById("cart-sidebar").classList.add('open-sidebar');
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

document.getElementById("open-cart").addEventListener('click', () => {
    document.getElementById("cart-sidebar").classList.toggle('open-sidebar');
})

document.getElementById("close-btn").addEventListener('click', () => {
    document.getElementById("cart-sidebar").classList.remove('open-sidebar');
})