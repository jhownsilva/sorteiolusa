async function realizarSorteio() {
    console.log("Iniciando sorteio...");
    try {
        const response = await fetch('/api/sortear');
        if (!response.ok) throw new Error('Erro na rede ou rota não encontrada');
        
        const dados = await response.json();
        
        // Renderiza os dois times nos seus respectivos campos
        renderizarTime(dados.verde, 'campo-verde', 'Verde');
        renderizarTime(dados.branco, 'campo-branco', 'Branco');
        
        console.log("Sorteio finalizado com sucesso!");
    } catch (error) {
        console.error("Erro no sorteio:", error);
        alert("Erro ao realizar o sorteio! Verifique se o servidor Python está rodando.");
    }
}

function renderizarTime(jogadores, containerId, cor) {
    const campo = document.querySelector(`#${containerId} .area-campo`);
    if (!campo) {
        console.error(`Erro: Container #${containerId} .area-campo não encontrado!`);
        return;
    }
    
    campo.innerHTML = ""; // Limpa o campo anterior

    // Objeto para contar quantos jogadores de cada posição existem no time atual
    const contadorPosicao = {};

    jogadores.forEach((j) => {
        const p = j.posicao.toLowerCase();
        
        // Incrementa o contador para essa posição específica (ex: zagueiro 1, zagueiro 2...)
        if (!contadorPosicao[p]) contadorPosicao[p] = 1;
        else contadorPosicao[p]++;

        const div = document.createElement('div');
        
        // Monta a classe exata que está no seu CSS (ex: pos-zagueiro-1)
        let classePosicao = `pos-${p}-${contadorPosicao[p]}`;
        
        // Regra especial para o goleiro (que no CSS é apenas pos-goleiro)
        if (p === 'goleiro') classePosicao = 'pos-goleiro';

        div.className = `jogador-shirt ${classePosicao}`;

        // Define as cores do uniforme baseado no time
        const bgCor = (cor === 'Verde') ? 'var(--verde-lusa)' : 'var(--branco-lusa)';
        const textoCor = (cor === 'Verde') ? '#fff' : '#000';

        div.innerHTML = `
            <div class="shirt-icon" style="background: ${bgCor}; color: ${textoCor}">
                ${j.fixo || '?'}
            </div>
            <div class="nome-player">${j.nome}</div>
        `;
        
        campo.appendChild(div);
    });
}
