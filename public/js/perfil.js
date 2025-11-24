document.addEventListener('DOMContentLoaded', () => {
    carregarEnderecos();
    configurarBuscaCEP();
});

// 1. Listar Endereços
async function carregarEnderecos() {
    const lista = document.getElementById('lista-enderecos');
    
    try {
        const response = await fetch('/api/enderecos');
        
        if (response.status === 401) {
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = '/login.html';
            return;
        }

        const enderecos = await response.json();
        lista.innerHTML = '';

        if (enderecos.length === 0) {
            lista.innerHTML = '<p>Nenhum endereço cadastrado.</p>';
            return;
        }

        enderecos.forEach(end => {
            const card = document.createElement('div');
            card.classList.add('card-endereco');
            card.innerHTML = `
                <h4>${end.logradouro}, ${end.numero}</h4>
                <p>${end.bairro} - ${end.cidade}/${end.estado}</p>
                <p>CEP: ${end.cep}</p>
                ${end.complemento ? `<p>Compl: ${end.complemento}</p>` : ''}
                
                <button class="btn-deletar" onclick="deletarEndereco(${end.id_endereco})">
                    <span class="material-icons-outlined">delete</span>
                </button>
            `;
            lista.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        lista.innerHTML = '<p>Erro ao carregar endereços.</p>';
    }
}

// 2. Salvar Novo Endereço
document.getElementById('form-endereco').addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        cep: document.getElementById('cep').value,
        logradouro: document.getElementById('logradouro').value,
        numero: document.getElementById('numero').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        complemento: document.getElementById('complemento').value
    };

    try {
        const response = await fetch('/api/enderecos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert('Endereço salvo!');
            document.getElementById('form-endereco').reset(); // Limpa o form
            carregarEnderecos(); // Recarrega a lista
        } else {
            alert('Erro ao salvar endereço.');
        }
    } catch (error) {
        console.error(error);
        alert('Erro de conexão.');
    }
});

// 3. Deletar (Tornar global para o onclick funcionar)
window.deletarEndereco = async (id) => {
    if (confirm('Remover este endereço?')) {
        try {
            const response = await fetch(`/api/enderecos/${id}`, { method: 'DELETE' });
            if (response.ok) {
                carregarEnderecos();
            } else {
                alert('Erro ao remover.');
            }
        } catch (error) {
            console.error(error);
        }
    }
};

// 4. BÔNUS: Busca CEP Automática (ViaCEP)
function configurarBuscaCEP() {
    const inputCep = document.getElementById('cep');
    
    inputCep.addEventListener('blur', async () => {
        let cep = inputCep.value.replace(/\D/g, ''); // Remove traços

        if (cep.length === 8) {
            // Preenche com "..." enquanto busca
            document.getElementById('logradouro').value = "...";
            
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await res.json();

                if (!data.erro) {
                    document.getElementById('logradouro').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('estado').value = data.uf;
                    document.getElementById('numero').focus(); // Pula pro número
                } else {
                    alert("CEP não encontrado.");
                }
            } catch (error) {
                console.error("Erro ao buscar CEP");
            }
        }
    });
}

// Logout (se quiser usar o botão do header)
document.getElementById('logout-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login.html';
});