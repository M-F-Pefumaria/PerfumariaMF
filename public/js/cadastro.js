document.getElementById('cadastro-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const dadosUsuario = {
        nome: document.getElementById('nome').value,
        sobrenome: document.getElementById('sobrenome').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
        senhaConfirmacao: document.getElementById('senha_confirmacao').value,
        cpf: document.getElementById('cpf').value,
        dataNascimento: document.getElementById('data_nascimento').value,
        celular: document.getElementById('celular').value
    }

    const msgAlerta = document.getElementById('msg-alerta');

    const cadastro = await fetch('/usuario/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosUsuario)
    });

    const cadastroData = await cadastro.json();

    if (cadastro.ok) {
        msgAlerta.innerText = 'Cadastro realizado com sucesso!';
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 2000);
    } else {
        msgAlerta.innerText = cadastroData.message;
    }
});