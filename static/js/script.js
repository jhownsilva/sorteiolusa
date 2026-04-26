async function realizarSorteio() {
    try {
        const response = await fetch('/api/sortear');
        const dados = await response.json();
        renderizarTime(dados.verde, 'campo-verde', 'Verde');
        renderizarTime(dados.branco, 'campo-branco', 'Branco');
        document.getElementById('btnDownload').style.display = 'inline-block';
    } catch (e) { console.error(e); }
}

function renderizarTime(jogadores, containerId, cor) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<h2 class="team-title">TIME ${cor.toUpperCase()}</h2>`;
    container.className = `team-column ${cor.toLowerCase()}`;

    const zonas = ["goleiro", "zagueiro", "lateral", "volante", "meia", "atacante", "centroavante"];
    zonas.forEach(pos => {
        const filtrados = jogadores.filter(j => j.posicao === pos);
        if (filtrados.length > 0) {
            const section = document.createElement('div');
            section.className = "zona-section";
            section.innerHTML = `<span class="zona-title">${pos}s</span><div class="player-grid"></div>`;
            const grid = section.querySelector('.player-grid');
            
            filtrados.forEach(j => {
                grid.innerHTML += `
                    <div class="player-card">
                        <div class="player-number">${j.fixo || '?'}</div>
                        <div class="player-name">${j.nome}</div>
                    </div>`;
            });
            container.appendChild(section);
        }
    });
}

function baixarImagem() {
    const area = document.getElementById('exportar-area');
    html2canvas(area, { backgroundColor: "#0f0f0f", scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'sorteio-lusa.jpg';
        link.href = canvas.toDataURL("image/jpeg", 0.9);
        link.click();
    });
}
