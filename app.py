from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import random
import json
import os

app = Flask(__name__)
app.secret_key = "lusa_2026_key"

DATA_FILE = 'jogadores.json'

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
    fixo_val = request.form.get('fixo')
    novo = {
        "nome": request.form['nome'],
        "posicao": request.form['posicao'].lower(),
        "fixo": int(fixo_val) if fixo_val and fixo_val.isdigit() else None,
        "status": "ativo"
    }
    lista.append(novo)
    salvar_jogadores(lista)
    return redirect(url_for('admin'))

@app.route('/api/alterar_status', methods=['POST'])
def alterar_status():
    lista = carregar_jogadores()
    nome = request.form.get('nome')
    novo_status = request.form.get('novo_status')
    for j in lista:
        if j['nome'] == nome:
            j['status'] = novo_status
    salvar_jogadores(lista)
    return redirect(url_for('admin'))

@app.route('/api/excluir', methods=['POST'])
def excluir():
    lista = carregar_jogadores()
    nome = request.form.get('nome')
    nova_lista = [j for j in lista if j['nome'] != nome]
    salvar_jogadores(nova_lista)
    return redirect(url_for('admin'))

@app.route('/api/sortear')
def sortear():
    ativos = [j for j in carregar_jogadores() if j['status'] == 'ativo']
    categorias = {}
    for j in ativos:
        pos = j['posicao']
        if pos not in categorias: categorias[pos] = []
        categorias[pos].append(j)
    
    verde, branco = [], []
    for pos in categorias:
        random.shuffle(categorias[pos])
        for i, jogador in enumerate(categorias[pos]):
            if i % 2 == 0: verde.append(jogador)
            else: branco.append(jogador)
    return jsonify({"verde": verde, "branco": branco})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
