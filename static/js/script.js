async function realizarSorteio() {
    try {
        const response = await fetch('/api/sortear');
        const dados = await response.json();
        
        renderizarLista(dados.verde, 'campo-verde', 'verde');
        renderizarLista(dados.branco, 'campo-branco', 'branco');
    } catch (e) { console.error("Erro no sorteio", e); }
}

function renderizarLista(timeData, containerId, classeCor) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    container.className = `team-column ${classeCor}`;

    const titulo = document.createElement('h2');
    titulo.className = "team-title";
    titulo.innerText = classeCor === 'verde' ? "TIME VERDE" : "TIME BRANCO";
    container.appendChild(titulo);

    const ordens = ["goleiro", "zagueiro", "lateral", "volante", "meia", "atacante", "centroavante"];

    ordens.forEach(posicao => {
        if (timeData[posicao] && timeData[posicao].length > 0) {
            const section = document.createElement('div');
            section.className = "zona-section";
            
            section.innerHTML = `
                <span class="zona-title">${posicao}s</span>
                <div class="player-grid">
                    ${timeData[posicao].map(jStr => {
                        const [num, nome] = jStr.split(" - ");
                        return `
                            <div class="player-card">
                                <div class="player-number">${num}</div>
                                <div class="player-name">${nome}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            container.appendChild(section);
        }
    });
}
