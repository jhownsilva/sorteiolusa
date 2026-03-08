const jogadores = [
  { nome: "Carlão", posicao: "atacante", ranking: 1},
  { nome: "Gustavinho", posicao: "atacante", ranking: 1 },
  { nome: "Anézio", posicao: "atacante", ranking: 1 },
  { nome: "Luis Henrique", posicao: "atacante", ranking: 1 },
  { nome: "Guilherme", posicao: "atacante", ranking: 1 },
  { nome: "Fabio", posicao: "atacante", ranking: 1 },
  { nome: "Pastor", posicao: "centroavante", ranking: 1 },
  { nome: "Diego", posicao: "centroavante", ranking: 1 },
  { nome: "Bruno Zanin", posicao: "centroavante", ranking: 1 },
  { nome: "Caio", posicao: "atacante", ranking: 1 },
  { nome: "Jhimmy", posicao: "lateral", ranking: 1 },
  { nome: "Breno", posicao: "lateral", ranking: 1 },
  { nome: "Gustavo", posicao: "lateral", ranking: 1 },
  { nome: "Mikael", posicao: "lateral", ranking: 1 },
  { nome: "Lucas", posicao: "centroavante", ranking: 1 },
  { nome: "Madruguinha", posicao: "centroavante", ranking: 1 },
  { nome: "Edberto", posicao: "centroavante", ranking: 1 },
  { nome: "Henrique", posicao: "lateral", ranking: 1 },
  { nome: "Sakai", posicao: "meia", ranking: 1 },
  { nome: "Ventura", posicao: "meia", ranking: 1 },
  { nome: "Cae", posicao: "meia", ranking: 1 },
  { nome: "Le", posicao: "meia", ranking: 1 },
  { nome: "Gah", posicao: "meia", ranking: 1 },
  { nome: "Renan", posicao: "meia", ranking: 1 },
  { nome: "Erick Samurai", posicao: "meia", ranking: 1 },
  { nome: "Jackson", posicao: "meia", ranking: 1 },
  { nome: "Wesley", posicao: "volante", ranking: 1 },
  { nome: "Nathan Eneas", posicao: "volante", ranking: 1 },
  { nome: "Madson", posicao: "lateral", ranking: 1 },
  { nome: "Kaique", posicao: "volante", ranking: 1 },
  { nome: "Rafinha", posicao: "volante", ranking: 1 },
  { nome: "Fillipi", posicao: "volante", ranking: 1 },
  { nome: "Armeiro", posicao: "volante", ranking: 1 },
  { nome: "André", posicao: "lateral", ranking: 1 },
  { nome: "Willian", posicao: "volante", ranking: 1 },
  { nome: "Dé", posicao: "zagueiro", ranking: 1 },
  { nome: "Delson", posicao: "volante", ranking: 1 },
  { nome: "Bruno Fernandes", posicao: "zagueiro", ranking: 1 },
  { nome: "Guilherme Felix", posicao: "zagueiro", ranking: 1 },
  { nome: "Fagner", posicao: "zagueiro", ranking: 1 },
  { nome: "Jorel", posicao: "zagueiro", ranking: 1 },
  { nome: "Romario", posicao: "zagueiro", ranking: 1 },
  { nome: "Thiago", posicao: "goleiro", ranking: 1 },
  { nome: "Felipe", posicao: "goleiro", ranking: 1 },
];

const jogadoresComNumeroFixo = {
  'Guilherme Felix': 19,
  'Jackson': 21,
  'Madruguinha': 20,
};

const faixaNumeros = {
  goleiro: [1],
  zagueiro: [3, 4, 13, 12, 26],
  lateral: [2, 6, 14, 25],
  volante: [5, 15, 16, 24],
  meia: [18, 8, 10, 17],
  atacante: [11, 7, 27, 29],
  centroavante: [9, 23, 22],
};

function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

function sortearTimes(jogadores, numTimes = 2) {
  const porPosicao = {};
  jogadores.forEach(jogador => {
    const { posicao } = jogador;
    if (!porPosicao[posicao]) {
      porPosicao[posicao] = [];
    }
    porPosicao[posicao].push(jogador);
  });

  const times = Array.from({ length: numTimes }, () => ({}));

  for (const posicao in porPosicao) {
    const lista = embaralhar(porPosicao[posicao].sort((a, b) => b.ranking - a.ranking));

    const total = lista.length;
    const base = Math.floor(total / numTimes);
    let extras = total % numTimes;

    const ordemExtras = embaralhar([...Array(numTimes).keys()]);
    const limites = Array(numTimes).fill(base);
    for (let i = 0; i < extras; i++) {
      limites[ordemExtras[i]]++;
    }

    const distribuicao = Array.from({ length: numTimes }, () => []);
    let jogadorIndex = 0;

    for (let timeIndex = 0; timeIndex < numTimes; timeIndex++) {
      while (distribuicao[timeIndex].length < limites[timeIndex]) {
        distribuicao[timeIndex].push(lista[jogadorIndex]);
        jogadorIndex++;
      }
    }

    distribuicao.forEach((grupo, i) => {
      times[i][posicao] = grupo;
    });
  }

  const resultado = {};

  times.forEach((time, i) => {
    const timeFinal = {};

    for (const posicao in time) {
      const numerosDisponiveis = [...(faixaNumeros[posicao.toLowerCase()] || [])];
      const jogadoresComNumero = time[posicao].map(jogador => {
        const { nome } = jogador;
        let numero;
        if (jogadoresComNumeroFixo[nome]) {
          numero = jogadoresComNumeroFixo[nome];
        } else {
          numero = numerosDisponiveis.shift();
        }
        return `${numero ?? '#'} - ${nome}`;
      });
      timeFinal[posicao] = jogadoresComNumero;
    }
    resultado[`time${i + 1}`] = timeFinal;
  });

  return resultado;
}

function getListaBase() {
  return jogadores;
}

module.exports = { sortearTimes, getListaBase };
