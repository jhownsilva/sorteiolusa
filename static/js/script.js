async function realizarSorteio() {
    console.log("Iniciando sorteio..."); // Para você testar no F12
    try {
        const response = await fetch('/api/sortear');
        if (!response.ok) throw new Error('Erro na rede');
        
        const dados = await response.json();
        
        // Limpa e renderiza
        renderizarTime(dados.verde, 'campo-verde', 'Verde');
        renderizarTime(dados.branco, 'campo-branco', 'Branco');
    } catch (error) {
        console.error("Erro no sorteio:", error);
        alert("Erro ao sortear! Verifique o console.");
    }
}

function renderizarTime(jogadores, containerId, cor) {
    const campo = document.querySelector(`#${containerId} .area-campo`);
    campo.innerHTML = ""; 

    jogadores.forEach((j, index) => {
        const div = document.createElement('div');
        // Usando as classes de posição do CSS (pos-goleiro, pos-zagueiro-1, etc)
        div.className = `jogador-shirt pos-${j.posicao}-${index + 1}`; 
        
        // Se a posição for goleiro, forçamos a classe correta
        if(j.posicao === 'goleiro') div.className = `jogador-shirt pos-goleiro`;

        div.innerHTML = `
            <div class="shirt-icon">${j.fixo || (index + 1)}</div>
            <div class="nome-player">${j.nome}</div>
        `;
        campo.appendChild(div);
    });
}
