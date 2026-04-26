async function realizarSorteio() {
    const btn = document.querySelector('button');
    btn.textContent = "SORTEANDO...";
    
    try {
        const response = await fetch('/api/sortear');
        const dados = await response.json();
        
        renderizarTime(dados.verde, 'campo-verde', 'Verde');
        renderizarTime(dados.branco, 'campo-branco', 'Branco');
        
        btn.textContent = "🎲 GERAR ESCALAÇÃO";
    } catch (err) {
        alert("Erro ao realizar sorteio. Verifique o servidor.");
        btn.textContent = "🎲 GERAR ESCALAÇÃO";
    }
}

function renderizarTime(jogadores, containerId, cor) {
    const campo = document.querySelector(`#${containerId} .area-campo`);
    if (!campo) return;
    
    campo.innerHTML = ""; 
    const contadorPosicao = {};

    jogadores.forEach((j) => {
        const posKey = j.posicao.toLowerCase();
        if (!contadorPosicao[posKey]) contadorPosicao[posKey] = 1;
        else contadorPosicao[posKey]++;

        const div = document.createElement('div');
        const classePosicao = `pos-${posKey}-${contadorPosicao[posKey]}`;
        const classeFinal = posKey === 'goleiro' ? 'pos-goleiro' : classePosicao;

        div.className = `jogador-shirt ${classeFinal}`;
        
        const bgUniforme = cor === 'Verde' ? 'var(--verde-lusa)' : 'var(--branco-lusa)';
        const corTexto = cor === 'Verde' ? '#fff' : '#000';

        div.innerHTML = `
            <div class="shirt-icon" style="background: ${bgUniforme}; color: ${corTexto}">
                ${j.fixo || '?'}
            </div>
            <div class="nome-player">${j.nome}</div>
        `;
        campo.appendChild(div);
    });
}
