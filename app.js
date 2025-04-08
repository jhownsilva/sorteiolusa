const express = require('express');
const path = require('path');
const sorteioTimes = require('./sorteio'); // Importando o código do sorteio
const app = express();

// Endpoint para sortear os times
app.get('/jogadores', (req, res) => {
    const jogadores = req.query.jogadores; // Recebe os jogadores
    const times = sorteioTimes(jogadores);  // Divide os jogadores em times
    res.json(times);
});

// Página inicial (index.html dentro do public)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
    console.log(`Servidor rodando na porta 3000`);
});
