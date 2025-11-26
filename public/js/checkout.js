const btnAddEndereco = document.getElementById("add-address");
const addressBox = document.getElementById("address-box");
const addressTitle = document.getElementById("address-title");

document.addEventListener('DOMContentLoaded', async () => {
    carregarEnderecos();

    btnAddEndereco.addEventListener('click', cadastrarEndereco);
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
    addressTitle.innerHTML = 'entrega';

    if (enderecos.length === 0) {
        btnAddEndereco.style.display = "block";
    } else {

        btnAddEndereco.style.display = "none";

        enderecos.forEach(end => {
            const card = document.createElement('div');
            card.className = "card-endereco";

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

async function cadastrarEndereco() {

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
    const response = await fetch(`/endereco/${id}`);

    const endereco = await response.json();

    addressBox.innerHTML = '';
    addressTitle.textContent = 'editar endereço';
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
                <a href="/checkout.html">cancelar</a>
                <button type="submit" class="btn-save">Atualizar</button>
            </div>
        `;

    addressBox.appendChild(form);

    document.getElementById('cep').value = endereco.cep;
    document.getElementById('address').value = endereco.logradouro;
    document.getElementById('numero').value = endereco.numero;
    document.getElementById('bairro').value = endereco.bairro;
    document.getElementById('complemento').value = endereco.complemento || '';
    document.getElementById('cidade').value = endereco.cidade;
    document.getElementById('estado').value = endereco.estado;

    consultarCep();

    form.addEventListener('submit', (e) => atualizarEndereco(e, id));
}

async function atualizarEndereco(e, id) {
    e.preventDefault();

    const dados = {
        id_endereco: id, // Alguns backends exigem o ID no corpo também
        cep: document.getElementById('cep').value,
        logradouro: document.getElementById('address').value,
        numero: document.getElementById('numero').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        complemento: document.getElementById('complemento').value
    }

    try {
        const response = await fetch(`/endereco/${id}`, { // URL com ID
            method: 'PUT', // Método HTTP para atualização
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert('Endereço atualizado com sucesso!');
            carregarEnderecos(); // Recarrega a lista
        } else {
            alert('Erro ao atualizar endereço.');
        }
    } catch (error) {
        console.error(error);
        alert('Erro de conexão ao tentar atualizar.');
    }
}

async function deletarEndereco(id) {
    fetch(`/endereco/${id}`, {
        method: 'DELETE'
    }).then(() => {
        alert('Endereço deletado com sucesso!');
        carregarEnderecos();
    });
}