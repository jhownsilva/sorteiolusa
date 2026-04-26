async function realizarSorteio() {
    const response = await fetch('/api/sortear');
    const dados = await response.json();
    
    renderizarTime(dados.verde, 'campo-verde', 'verde');
    renderizarTime(dados.branco, 'campo-branco', 'branco');
    document.getElementById('btnDownload').style.display = 'block';
}

function renderizarTime(timeData, containerId, cor) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <h2 style="text-align:center; color:${cor=='verde'?'#138d43':'#333'}">TIME ${cor.toUpperCase()}</h2>
        <div class="capitaes-box">
            <div><span class="cap-tag">🌟 CAPITÃO:</span> ${timeData.cap_principal}</div>
            <div><span class="cap-tag">🎖️ SUPLENTE:</span> ${timeData.cap_suplente}</div>
        </div>
    `;
    container.className = `team-column ${cor}`;

    const zonas = ["goleiro", "zagueiro", "lateral", "volante", "meia", "atacante", "centroavante"];
    
    zonas.forEach(pos => {
        const filtrados = timeData.jogadores.filter(j => j.posicao === pos);
        if (filtrados.length > 0) {
            container.innerHTML += `<div class="zona-title">${pos}s</div>`;
            filtrados.forEach(j => {
                const capClass = j.is_capitao ? 'is-capitao' : '';
                const capIcon = j.is_capitao ? ' (C)' : (j.is_suplente ? ' (S)' : '');
                
                container.innerHTML += `
                    <div class="player-card ${capClass}">
                        <div class="player-number">${j.numero}</div>
                        <div class="player-name">${j.nome}${capIcon}</div>
                    </div>
                `;
            });
        }
    });
}
