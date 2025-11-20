require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;
const path = require('path');


// conectar com o front-end
app.use(express.static('public'));

// Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 60 * 60 * 1000
  }
}));

// Configuraçao do banco
require('./src/config/database')

// Rotas

const usuarioRoutes = require('./src/routes/usuarioRoutes');
app.use('/usuario', usuarioRoutes);

const produtoRoutes = require('./src/routes/produtoRoutes');
app.use('/produto', produtoRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor funcionando na porta ${port}`)
})
