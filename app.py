from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import random
import json
import os

app = Flask(__name__)
app.secret_key = "lusa_2026_key"

DATA_FILE = 'jogadores.json'

# Função para garantir que o arquivo JSON exista com uma lista vazia se não for encontrado
def carregar_jogadores():
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

def salvar_jogadores(lista):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(lista, f, indent=4, ensure_ascii=False)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form['user'] == 'admin' and request.form['pass'] == 'admin':
            session['admin'] = True
            return redirect(url_for('admin'))
    return render_template('login.html')

@app.route('/admin')
def admin():
    if not session.get('admin'): 
        return redirect(url_for('login'))
    return render_template('admin.html', jogadores=carregar_jogadores())

@app.route('/api/cadastrar', methods=['POST'])
def cadastrar():
    lista = carregar_jogadores()
    # Pega o número fixo e garante que seja tratado como número ou vazio
    fixo_val = request.form.get('fixo')
    novo = {
        "nome": request.form['nome'],
        "posicao": request.form['posicao'].lower(), # Salva sempre em minúsculo para o CSS bater
        "fixo": int(fixo_val) if fixo_val and fixo_val.isdigit() else None,
        "status": "ativo"
    }
    lista.append(novo)
    salvar_jogadores(lista)
    return redirect(url_for('admin'))

@app.route('/api/alterar_posicao', methods=['POST'])
def alterar_posicao():
    lista = carregar_jogadores()
    nome = request.form['nome']
    nova_pos = request.form['nova_posicao'].lower()
    for j in lista:
        if j['nome'] == nome:
            j['posicao'] = nova_pos
    salvar_jogadores(lista)
    return redirect(url_for('admin'))

@app.route('/api/sortear')
def sortear():
    ativos = [j for j in carregar_jogadores() if j['status'] == 'ativo']
    
    # --- Lógica de Equilíbrio por Posição ---
    # Separamos os jogadores por posição para distribuir um de cada para cada time
    categorias = {}
    for j in ativos:
        pos = j['posicao']
        if pos not in categorias: categorias[pos] = []
        categorias[pos].append(j)
    
    verde = []
    branco = []
    
    for pos in categorias:
        random.shuffle(categorias[pos])
        for i, jogador in enumerate(categorias[pos]):
            # Limita a 11 jogadores por time (22 no total)
            if len(verde) < 11 or len(branco) < 11:
                if i % 2 == 0 and len(verde) < 11:
                    verde.append(jogador)
                elif len(branco) < 11:
                    branco.append(jogador)

    return jsonify({"verde": verde, "branco": branco})

if __name__ == "__main__":
    # Importante para o Render capturar a porta correta
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
