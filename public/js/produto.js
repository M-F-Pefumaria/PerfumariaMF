document.addEventListener("DOMContentLoaded", async () => {

    const infoSection = document.getElementById("info-section");
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
            infoSection.innerHTML = `
                <div>
                    <h1>${produto.nome}</h1>
                    <span class="price">R$ ${produto.preco}</span>
                </div>
                <div class="description-box">
                    <p>Descrição:</p>
                    <p>${produto.descricao}</p>
                </div>
                <div class="tags-container">
                    <p><span>Notas:</span> ${produto.nota_olfativa}</p>
                </div>
                <div>
                    <button id="decrementQuantity">-</button>
                    <span id="quantity">1</span>
                    <button id="incrementQuantity">+</button>
                </div>
                <div class="actions">
                    <button onclick="addToCart(${produto.id_produto})">Adicionar ao Carrinho</button>
                </div>
            `;

            const incrementQuantityButton = document.getElementById('incrementQuantity');
            const decrementQuantityButton = document.getElementById('decrementQuantity');
            const quantity = document.getElementById("quantity");

            incrementQuantityButton.addEventListener('click', () => {
                let currentQuantity = parseInt(quantity.innerText);

                if (currentQuantity < produto.qtd_estoque) {
                    quantity.innerText = currentQuantity + 1;
                } else {
                    console.log("Quantidade máxima atingida");
                }
            });

            decrementQuantityButton.addEventListener('click', () => {
                let currentQuantity = parseInt(quantity.innerText);

                if (currentQuantity > 1) {
                    quantity.innerText = currentQuantity - 1;
                }
            });

        })
});

document.getElementById("open-cart").addEventListener('click', () => {
    document.getElementById("cart-sidebar").classList.toggle('open-sidebar');
})

document.getElementById("close-btn").addEventListener('click', () => {
    document.getElementById("cart-sidebar").classList.remove('open-sidebar');
})