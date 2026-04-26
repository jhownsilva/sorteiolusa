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
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def salvar_jogadores(lista):
    with open(DATA_FILE, 'w') as f:
        json.dump(lista, f, indent=4)

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
    if not session.get('admin'): return redirect(url_for('login'))
    return render_template('admin.html', jogadores=carregar_jogadores())

@app.route('/api/cadastrar', methods=['POST'])
def cadastrar():
    lista = carregar_jogadores()
    novo = {
        "nome": request.form['nome'],
        "posicao": request.form['posicao'],
        "fixo": request.form.get('fixo', ""),
        "status": "ativo"
    }
    lista.append(novo)
    salvar_jogadores(lista)
    return redirect(url_for('admin'))

@app.route('/api/alterar_posicao', methods=['POST'])
def alterar_posicao():
    lista = carregar_jogadores()
    nome = request.form['nome']
    nova_pos = request.form['nova_posicao']
    for j in lista:
        if j['nome'] == nome:
            j['posicao'] = nova_pos
    salvar_jogadores(lista)
    return redirect(url_for('admin'))

@app.route('/api/sortear')
def sortear():
    ativos = [j for j in carregar_jogadores() if j['status'] == 'ativo']
    random.shuffle(ativos)
    # Sorteia apenas 22 jogadores (11 vs 11) se houver o suficiente
    total = ativos[:22]
    meio = len(total) // 2
    return jsonify({"verde": total[:meio], "branco": total[meio:]})
