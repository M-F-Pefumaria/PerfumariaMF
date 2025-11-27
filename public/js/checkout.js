const btnAddEndereco = document.getElementById("add-address");
const addressBox = document.getElementById("address-box");
const addressTitle = document.getElementById("address-title");

let idEnderecoSelecionado = null;

const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

document.addEventListener('DOMContentLoaded', async () => {

    if (carrinho.length === 0) {
        window.location.href = 'index.html';
        return
    }

    await carregarEnderecos();

    carregarResumo(carrinho);

    btnAddEndereco.addEventListener('click', cadastrarEndereco);
    document.getElementById("btn-finish").addEventListener('click', finalizarCompra);
});

async function carregarEnderecos() {

    const response = await fetch('/endereco');
    const enderecos = await response.json();

    if (response.status === 401) {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = '/login.html';
        return;
    }

    addressBox.innerHTML = '';
    addressTitle.innerHTML = 'Endereço';

    if (enderecos.length === 0) {
        btnAddEndereco.style.display = "block";
    } else {

        btnAddEndereco.style.display = "none";

        enderecos.forEach((end, index) => {
            const card = document.createElement('div');
            card.className = "card-endereco";

            if (index === 0) {
                card.classList.add('selecionado');
                idEnderecoSelecionado = end.id_endereco;
            }

            card.onclick = function() {
                card.classList.add('selecionado');
                idEnderecoSelecionado = end.id_endereco;
            };

            card.innerHTML = `
                <div>
                    <p>${end.logradouro}, ${end.numero}</p>
                    <p><strong>CEP:</strong> ${end.cep} | ${end.cidade} - ${end.estado}</p>
                </div>
                <div class="card-btn">
                    <button onclick="deletarEndereco(${end.id_endereco})">
                        <span class="material-icons-outlined">delete</span>
                    </button>
                    <button onclick="editarEndereco(${end.id_endereco})">
                        <span class="material-icons-outlined">edit</span>
                    </button>
                </div>
            `;
            addressBox.appendChild(card);
        });
    }
}

function carregarResumo(carrinho) {
    const container = document.getElementById('itens-carrinho');
    const totalSpan = document.getElementById('valor-total');
    let totalProdutos = 0;

    container.innerHTML = ''

    carrinho.forEach((item, index)=> {
        const subtotal = item.preco * item.quantidade;
        totalProdutos += subtotal;

        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.imagem_url}"> <div class="cart-item-info">
                    <h4>${item.nome}</h4>
                    <p>Preço: R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                    <p>Quantidade: ${item.quantidade}</p>
                </div>
                <button onclick="removerItem(${index})" class="btn-remove-item">
                    <span class="material-icons-outlined">delete_outline</span>
                </button>
            </div>
        `;
    });

    document.getElementById('valor-total').innerText = `R$ ${totalProdutos.toFixed(2).replace('.', ',')}`;
}

window.removerItem = function(index) {
    carrinho.splice(index, 1); // Remove do array
    localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Salva
    carregarResumo(); // Atualiza a tela
}


async function finalizarCompra() {

    if (!idEnderecoSelecionado) {
        alert("Por favor, selecione um endereço de entrega.");
        return;
    }

    const radios = document.getElementsByName('metodo_pagamento');
    let formaPagamento = null;
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            formaPagamento = radios[i].value;
            break;
        }
    }

    if (!formaPagamento) {
        alert("Por favor, escolha uma forma de pagamento.");
        return;
    }

    const payload = {
        id_endereco: idEnderecoSelecionado,
        forma_pagamento: formaPagamento,
        itensCarrinho: carrinho.map(item => ({
            id_produto: item.id_produto,
            quantidade: item.quantidade
        }))
    };

    try {
        const response = await fetch('/pedido/finalizar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const resultado = await response.json();

        if (response.ok) {
            localStorage.removeItem('carrinho');
            window.location.href = '/index.html';
        } else {
            alert("Erro: " + resultado.message);
        }

    } catch (error) {
        console.error(error);
        alert("Erro de conexão ao finalizar pedido.");
    }

}

function cadastrarEndereco() {

    addressBox.innerHTML = '';
    addressTitle.textContent = 'adicionar endereço';

    btnAddEndereco.style.display = "none";

    const form = document.createElement("form");
    form.id = "form-endereco";

    form.innerHTML = `
            <span id="err-menssage"></span>

            <label>CEP</label>
            <input type="text" class="input" id="cep">

            <label>Endereço</label>
            <input type="text" class="input" id="address">

            <div class="row">
                <div class="col">
                    <label>Número</label>
                    <input type="text" class="input" id="numero">
                </div>
                <div class="col">
                    <label>Bairro</label>
                    <input type="text" class="input" id="bairro">
                </div>
            </div>

            <label>Complemento</label>
            <input type="text" class="input" id="complemento" placeholder="Opcional">

            <div class="row">
                <div class="col">
                    <label>Cidade</label>
                    <input type="text" class="input" id="cidade">
                </div>

                <div class="col">
                    <label>Estado</label>
                    <input type="text" class="input" id="estado">
                </div>
            </div>

            <div class="buttons">
                <a href="/checkout.html">voltar</a>
                <button type="submit" class="btn-save">Salvar</button>
            </div>
        `;

    addressBox.appendChild(form);

    consultarCep();

    document.getElementById("form-endereco").addEventListener('submit', salvarEndereco);
}

async function consultarCep() {
    const cep = document.getElementById('cep');
    const address = document.getElementById('address');
    const bairro = document.getElementById('bairro');
    const cidade = document.getElementById('cidade');
    const estado = document.getElementById('estado');
    const errorMenssage = document.getElementById('err-menssage');

    cep.addEventListener('focusout', async () => {

        try {
            const onlyNumbers = /^[0-9]+$/;
            const cepValid = /^[0-9]{8}$/;

            if (!onlyNumbers.test(cep.value) || !cepValid.test(cep.value)) {
                throw { cep_error: 'CEP inválido. Informe 8 dígitos numéricos.' };
            }

            const response = await fetch(`https://viacep.com.br/ws/${cep.value}/json/`);

            if (!response.ok) {
                throw { cep_error: 'Erro ao buscar o CEP.' };
            }

            const responseCep = await response.json();

            if (responseCep.erro) {
                throw { cep_error: 'CEP não encontrado.' };
            }

            address.value = responseCep.logradouro;
            bairro.value = responseCep.bairro;
            cidade.value = responseCep.localidade;
            estado.value = responseCep.uf;

        } catch (error) {
            errorMenssage.style.display = "block";
            errorMenssage.textContent = error.cep_error || 'Erro inesperado.';

            setTimeout(() => {
                errorMenssage.style.display = "none";
            }, 4000);
        }
    });
}

async function salvarEndereco(e) {
    e.preventDefault();

    const dados = {
        cep: document.getElementById('cep').value,
        logradouro: document.getElementById('address').value,
        numero: document.getElementById('numero').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        complemento: document.getElementById('complemento').value
    }

    const response = await fetch('/endereco', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    });

    if (response.ok) {
        alert('Endereço salvo!');
        document.getElementById('form-endereco').reset();
        carregarEnderecos();
    } else {
        alert('Erro ao salvar endereço.');
    }
}

async function editarEndereco(id) {

    addressBox.innerHTML = '';
    addressTitle.textContent = 'editar endereço';
    btnAddEndereco.style.display = "none";

    const response = await fetch(`/endereco/${id}`);
    const end = await response.json();

    const form = document.createElement("form");
    form.id = "form-endereco";

    form.innerHTML = `
            <span id="err-menssage"></span>

            <label>CEP</label>
            <input type="text" class="input" id="cep" value="${end.cep}">

            <label>Endereço</label>
            <input type="text" class="input" id="address" value="${end.logradouro}">

            <div class="row">
                <div class="col">
                    <label>Número</label>
                    <input type="text" class="input" id="numero" value="${end.numero}">
                </div>
                <div class="col">
                    <label>Bairro</label>
                    <input type="text" class="input" id="bairro" value="${end.bairro}">
                </div>
            </div>

            <label>Complemento</label>
            <input type="text" class="input" id="complemento" value="${end.complemento || ''}">

            <div class="row">
                <div class="col">
                    <label>Cidade</label>
                    <input type="text" class="input" id="cidade" value="${end.cidade}">
                </div>

                <div class="col">
                    <label>Estado</label>
                    <input type="text" class="input" id="estado" value="${end.estado}">
                </div>
            </div>

            <div class="buttons">
                <a href="/checkout.html">voltar</a>
                <button type="submit" class="btn-save">atualizar</button>
            </div>
        `;

    addressBox.appendChild(form);

    consultarCep();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dados = {
            id_endereco: id,
            cep: document.getElementById('cep').value,
            logradouro: document.getElementById('address').value,
            numero: document.getElementById('numero').value,
            bairro: document.getElementById('bairro').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            complemento: document.getElementById('complemento').value
        };

        const response = await fetch(`/endereco/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert('Endereço atualizado com sucesso!');
            carregarEnderecos();
        } else {
            alert('Erro ao atualizar endereço.');
        }
    });
}

async function deletarEndereco(id) {
    fetch(`/endereco/${id}`, {
        method: 'DELETE'
    }).then(() => {
        alert('Endereço deletado com sucesso!');
        carregarEnderecos();
    });
}