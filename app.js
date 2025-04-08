const express = require('express');
const app = express();
const sorteio = require('./sorteio');

app.use(express.static('public'));
app.use(express.json());

app.post('/sortear', (req, res) => {
    const jogadores = req.body.jogadores;
    const resultado = sorteio.sortearTimes(jogadores);
    res.json(resultado);
});

app.get('/jogadoresBase', (req, res) => {
    const jogadoresPadrao = sorteio.getListaBase();
    res.json(jogadoresPadrao);
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
