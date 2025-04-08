const express = require('express');
const path = require('path');
const { sortearTimes, getListaBase } = require('./sorteio'); // Importando o código do sorteio

const app = express();
const PORT = process.env.PORT || 3000;

// Serve arquivos estáticos da pasta 'public' onde está o index.html
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para retornar os jogadores base
app.get('/jogadoresBase', (req, res) => {
  res.json(getListaBase());
});

// Endpoint para sorteio dos times
app.post('/sortear', express.json(), (req, res) => {
  const { jogadores } = req.body;
  const times = sortearTimes(jogadores, 2); // 2 times para o sorteio
  res.json(times);
});

// Página inicial (index.html dentro de public)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
