document.addEventListener('DOMContentLoaded', async () => {
    carregarEnderecos();

    const btnAddEndereco = document.getElementById("btn-addEndereco");
    btnAddEndereco.addEventListener('click', cadastrarEndereco);

});

async function carregarEnderecos() {
    const content = document.getElementById("content");

    const btnAddEndereco = document.getElementById("btn-addEndereco");
    btnAddEndereco.style.display = "block";

    const response = await fetch('/endereco');
    const enderecos = await response.json();

    if (response.status === 401) {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = '/login.html';
        return;
    }

    content.innerHTML = '';

    if (enderecos.length === 0) {
        content.innerHTML = '<p id="message">Você ainda não possui nenhum endereço cadastrado.</p>';
    } else {
        enderecos.forEach(end => {
            const card = document.createElement('div');
            card.className = "card-endereco";

            card.innerHTML = `
                <h4>${end.logradouro}, ${end.numero}</h4>
                <p>${end.bairro} - ${end.cidade}/${end.estado}</p>
                <p>CEP: ${end.cep}</p>
                ${end.complemento ? `<p>Compl: ${end.complemento}</p>` : ''}

                <button class="btn-deletar" onclick="deletarEndereco(${end.id_endereco})">
                    <span class="material-icons-outlined">delete</span>
                </button>
            `;
            content.appendChild(card);
        });
    }
}

async function cadastrarEndereco() {
    const btnAddEndereco = document.getElementById("btn-addEndereco");
    const content = document.getElementById("content");

    content.innerHTML = '';


    btnAddEndereco.style.display = "none";

    const form = document.createElement("form");
    form.id = "form-endereco";

    form.innerHTML = `
            <div id="mensagem" class="mensagem"></div>

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
                <button type="submit" class="btn-save">Salvar</button>
            </div>
        `;

    content.appendChild(form);

    consultarCep();

    const formEndereco = document.getElementById("form-endereco");
    formEndereco.addEventListener('submit', salvarEndereco);
}

async function consultarCep() {
    const cep = document.getElementById('cep');
    const address = document.getElementById('address');
    const bairro = document.getElementById('bairro');
    const cidade = document.getElementById('cidade');
    const estado = document.getElementById('estado');
    const mensagem = document.getElementById('mensagem');

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
            mensagem.style.display = "block";
            mensagem.textContent = error.cep_error || 'Erro inesperado.';

            setTimeout(() => {
                mensagem.style.display = "none";
            }, 4000);

            console.log(error);
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

    const data = await response.json();

    if (response.ok) {
        alert('Endereço salvo!');
        document.getElementById('form-endereco').reset();
        carregarEnderecos();
    } else {
        alert('Erro ao salvar endereço.');
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