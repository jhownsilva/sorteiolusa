async function realizarSorteio() {
    const response = await fetch('/api/sortear');
    const dados = await response.json();
    
    renderizarTime(dados.verde, 'campo-verde', 'Verde');
    renderizarTime(dados.branco, 'campo-branco', 'Branco');
}

function renderizarTime(jogadores, containerId, cor) {
    const campo = document.querySelector(`#${containerId} .area-campo`);
    campo.innerHTML = ""; 

    // Objeto para contar quantos jogadores de cada posição já foram colocados
    // para evitar que dois zagueiros fiquem no mesmo lugar
    const contadorPosicao = {};

    jogadores.forEach((j) => {
        const posKey = j.posicao.toLowerCase();
        if (!contadorPosicao[posKey]) contadorPosicao[posKey] = 1;
        else contadorPosicao[posKey]++;

        const div = document.createElement('div');
        
        // Atribui a classe de posição (ex: pos-zagueiro-1, pos-zagueiro-2)
        const classePosicao = `pos-${posKey}-${contadorPosicao[posKey]}`;
        
        // Caso especial para Goleiro que geralmente é só um
        const classeFinal = posKey === 'goleiro' ? 'pos-goleiro' : classePosicao;

        div.className = `jogador-shirt ${classeFinal}`;
        
        div.innerHTML = `
            <div class="shirt-icon" style="background: ${cor === 'Verde' ? '#138d43' : '#fff'}; color: ${cor === 'Verde' ? '#fff' : '#000'}">
                ${j.fixo || '?'}
            </div>
            <div class="nome-player">${j.nome}</div>
        `;
        campo.appendChild(div);
    });
}
