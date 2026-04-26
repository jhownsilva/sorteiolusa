function baixarImagem() {
    console.log("Iniciando captura da imagem...");
    const area = document.getElementById('exportar-area');
    
    // Verificação de segurança
    if (!area) {
        alert("Erro: Área de exportação não encontrada!");
        return;
    }

    html2canvas(area, { 
        scale: 2, // Melhora a resolução para o WhatsApp
        backgroundColor: "#f0f2f5", // Mantém o fundo limpo
        logging: true, // Ajuda a identificar erros no F12
        useCORS: true  // Essencial se você estiver usando imagens externas (como o escudo)
    }).then(canvas => {
        try {
            // Converte para JPG
            const imgData = canvas.toDataURL("image/jpeg", 0.9);
            
            // Cria um elemento de link temporário "invisível"
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = imgData;
            link.download = 'escalacao-lusa-fc.jpg';
            
            // Adiciona ao corpo da página, clica e remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log("Download iniciado com sucesso!");
        } catch (err) {
            console.error("Erro ao gerar link de download:", err);
            alert("Erro ao baixar a imagem. Tente tirar um print.");
        }
    }).catch(error => {
        console.error("Erro no html2canvas:", error);
        alert("Falha técnica ao gerar a imagem.");
    });
}

