require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;

// Middlewarepara express para realizar se
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  res.send('Servidor Rodando!')
});

app.listen(port, () => {
  console.log(`Servidor funcionando na porta ${port}`)
})
