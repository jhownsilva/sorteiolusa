const express = require('express');
const path = require('path');
const { sortearTimes, getListaBase } = require('./sorteio'); // Importe o arquivo de sorteio.js

const app = express();
const port = process.env.PORT || 3000;

// Servir arquivos estáticos da pasta 'public' (onde está o index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para retornar a lista de jogadores
app.get('/jogadores', (req, res) => {
  res.json(getListaBase()); // Retorna a lista de jogadores do sorteio.js
});

// Página inicial (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve a página HTML
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
