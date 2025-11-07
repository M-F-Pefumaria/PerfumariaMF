const express = require('express')
const app = express()
const port = 3000

require('./src/config/database')

app.get('/', (req, res) => {
  res.send('Servidor Rodando!')
});

app.listen(port, () => {
  console.log(`Servidor funcionando na porta ${port}`)
})
