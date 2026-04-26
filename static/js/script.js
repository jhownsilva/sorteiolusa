function renderizarTime(jogadores, containerId, cor) {
    const campo = document.querySelector(`#${containerId} .area-campo`);
    campo.innerHTML = "";
    
    // Organizar jogadores por posição para distribuir no campo
    const posicoesContagem = {};

    jogadores.forEach((j, index) => {
        const p = j.posicao.toLowerCase();
        posicoesContagem[p] = (posicoesContagem[p] || 0) + 1;

        const div = document.createElement('div');
        // Define a classe de posição (ex: pos-zagueiro-1)
        div.className = `jogador-shirt pos-${p}-${posicoesContagem[p]}`;
        
        // CORREÇÃO DOS NÚMEROS:
        // Se não tiver número fixo, ele usa um número baseado na posição
        const numeroMostrado = j.fixo || (index + 1);

        div.innerHTML = `
            <div class="shirt-icon" style="background: ${cor === 'Verde' ? '#138d43' : '#eee'}; color: ${cor === 'Verde' ? '#fff' : '#333'}">
                ${numeroMostrado}
            </div>
            <div class="nome-player">${j.nome}</div>
        `;
        campo.appendChild(div);
    });
}
