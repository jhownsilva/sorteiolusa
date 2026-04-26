async function realizarSorteio() {
    const response = await fetch('/api/sortear');
    const dados = await response.json();
    
    renderizarTime(dados.verde, 'campo-verde', 'Verde');
    renderizarTime(dados.branco, 'campo-branco', 'Branco');
}

function renderizarTime(jogadores, containerId, cor) {
    const campo = document.querySelector(`#${containerId} .area-campo`);
    campo.innerHTML = ""; // Limpa o campo

    jogadores.forEach((j, index) => {
        const div = document.createElement('div');
        div.className = `jogador-shirt pos-layout-${index}`; // Classes de posição do CSS
        div.innerHTML = `
            <div class="shirt-icon" style="background: ${cor === 'Verde' ? '#138d43' : '#fff'}; color: ${cor === 'Verde' ? '#fff' : '#000'}">
                ${j.fixo || index + 1}
            </div>
            <div class="nome-player">${j.nome}</div>
        `;
        campo.appendChild(div);
    });
}
