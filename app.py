from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import random, json, os, datetime

app = Flask(__name__)
app.secret_key = "lusa_2026_key"

DATA_FILE = 'jogadores.json'
ULTIMOS_CAPITAES = []

FIXOS = {'Guilherme Felix': 19, 'Jackson': 21, 'Madruguinha': 20}
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
    with open(DATA_FILE, 'r', encoding='utf-8') as f: return json.load(f)

@app.route('/api/sortear')
def sortear():
    global ULTIMOS_CAPITAES
    ativos = [j for j in carregar_jogadores() if j['status'] == 'ativo']
    
    # Organiza por posição para dividir IGUALMENTE
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

    for cor, elenco in [("verde", verde), ("branco", branco)]:
        random.shuffle(elenco)
        # Sorteio de Capitães sem repetir
        candidatos = [j['nome'] for j in elenco if j['nome'] not in ULTIMOS_CAPITAES]
        if len(candidatos) < 2: candidatos = [j['nome'] for j in elenco]
        sorteados = random.sample(candidatos, 2)
        
        numeros_usados = []
        elenco_final = []
        
        # Atribuição de números rigorosa
        for j in elenco:
            num = FIXOS.get(j['nome'])
            if not num:
                opcoes = [n for n in FAIXAS.get(j['posicao'], [0]) if n not in numeros_usados]
                num = random.choice(opcoes) if opcoes else 0
            
            numeros_usados.append(num)
            elenco_final.append({
                "nome": j['nome'], "posicao": j['posicao'], "numero": num,
                "is_cap": j['nome'] == sorteados[0], "is_sup": j['nome'] == sorteados[1]
            })

        resultado[cor] = {
            "jogadores": elenco_final, "data": data_hoje,
            "cap": sorteados[0], "sup": sorteados[1]
        }
    
    ULTIMOS_CAPITAES = [resultado['verde']['cap'], resultado['branco']['cap']]
    return jsonify(resultado)

@app.route('/')
def index(): return render_template('index.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))
