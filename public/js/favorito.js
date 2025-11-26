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