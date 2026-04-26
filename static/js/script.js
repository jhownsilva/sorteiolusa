async function realizarSorteio() {
    console.log("Iniciando sorteio...");
    try {
        const res = await fetch('/api/sortear');
        if (!res.ok) throw new Error("Erro na API");
        const dados = await res.json();
        
        const box = document.getElementById('conteudo-sorteio');
        if (!box) {
            console.error("ERRO: Div 'conteudo-sorteio' não encontrada no HTML!");
            return;
        }
        
        // --- ALTERAÇÃO AQUI: Cabeçalho com Logo e Data ---
        box.innerHTML = `
            <div style="text-align:center; margin-bottom: 20px; padding: 10px; border-bottom: 2px solid #ddd;">
                <img src="/static/img/escudo.png" style="width: 80px; height: auto; margin-bottom: 10px;">
                <div style="font-size: 22px; font-weight: 900; color: #138d43; text-transform: uppercase;">Lusa F.C.</div>
                <div style="font-size: 14px; font-weight: bold; color: #666;">Data: ${dados.verde.data}</div>
            </div>
        `; 

        renderLista(dados.verde, box, 'verde');
        renderLista(dados.branco, box, 'branco');

        document.getElementById('btnDownload').style.display = 'inline-block';
    } catch (e) {
        console.error(e);
        alert("Erro ao realizar o sorteio. Verifique se há jogadores ativos no Admin.");
    }
}

function renderLista(time, mainBox, cor) {
    if (!time) return;
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
                    <div class="player-row">
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
    // Adicionei scale 3 para a imagem ficar ainda mais nítida no WhatsApp
    html2canvas(area, { 
        scale: 3, 
        backgroundColor: "#f0f2f5",
        useCORS: true // Ajuda a carregar o logo corretamente se estiver em pasta estática
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `sorteio-lusa-${new Date().toLocaleDateString().replace(/\//g, '-')}.jpg`;
        link.href = canvas.toDataURL("image/jpeg", 0.9);
        link.click();
    });
}
