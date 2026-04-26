from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import random
import json
import os

app = Flask(__name__)
app.secret_key = "lusa_2026_key"

DATA_FILE = 'jogadores.json'
ULTIMOS_CAPITAES = [] # Memória temporária para não repetir capitães

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
    jogadores = [j for j in carregar_jogadores() if j['status'] == 'ativo']
    
    # Separar por time de forma equilibrada
    random.shuffle(jogadores)
    meio = len(jogadores) // 2
    times = {"verde": jogadores[:meio], "branco": jogadores[meio:]}
    
    resultado = {}
    
    for cor, elenco in times.items():
        random.shuffle(elenco)
        # Escolher Capitães (Principal e Suplente) que não repetiram
        candidatos = [j['nome'] for j in elenco if j['nome'] not in ULTIMOS_CAPITAES]
        if len(candidatos) < 2: candidatos = [j['nome'] for j in elenco] # Reset se faltar gente
        
        sorteados = random.sample(candidatos, 2)
        cap_principal = sorteados[0]
        cap_suplente = sorteados[1]
        
        # Atribuir números
        numeros_usados = []
        elenco_final = []
        
        for j in elenco:
            num = j.get('fixo')
            if not num:
                opcoes = [n for n in FAIXAS.get(j['posicao'], [99]) if n not in numeros_usados]
                num = random.choice(opcoes) if opcoes else 99
            
            numeros_usados.append(num)
            elenco_final.append({
                "nome": j['nome'],
                "posicao": j['posicao'],
                "numero": num,
                "is_capitao": j['nome'] == cap_principal,
                "is_suplente": j['nome'] == cap_suplente
            })
        
        resultado[cor] = {
            "jogadores": elenco_final,
            "cap_principal": cap_principal,
            "cap_suplente": cap_suplente
        }
    
    # Atualizar memória de capitães
    ULTIMOS_CAPITAES = [resultado['verde']['cap_principal'], resultado['branco']['cap_principal']]
    
    return jsonify(resultado)

# Mantenha as outras rotas (index, admin, login) iguais
@app.route('/')
def index(): return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form['user'] == 'admin' and request.form['pass'] == 'admin':
            session['admin'] = True
            return redirect(url_for('admin'))
    return render_template('login.html')

@app.route('/admin')
def admin():
    if not session.get('admin'): return redirect(url_for('login'))
    return render_template('admin.html', jogadores=carregar_jogadores())

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))
