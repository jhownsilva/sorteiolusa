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
  { nome: "Giovanni Rocha", posicao: "lateral", ranking: 1 },
  { nome: "Breno", posicao: "lateral", ranking: 1 },
  { nome: "Gustavo", posicao: "lateral", ranking: 1 },
  { nome: "Davizinho", posicao: "volante", ranking: 1 },
  { nome: "Thiago Gkay", posicao: "goleiro", ranking: 1 }, // Thiago como Goleiro
  { nome: "Thiago", posicao: "volante", ranking: 1 }, // Thiago como Volante (nome diferente)
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
  lateral: [2, 6, 14, 25, 28],
  volante: [5, 15, 16, 24, 27],
  meia: [18, 8, 10, 17],
  atacante: [11, 7, 27, 29],
  centroavante: [9, 23, 22],
};

function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

function sortearTimes(listaJogadores, numTimes = 2) {
  const porPosicao = {};
  listaJogadores.forEach(j => {
    const p = j.posicao.toLowerCase();
    if (!porPosicao[p]) porPosicao[p] = [];
    porPosicao[p].push(j);
  });

  const times = Array.from({ length: numTimes }, () => ({}));

  for (const pos in porPosicao) {
    const lista = embaralhar([...porPosicao[pos]]);
    lista.forEach((jogador, index) => {
      const timeAlvo = index % numTimes;
      if (!times[timeAlvo][pos]) times[timeAlvo][pos] = [];
      times[timeAlvo][pos].push(jogador);
    });
  }

  const resultado = {};
  let numExtra = 30;

  times.forEach((time, i) => {
    const timeFinal = {};
    for (const p in time) {
      let disponiveis = [...(faixaNumeros[p] || [])];
      // Limpa números já usados como fixos no time
      time[p].forEach(j => {
        if (jogadoresComNumeroFixo[j.nome]) {
          disponiveis = disponiveis.filter(n => n !== jogadoresComNumeroFixo[j.nome]);
        }
      });

      timeFinal[p] = time[p].map(j => {
        let n = jogadoresComNumeroFixo[j.nome] || disponiveis.shift() || numExtra++;
        return `${n} - ${j.nome}`;
      });
    }
    resultado[`Time ${i + 1}`] = timeFinal;
  });
  return resultado;
}

function getListaBase() {
  return jogadores;
}
