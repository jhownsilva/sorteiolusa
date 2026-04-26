async function realizarSorteio() {
    try {
        const response = await fetch('/api/sortear');
        const dados = await response.json();
        renderizarTime(dados.verde, 'campo-verde', 'Verde');
        renderizarTime(dados.branco, 'campo-branco', 'Branco');
    } catch (e) { console.error(e); }
}

function renderizarTime(jogadores, containerId, cor) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<h2 class="team-title">TIME ${cor.toUpperCase()}</h2>`;
    
    const zonas = ["goleiro", "zagueiro", "lateral", "volante", "meia", "atacante", "centroavante"];
    
    zonas.forEach(pos => {
        const filtrados = jogadores.filter(j => j.posicao === pos);
        if (filtrados.length > 0) {
            const section = document.createElement('div');
            section.className = "zona-section";
            section.innerHTML = `<span class="zona-title">${pos.toUpperCase()}S</span>`;
            
            const grid = document.createElement('div');
            grid.className = "player-grid";
            
            filtrados.forEach(j => {
                const card = document.createElement('div');
                card.className = `player-card ${cor.toLowerCase()}`;
                card.innerHTML = `
                    <div class="player-number">${j.fixo || '?'}</div>
                    <div class="player-name">${j.nome}</div>
                `;
                grid.appendChild(card);
            });
            section.appendChild(grid);
            container.appendChild(section);
        }
    });
}
