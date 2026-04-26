from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import random
import json
import os
import datetime

app = Flask(__name__)
app.secret_key = "lusa_2026_key"

DATA_FILE = 'jogadores.json'
ULTIMOS_CAPITAES = []

# --- CONFIGURAÇÃO DE UNIFORMES ---
NUMEROS_FIXOS = {
    'Guilherme Felix': 19,
    'Jackson': 21,
    'Madruguinha': 20
}

# Definição de prioridade conforme os uniformes disponíveis
NUMEROS_OFICIAIS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
NUMEROS_FICTICIOS = [12, 24, 25, 26, 27, 28, 29]

FAIXAS = {
    "goleiro": [1],
    "zagueiro": [3, 4, 13, 12, 26],
    "lateral": [2, 6, 14, 25, 28],
    "volante": [5, 15, 16, 24, 27],
    "meia": [18, 8, 10, 17],
    "atacante": [11, 7, 27, 29],
    "centroavante": [9, 23, 22]
}

def carregar_jogadores():
    if not os.path.exists(DATA_FILE): return []
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except: return []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = request.form.get('user')
        password = request.form.get('pass')
        if user == 'admin' and password == 'admin':
            session['admin'] = True
            return redirect(url_for('admin'))
    return render_template('login.html')

@app.route('/admin')
def admin():
    if not session.get('admin'):
        return redirect(url_for('login'))
    return render_template('admin.html', jogadores=carregar_jogadores())

@app.route('/api/sortear')
def sortear():
    global ULTIMOS_CAPITAES
    ativos = [j for j in carregar_jogadores() if j['status'] == 'ativo']
    
    if len(ativos) < 2:
        return jsonify({"erro": "Poucos jogadores ativos"}), 400

    # 1. Divisão por posição para equilíbrio técnico
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

    # 2. Processamento por Time (Verde e Branco)
    for cor, elenco in [("verde", verde), ("branco", branco)]:
        if not elenco: continue
        random.shuffle(elenco)
        
        # Sorteio de Capitães (evitando repetir os últimos)
        candidatos = [j['nome'] for j in elenco if j['nome'] not in ULTIMOS_CAPITAES]
        if len(candidatos) < 2: candidatos = [j['nome'] for j in elenco]
        sorteados = random.sample(candidatos, min(len(candidatos), 2))
        
        cap = sorteados[0] if len(sorteados) >= 1 else "A definir"
        sup = sorteados[1] if len(sorteados) >= 2 else "A definir"
        
        # --- LÓGICA DE NUMERAÇÃO HIERÁRQUICA ---
        numeros_disponiveis = {k: list(v) for k, v in FAIXAS.items()}
        proximo_automatico = 30 

        # Passo A: Reservar números FIXOS para não serem sorteados por outros
        for j in elenco:
            num_f = NUMEROS_FIXOS.get(j['nome'])
            if num_f:
                for p in numeros_disponiveis:
                    if num_f in numeros_disponiveis[p]:
                        numeros_disponiveis[p].remove(num_f)

        elenco_final = []
        for j in elenco:
            # 1. Tenta número FIXO
            num = NUMEROS_FIXOS.get(j['nome'])
            
            # 2. Se não for fixo, sorteia da faixa priorizando Oficiais -> Fictícios
            if not num:
                opcoes = numeros_disponiveis.get(j['posicao'], [])
                
                # Filtra o que é oficial e o que é fictício dentro das opções da posição
                oficiais_na_faixa = [n for n in opcoes if n in NUMEROS_OFICIAIS]
                ficticios_na_faixa = [n for n in opcoes if n in NUMEROS_FICTICIOS]

                if oficiais_na_faixa:
                    num = random.choice(oficiais_na_faixa)
                    numeros_disponiveis[j['posicao']].remove(num)
                elif ficticios_na_faixa:
                    num = random.choice(ficticios_na_faixa)
                    numeros_disponiveis[j['posicao']].remove(num)
                else:
                    # 3. Se esgotar tudo, entra número automático (30+)
                    num = proximo_automatico
                    proximo_automatico += 1
            
            elenco_final.append({
                "nome": j['nome'], 
                "posicao": j['posicao'], 
                "numero": num,
                "is_cap": j['nome'] == cap, 
                "is_sup": j['nome'] == sup
            })

        resultado[cor] = {
            "jogadores": elenco_final, 
            "data": data_hoje,
            "cap": cap, 
            "sup": sup
        }
    
    if "verde" in resultado and "branco" in resultado:
        ULTIMOS_CAPITAES = [resultado['verde']['cap'], resultado['branco']['cap']]
    
    return jsonify(resultado)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
