const btnProduto = document.getElementById('btn-produtos');
const mainContainer = document.querySelector('.main-container');
const headerTitle = document.getElementById('header-title');
const logoutBtn = document.getElementById('logout-btn');

// Verifica se o usuario é admin 

document.addEventListener('DOMContentLoaded', async () => {

    const adminAuth = await fetch('/usuario/admin');

    if (!adminAuth.ok) {
        window.location.href = '/login.html';
        return;
    }

});


btnProduto.addEventListener('click', () => {
    carregarProdutos();
});

// Função para carregar os produtos

function carregarProdutos() {
    fetch('/produto')
        .then(res => res.json())
        .then(data => {
            mainContainer.innerHTML = '';

            headerTitle.textContent = 'Produtos';

            let tabelaHTML = `

            <div class="header-produtos">
                <h2>Lista de Produtos</h2>
                <button onclick="adicionarProduto()">Adicionar</button>
            </div>
        
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Marca</th>
                        <th>Preço</th>
                        <th>Código</th>
                        <th>Categoria</th>
                        <th>Estoque</th>
                        <th>SubTotal</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
            `;

            data.forEach(produto => {

                tabelaHTML += `
                    <tr>
                        <td>${produto.nome}</td>
                        <td>${produto.marca}</td>
                        <td>R$ ${produto.preco}</td>
                        <td>${produto.codigo}</td>
                        <td>${produto.categoria}</td>
                        <td>${produto.qtd_estoque}</td>
                        <td>R$ ${(produto.preco * produto.qtd_estoque).toFixed(2)}</td>
                        <td class="acoes">
                            <button onclick="editarProduto(${produto.id_produto})"><span class="material-icons-outlined">edit</span></button>
                            <button onclick="deletarProduto(${produto.id_produto})"><span class="material-icons-outlined">delete</span></button>
                        </td>
                    </tr>
                `;
            });

            tabelaHTML += `
                </tbody>
            </table>
            `;

            mainContainer.innerHTML = tabelaHTML;
        });
}

// Funcao para adicionar produtos

function adicionarProduto() {

    mainContainer.innerHTML = '';
    headerTitle.textContent = 'Criar Produto';

    let formHTML = `
        <div class="formulario-container">

            <div class="formulario-esquerda">
                <form id="produto-form">
                    <div class="formulario-secao">
                        <div class="grid-duas-colunas">
                            <div class="grupo-campo">
                                <label for="nome">Nome:</label>
                                <input type="text" id="nome" required>
                            </div>
                            <div class="grupo-campo">
                                <label for="marca">Marca:</label>
                                <input type="text" id="marca" name="marca" required>
                            </div>
                        </div>
                    </div>
                    <div class="formulario-secao">
                        <div class="grupo-campo">
                            <label for="descricao">Descrição:</label>
                            <textarea id="descricao" name="descricao" required rows="5"></textarea>
                        </div>
                    </div>
                    <div class="formulario-secao">
                        <div class="grid-duas-colunas">
                            <div class="grupo-campo">
                                <label for="preco">Preço:</label>
                                <input type="number" id="preco" step="0.01" required>
                            </div>
                            <div class="grupo-campo">
                                <label for="qtd_estoque">Estoque:</label>
                                <input type="number" id="qtd_estoque" name="qtd_estoque" required>
                            </div>
                        </div>
                    </div>
                    <div class="formulario-secao">
                        <div class="grid-duas-colunas">
                            <div class="grupo-campo">
                                <label for="genero">Gênero:</label>
                                <select id="genero" required>
                                    <option value="">Selecione um genero</option>
                                    <option value="FEMININO">Feminino</option>
                                    <option value="MASCULINO">Masculino</option>
                                    <option value="UNISSEX">Unissex</option>
                                </select>
                            </div>
                            <div class="grupo-campo">
                                <label for="nota_olfativa">Nota Olfativa:</label>
                                <input type="text" id="nota_olfativa" required>
                            </div>
                        </div>
                    </div>
                    <div class="formulario-rodape">
                        <button type="button" class="botao botao-cancelar" onclick="carregarProdutos()">Cancelar</button>
                        <button type="submit" class="botao botao-publicar">Criar</button>
                    </div>
                </form>
            </div>

            <div class="formulario-direita">
                <div class="formulario-secao">
                        <div class="grupo-campo">
                        <label for="codigo">Código:</label>
                        <input type="text" id="codigo" name="codigo" required>
                    </div>
                </div>
                <div class="formulario-secao">
                    <div class="grupo-campo" enctype="multipart/form-data">
                        <label for="imagem_url">Imagens</label>
                        <input type="file" id="imagem_url" name="imagem_url" required>
                    </div>
                </div>
                <div class="formulario-secao">
                    <div class="grupo-campo">
                        <label for="categoria">Categoria:</label>
                        <select id="categoria"required>
                            <option value="">Selecione uma categoria</option>
                            <option value="PERFUME">Perfume</option>
                            <option value="CREME">Creme</option>
                            <option value="BODY_SPLASH">Body Splash</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    `;

    mainContainer.innerHTML = formHTML;

    const form = document.getElementById('produto-form');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData();

        formData.append('nome', document.getElementById('nome').value);
        formData.append('marca', document.getElementById('marca').value);
        formData.append('codigo', document.getElementById('codigo').value);
        formData.append('descricao', document.getElementById('descricao').value);
        formData.append('preco', parseFloat(document.getElementById('preco').value));
        formData.append('qtd_estoque', parseInt(document.getElementById('qtd_estoque').value));
        formData.append('categoria', document.getElementById('categoria').value);
        formData.append('genero', document.getElementById('genero').value);
        formData.append('nota_olfativa', document.getElementById('nota_olfativa').value);

        const fileInput = document.getElementById('imagem_url');
        if (fileInput.files[0]) {
            formData.append('imagem_url', fileInput.files[0]);
        }

        fetch('/produto/cadastro', {
            method: 'POST',
            body: formData
        }).then(res => {
            if (res.ok) {
                alert('Produto adicionado com sucesso!');
                carregarProdutos();
            } else {
                alert('Erro ao adicionar produto.');
            }
        })
    });
}

// Função para editar produto

function editarProduto(produtoId) {

    mainContainer.innerHTML = '';
    headerTitle.textContent = 'Editar Produto';

    fetch(`/produto/${produtoId}`)
        .then(res => res.json())
        .then(produto => {
            let formHTML = `
        <div class="formulario-container">
            <div class="formulario-esquerda">
                <form id="produto-form">
                    <div class="formulario-secao">
                        <div class="grid-duas-colunas">
                            <div class="grupo-campo">
                                <label for="nome">Nome:</label>
                                <input type="text" value="${produto.nome}" id="nome" required>
                            </div>
                            <div class="grupo-campo">
                                <label for="marca">Marca:</label>
                                <input type="text" id="marca" value="${produto.marca}" required>
                            </div>
                        </div>
                    </div>
                    <div class="formulario-secao">
                        <div class="grupo-campo">
                            <label for="descricao">Descrição:</label>
                            <textarea id="descricao" required rows="5">${produto.descricao}</textarea>
                        </div>
                    </div>
                    <div class="formulario-secao">
                        <div class="grid-duas-colunas">
                            <div class="grupo-campo">
                                <label for="preco">Preço:</label>
                                <input type="number" id="preco" step="0.01" value="${produto.preco}" required>
                            </div>
                            <div class="grupo-campo">
                                <label for="qtd_estoque">Estoque:</label>
                                <input type="number" id="qtd_estoque" value="${produto.qtd_estoque}" required>
                            </div>
                        </div>
                    </div>
                    <div class="formulario-secao">
                        <div class="grid-duas-colunas">
                            <div class="grupo-campo">
                                <label for="genero">Gênero:</label>
                                <select id="genero" required>
                                    <option value="${produto.genero}">${produto.genero}</option>
                                    <option value="FEMININO">Feminino</option>
                                    <option value="MASCULINO">Masculino</option>
                                    <option value="UNISSEX">Unissex</option>
                                </select>
                            </div>
                            <div class="grupo-campo">
                                <label for="nota_olfativa">Nota Olfativa:</label>
                                <input type="text" value="${produto.nota_olfativa}" id="nota_olfativa" required>
                            </div>
                        </div>
                    </div>
                    <div class="formulario-rodape">
                        <button type="button" class="botao botao-cancelar" onclick="carregarProdutos()">Cancelar</button>
                        <button type="submit" class="botao botao-publicar">Atualizar</button>
                    </div>
                </form>
            </div>

            <div class="formulario-direita">
                <div class="formulario-secao">
                        <div class="grupo-campo">
                        <label for="codigo">Código:</label>
                        <input type="text" id="codigo" value="${produto.codigo}" required>
                    </div>
                </div>
                <div class="formulario-secao">
                    <div class="grupo-campo" enctype="multipart/form-data">
                        <label for="imagem_url">Imagens</label>
                        <img src="/${produto.imagem_url}" width="100" style="display:block; margin-bottom:10px">
                
                        <input type="file" id="imagem_url" name="imagem_url">
                    </div>
                </div>
                <div class="formulario-secao">
                    <div class="grupo-campo">
                        <label for="categoria">Categoria:</label>
                        <select id="categoria" required>
                            <option value="${produto.categoria}">${produto.categoria}</option>
                            <option value="PERFUME">Perfume</option>
                            <option value="CREME">Creme</option>
                            <option value="BODY_SPLASH">Body Splash</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    `;

            mainContainer.innerHTML = formHTML;

            const form = document.getElementById('produto-form');

            form.addEventListener('submit', function (e) {
                e.preventDefault();

                const formData = new FormData();

                formData.append('nome', document.getElementById('nome').value);
                formData.append('marca', document.getElementById('marca').value);
                formData.append('codigo', document.getElementById('codigo').value);
                formData.append('descricao', document.getElementById('descricao').value);
                formData.append('preco', parseFloat(document.getElementById('preco').value));
                formData.append('qtd_estoque', parseInt(document.getElementById('qtd_estoque').value));
                formData.append('categoria', document.getElementById('categoria').value);
                formData.append('genero', document.getElementById('genero').value);
                formData.append('nota_olfativa', document.getElementById('nota_olfativa').value);

                const fileInput = document.getElementById('imagem_url');
                if (fileInput.files[0]) {
                    formData.append('imagem_url', fileInput.files[0]);
                }

                fetch(`/produto/${produtoId}`, {
                    method: 'PUT',
                    body: formData
                }).then(res => {
                    if (res.ok) {
                        alert('Produto atualizado com sucesso!');
                        carregarProdutos();
                    } else {
                        alert('Erro ao atualizar produto.');
                    }
                });
            });
        });
}

// PEDIDOS

const btnPedidos = document.getElementById('btn-pedidos');

if (btnPedidos) {
    btnPedidos.addEventListener('click', (e) => {
        e.preventDefault();
        carregarPedidos();
    });
}

function carregarPedidos() {

    headerTitle.textContent = 'Gerenciar Pedidos';
    mainContainer.innerHTML = '';

    fetch('/pedido')
        .then(res => res.json())
        .then(data => {

            let tabelaHTML = `
            <div class="header-produtos">
                <h2>Lista de Pedidos</h2>
                </div>
        
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Email</th>
                        <th>Data</th>
                        <th>Entrega</th>
                        <th>Valor Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
            `;

            data.forEach(pedido => {

                const dataFormatada = new Date(pedido.data_pedido).toLocaleDateString('pt-BR');


                const statusOpcoes = ['PENDENTE', 'PROCESSANDO', 'ENVIADO', 'ENTREGUE', 'CANCELADO'];

                let selectStatus = `<select onchange="atualizarStatusPedido(${pedido.id_pedido}, this.value)"`;

                statusOpcoes.forEach(status => {
                    const selected = pedido.status === status ? 'selected' : '';
                    selectStatus += `<option value="${status}" ${selected}>${status}</option>`;
                });
                selectStatus += `</select>`;

                tabelaHTML += `
                        <tr>
                            <td>#${pedido.id_pedido}</td>
                            <td>${pedido.nome}</td>
                            <td>${pedido.email}</td>
                            <td>${dataFormatada}</td>
                            <td>${pedido.tipo_entrega}</td>
                            <td>R$ ${parseFloat(pedido.valor_total).toFixed(2)}</td>
                            <td>${selectStatus}</td>
                        </tr>
                    `;
            });


            tabelaHTML += `
                </tbody>
            </table>
            `;

            mainContainer.innerHTML = tabelaHTML;
        })
}

function atualizarStatusPedido(idPedido, novoStatus) {

    fetch(`/pedido/${idPedido}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: novoStatus })
    })
        .then(res => {
            if (res.ok) {
                alert(`Status do pedido #${idPedido} atualizado para ${novoStatus}`);
            } else {
                alert('Erro ao atualizar o status. Tente novamente.');
                carregarPedidos();
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro de conexão.');
        });
}

// Função para deletar produto
function deletarProduto(produtoId) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        fetch(`/produto/${produtoId}`, {
            method: 'DELETE'
        }).then(() => {
            alert('Produto deletado com sucesso!');
            carregarProdutos();
        });
    }
}

const dropdownBtns = document.querySelectorAll('.dropbtn');

dropdownBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        this.classList.toggle('active');
        const content = this.nextElementSibling;

        if (content.classList.contains('show')) {
            content.classList.remove('show');
        } else {
            content.classList.add('show');
        }
    });
});

// Dropdown do menu de usuário
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
}