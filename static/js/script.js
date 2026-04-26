async function realizarSorteio() {
    try {
        const response = await fetch('/api/sortear');
        const dados = await response.json();
        
        renderizarTime(dados.verde, 'campo-verde');
        renderizarTime(dados.branco, 'campo-branco');
    } catch (error) {
        console.error("Erro:", error);
    }
}

function renderizarTime(jogadores, containerId) {
    const campo = document.querySelector(`#${containerId} .area-campo`);
    campo.innerHTML = ""; 

    const contador = {};

    jogadores.forEach((j) => {
        const pos = j.posicao.toLowerCase();
        if (!contador[pos]) contador[pos] = 1;
        else contador[pos]++;

        const div = document.createElement('div');
        
        // Se for goleiro usa a classe fixa, se não usa a posição + número (ex: zagueiro-1)
        let classePos = (pos === 'goleiro') ? 'pos-goleiro' : `pos-${pos}-${contador[pos]}`;
        
        div.className = `jogador-shirt ${classePos}`;
        div.innerHTML = `
            <div class="shirt-icon">${j.fixo || '?'}</div>
            <div class="nome-player">${j.nome}</div>
        `;
        campo.appendChild(div);
    });
}
