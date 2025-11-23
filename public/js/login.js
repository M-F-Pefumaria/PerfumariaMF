const loginForm = document.getElementById('login-form');
const msgAlerta = document.getElementById('msg-alerta');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    msgAlerta.innerText = '';

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
        msgAlerta.innerText = 'Por favor, preencha todos os campos.';
        return;
    }

    const login = await fetch('/usuario/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    });

    const loginData = await login.json();
    
    if (login.ok) {

        msgAlerta.innerText = 'Login realizado com sucesso!';

        setTimeout(() => {
            if(loginData.tipo === 'ADMIN') {
                window.location.href = '/admin/admin.html';
            } else {
                window.location.href = '/index.html';
            }
        }, 2000)
    } else {
        msgAlerta.innerText = loginData.message;
    }
    
});