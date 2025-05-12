const jogadores = [
  { nome: "Guilherme", posicao: "atacante", ranking: 5 },
  { nome: "Carlão", posicao: "atacante", ranking: 4 },
  { nome: "Félix Gustavinho", posicao: "atacante", ranking: 3 },
  { nome: "Anézio", posicao: "atacante", ranking: 2 },
  { nome: "Luis", posicao: "atacante", ranking: 3 },
  { nome: "Madruguinha", posicao: "atacante", ranking: 4 },
  { nome: "Fabio", posicao: "atacante", ranking: 1 },
  { nome: "Pastor", posicao: "centroavante", ranking: 3 },
  { nome: "Diego", posicao: "centroavante", ranking: 4 },
  { nome: "Scarpa", posicao: "centroavante", ranking: 2 },
  { nome: "Bruno Zanin", posicao: "centroavante", ranking: 5 },
  { nome: "Jorel", posicao: "lateral", ranking: 3 },
  { nome: "Jhimmy", posicao: "lateral", ranking: 2 },
  { nome: "Gustavo", posicao: "lateral", ranking: 5 },
  { nome: "Mikael", posicao: "lateral", ranking: 3 },
  { nome: "Aelton", posicao: "lateral", ranking: 1 },
  { nome: "Henrique", posicao: "lateral", ranking: 2 },
  { nome: "Kaio", posicao: "lateral", ranking: 1 },
  { nome: "Jaques", posicao: "meia", ranking: 4 },
  { nome: "Ventura", posicao: "meia", ranking: 3 },
  { nome: "Davi", posicao: "meia", ranking: 4 },
  { nome: "Cae", posicao: "meia", ranking: 2 },
  { nome: "Sakai", posicao: "meia", ranking: 1 },
  { nome: "Mitter", posicao: "meia", ranking: 2 },
  { nome: "Delson", posicao: "volante", ranking: 5 },
  { nome: "Davizinho", posicao: "volante", ranking: 4 },
  { nome: "Góis", posicao: "volante", ranking: 3 },
  { nome: "Gah", posicao: "volante", ranking: 2 },
  { nome: "Rafinha", posicao: "volante", ranking: 3 },
  { nome: "Fillipi", posicao: "volante", ranking: 2 },
  { nome: "Armeiro", posicao: "volante", ranking: 1 },
  { nome: "Jackson", posicao: "volante", ranking: 3 },
  { nome: "Willian", posicao: "zagueiro", ranking: 4 },
  { nome: "Dé", posicao: "zagueiro", ranking: 3 },
  { nome: "Wesley", posicao: "zagueiro", ranking: 5 },
  { nome: "Bruno Fernandes", posicao: "zagueiro", ranking: 2 },
  { nome: "Guilherme Felix", posicao: "zagueiro", ranking: 3 },
  { nome: "Romario", posicao: "zagueiro", ranking: 1 },
  { nome: "Fagner", posicao: "zagueiro", ranking: 4 },
  { nome: "Luis", posicao: "zagueiro", ranking: 2 },
  { nome: "Thiago", posicao: "goleiro", ranking: 4 },
  { nome: "Filipe", posicao: "goleiro", ranking: 5 }
];

// Mapeamento de números fixos por jogador (1 atacante, 1 zagueiro, 1 volante)
const jogadoresComNumeroFixo = {
  "Madruguinha": 20, // Atacante fixo
  "Guilherme Felix": 19, // Zagueiro fixo
  "Jackson": 21  // Volante fixo
};

// 🎯 Números por zona (reutilizável por time)
const faixaNumeros = {
  goleiro: [1, 2], // Goleiro, fixo já atribuído
  zagueiro: [3, 5, 13], // Excluindo 19
  lateral: [2, 4, 16],
  volante: [6, 15, 16], // Excluindo 21
  meia: [7, 8, 10, 22],
  atacante: [11, 17, 18, 14], // Excluindo 20
  centroavante: [9, 23]
};

function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

function sortearTimes(jogadores, numTimes = 2) {
  const porPosicao = {};
  jogadores.forEach(jogador => {
    if (!porPosicao[jogador.posicao]) porPosicao[jogador.posicao] = [];
    porPosicao[jogador.posicao].push(jogador);
  });

  const times = Array.from({ length: numTimes }, () => ({}));

  for (let posicao in porPosicao) {
    let lista = [...porPosicao[posicao]];
    lista = embaralhar(lista.sort((a, b) => b.ranking - a.ranking));

    const total = lista.length;
    const base = Math.floor(total / numTimes);
    let extras = total % numTimes;

    const ordemExtras = embaralhar([...Array(numTimes).keys()]);
    const limites = Array(numTimes).fill(base);
    for (let i = 0; i < extras; i++) {
      limites[ordemExtras[i]] += 1;
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

  // ✅ Aplicar numeração personalizada individual para cada time (fixo para alguns jogadores)
  const resultado = {};

  times.forEach((time, i) => {
    const timeFinal = {};

    for (let posicao in time) {
      // Copia os números permitidos dessa zona para esse time
      const numerosDisponiveis = [...(faixaNumeros[posicao.toLowerCase()] || [])];
      const jogadoresComNumero = time[posicao].map(jogador => {
        let numero;
        // Se o jogador tem número fixo, usa o número fixo
        if (jogadoresComNumeroFixo[jogador.nome]) {
          numero = jogadoresComNumeroFixo[jogador.nome];
        } else {
          numero = numerosDisponiveis.shift(); // Caso contrário, atribui um número disponível
        }
        return `${numero ?? '#'} - ${jogador.nome}`;
      });

      timeFinal[posicao] = jogadoresComNumero;
    }

    resultado[`time${i + 1}`] = timeFinal;
  });

  return resultado;
}

console.log(sortearTimes(jogadores));
