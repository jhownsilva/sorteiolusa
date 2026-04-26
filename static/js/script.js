async function realizarSorteio() {
    try {
        const res = await fetch('/api/sortear');
        const dados = await res.json();
        const box = document.getElementById('conteudo-sorteio');
        
        // Cabeçalho com Logo e Data
        box.innerHTML = `
            <div style="text-align:center; margin-bottom: 20px; padding: 10px; border-bottom: 2px solid #ddd;">
                <img src="/static/img/escudo.png" style="width: 80px; height: auto; margin-bottom: 10px;">
                <div style="font-size: 22px; font-weight: 900; color: #138d43; text-transform: uppercase;">Lusa F.C.</div>
                <div style="font-size: 14px; font-weight: bold; color: #666;">Data: ${dados.verde.data}</div>
            </div>
        `; 

        // Renderiza os dois times
        renderLista(dados.verde, box, 'verde');
        renderLista(dados.branco, box, 'branco');

        // NOVO: Quadro de Desfalques (DM e Suspensos)
        if (dados.desfalques && dados.desfalques.length > 0) {
            const outBox = document.createElement('div');
            outBox.className = 'desfalques-box';
            
            let htmlDesfalques = '<div class="desfalques-title">🚫 INDISPONÍVEIS (DM/SUSPENSOS)</div>';
            
            dados.desfalques.forEach(d => {
                const icon = d.status === 'dm' ? '🏥' : '🟥';
                htmlDesfalques += `
                    <div class="desfalque-item">
                        <span>${icon} ${d.nome}</span>
                        <span style="font-size: 10px; opacity: 0.7;">${d.status.toUpperCase()}</span>
                    </div>`;
            });
            
            outBox.innerHTML = htmlDesfalques;
            box.appendChild(outBox);
        }

        document.getElementById('btnDownload').style.display = 'inline-block';
    } catch (e) {
        console.error(e);
        alert("Erro ao realizar o sorteio.");
    }
}

function renderLista(time, mainBox, cor) {
    if (!time || !time.jogadores) return;
    
    const section = document.createElement('div');
    section.className = `team-section ${cor}`;
    
    section.innerHTML = `
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
            section.innerHTML += `<div class="pos-label">${pos}s</div>`;
            jogs.forEach(j => {
                const mark = j.is_cap ? ' (C)' : (j.is_sup ? ' (S)' : '');
                section.innerHTML += `
                    <div class="player-row ${j.is_cap ? 'is-cap' : ''}">
                        <div class="player-num">${j.numero}</div>
                        <div class="player-info">${j.nome}${mark}</div>
                    </div>`;
            });
        }
    });
    mainBox.appendChild(section);
}

function baixarImagem() {
    const area = document.getElementById('exportar-area');
    html2canvas(area, { 
        scale: 3, 
        backgroundColor: "#f0f2f5", 
        useCORS: true 
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `sorteio-lusa-${new Date().toLocaleDateString().replace(/\//g, '-')}.jpg`;
        link.href = canvas.toDataURL("image/jpeg", 0.9);
        link.click();
    });
}
