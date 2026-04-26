@app.route('/api/sortear')
def sortear():
    global ULTIMOS_CAPITAES
    ativos = [j for j in carregar_jogadores() if j['status'] == 'ativo']
    
    if len(ativos) < 2:
        return jsonify({"erro": "Poucos jogadores ativos"}), 400

    # 1. Divisão por posição para manter o equilíbrio
    categorias = {}
    for j in ativos:
        pos = j['posicao']
        if pos not in categorias: categorias[pos] = []
        categorias[pos].append(j)

    verde, branco = [], []
    for pos, lista in categorias.items():
        random.shuffle(lista)
        for i, jog in enumerate(lista):
            if i % 2 == 0: verde.append(jog)
            else: branco.append(jog)

    resultado = {}
    data_hoje = datetime.datetime.now().strftime("%d/%m/%Y")

    # 2. Processamento por Time
    for cor, elenco in [("verde", verde), ("branco", branco)]:
        if not elenco: continue
        random.shuffle(elenco)
        
        # Sorteio de Capitães
        candidatos = [j['nome'] for j in elenco if j['nome'] not in ULTIMOS_CAPITAES]
        if len(candidatos) < 2: candidatos = [j['nome'] for j in elenco]
        sorteados = random.sample(candidatos, min(len(candidatos), 2))
        
        cap = sorteados[0] if len(sorteados) >= 1 else "A definir"
        sup = sorteados[1] if len(sorteados) >= 2 else "A definir"
        
        # --- CORREÇÃO DOS NÚMEROS ---
        # Criamos uma cópia das faixas LOCAL para este time, para não zerar no segundo time
        numeros_disponiveis = {k: list(v) for k, v in FAIXAS.items()}
        
        # Primeiro, removemos das opções os números que são FIXOS de alguém do elenco
        numeros_reservados_deste_time = []
        for j in elenco:
            if j['nome'] in NUMEROS_FIXOS:
                num_f = NUMEROS_FIXOS[j['nome']]
                numeros_reservados_deste_time.append(num_f)
                # Remove da lista de sorteáveis daquela posição para ninguém pegar por erro
                if num_f in numeros_disponiveis.get(j['posicao'], []):
                    numeros_disponiveis[j['posicao']].remove(num_f)

        elenco_final = []
        for j in elenco:
            # Tenta pegar o fixo
            num = NUMEROS_FIXOS.get(j['nome'])
            
            # Se não for fixo, sorteia da faixa da posição
            if not num:
                opcoes = numeros_disponiveis.get(j['posicao'], [])
                if opcoes:
                    num = random.choice(opcoes)
                    numeros_disponiveis[j['posicao']].remove(num) # Remove para não repetir no mesmo time
                else:
                    # Se as faixas acabarem (ex: muitos zagueiros), dá um número alto aleatório para não ser 0
                    num = random.randint(30, 99)
            
            elenco_final.append({
                "nome": j['nome'], 
                "posicao": j['posicao'], 
                "numero": num,
                "is_cap": j['nome'] == cap, 
                "is_sup": j['nome'] == sup
            })

        resultado[cor] = {
            "jogadores": elenco_final, 
            "data": data_hoje, # Enviando a data para o JS
            "cap": cap, 
            "sup": sup
        }
    
    if "verde" in resultado and "branco" in resultado:
        ULTIMOS_CAPITAES = [resultado['verde']['cap'], resultado['branco']['cap']]
    
    return jsonify(resultado)
