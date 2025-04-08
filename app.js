const express = require('express');
const { sortearTimes, getListaBase } = require('./sorteio'); // Certifique-se de que sorteio.js está sendo importado corretamente

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json()); // Habilita a leitura de JSON no corpo das requisições

// Rota para obter os jogadores base
app.get('/jogadoresBase', (req, res) => {
  res.json(getListaBase()); // Retorna a lista de jogadores do sorteio.js
});

// Rota para fazer o sorteio
app.post('/sortear', (req, res) => {
  const dados = req.body;  // Os jogadores que foram passados do frontend
  const resultado = sortearTimes(dados.jogadores); // Sorteia os times
  res.json(resultado); // Retorna o resultado do sorteio
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
