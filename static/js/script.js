async function realizarSorteio() {
    const res = await fetch('/api/sortear');
    const dados = await res.json();
    const area = document.getElementById('exportar-area');
    
    area.innerHTML = `
        <img src="/static/img/escudo.png" class="escudo-lusa">
        <div class="data-sorteio">SORTEIO: ${dados.verde.data}</div>
        <div id="verde-lista"></div>
        <div id="branco-lista"></div>
    `;

    renderLista(dados.verde, 'verde-lista', 'verde');
    renderLista(dados.branco, 'branco-lista', 'branco');
    document.getElementById('btnDownload').style.display = 'block';
}

function renderLista(time, id, cor) {
    const div = document.getElementById(id);
    div.className = `team-section ${cor}`;
    div.innerHTML = `
        <div class="team-header ${cor}-header">TIME ${cor.toUpperCase()}</div>
        <div class="cap-box">
            <b>🌟 CAPITÃO:</b> ${time.cap} <br>
            <b>🎖️ SUPLENTE:</b> ${time.sup}
        </div>
    `;

    const ordens = ["goleiro", "zagueiro", "lateral", "volante", "meia", "atacante", "centroavante"];
    ordens.forEach(pos => {
        const jogs = time.jogadores.filter(j => j.posicao === pos);
        if (jogs.length > 0) {
            div.innerHTML += `<div class="pos-label">${pos}s</div>`;
            jogs.forEach(j => {
                const capMark = j.is_cap ? ' (C)' : (j.is_sup ? ' (S)' : '');
                div.innerHTML += `
                    <div class="player-row ${j.is_cap ? 'is-cap' : ''}">
                        <div class="player-num">${j.numero}</div>
                        <div class="player-info">${j.nome}${capMark}</div>
                    </div>
                `;
            });
        }
    });
}

