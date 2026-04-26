from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import random

app = Flask(__name__)
app.secret_key = "lusa_2026_key"

# Base de dados completa
jogadores_db = [
    {"nome": "Felipe", "posicao": "goleiro", "status": "ativo"},
    {"nome": "Thiago Gkay", "posicao": "goleiro", "status": "ativo"},
    {"nome": "Bruno Fernandes", "posicao": "zagueiro", "status": "ativo"},
    {"nome": "Dé", "posicao": "zagueiro", "status": "ativo"},
    {"nome": "Fagner", "posicao": "zagueiro", "status": "ativo"},
    {"nome": "Guilherme Felix", "posicao": "zagueiro", "status": "ativo", "fixo": 19},
    {"nome": "Jorel", "posicao": "zagueiro", "status": "ativo"},
    {"nome": "Romario", "posicao": "zagueiro", "status": "ativo"},
    {"nome": "André", "posicao": "lateral", "status": "ativo"},
    {"nome": "Breno", "posicao": "lateral", "status": "ativo"},
    {"nome": "Giovanni Rocha", "posicao": "lateral", "status": "ativo"},
    {"nome": "Gustavo", "posicao": "lateral", "status": "ativo"},
    {"nome": "Henrique", "posicao": "lateral", "status": "ativo"},
    {"nome": "Jhimmy", "posicao": "lateral", "status": "ativo"},
    {"nome": "Madson", "posicao": "lateral", "status": "ativo"},
    {"nome": "Mikael", "posicao": "lateral", "status": "ativo"},
    {"nome": "Armeiro", "posicao": "volante", "status": "ativo"},
    {"nome": "Davizinho", "posicao": "volante", "status": "ativo"},
    {"nome": "Delson", "posicao": "volante", "status": "ativo"},
    {"nome": "Fillipi", "posicao": "volante", "status": "ativo"},
    {"nome": "Kaique", "posicao": "volante", "status": "ativo"},
    {"nome": "Nathan Eneas", "posicao": "volante", "status": "ativo"},
    {"nome": "Rafinha", "posicao": "volante", "status": "ativo"},
    {"nome": "Thiago", "posicao": "volante", "status": "ativo"},
    {"nome": "Wesley", "posicao": "volante", "status": "ativo"},
    {"nome": "Willian", "posicao": "volante", "status": "ativo"},
    {"nome": "Cae", "posicao": "meia", "status": "ativo"},
    {"nome": "Erick Samurai", "posicao": "meia", "status": "ativo"},
    {"nome": "Gah", "posicao": "meia", "status": "ativo"},
    {"nome": "Jackson", "posicao": "meia", "status": "ativo", "fixo": 21},
    {"nome": "Le", "posicao": "meia", "status": "ativo"},
    {"nome": "Renan", "posicao": "meia", "status": "ativo"},
    {"nome": "Sakai", "posicao": "meia", "status": "ativo"},
    {"nome": "Ventura", "posicao": "meia", "status": "ativo"},
    {"nome": "Anézio", "posicao": "atacante", "status": "ativo"},
    {"nome": "Caio", "posicao": "atacante", "status": "ativo"},
    {"nome": "Carlão", "posicao": "atacante", "status": "ativo"},
    {"nome": "Fabio", "posicao": "atacante", "status": "ativo"},
    {"nome": "Guilherme", "posicao": "atacante", "status": "ativo"},
    {"nome": "Gustavinho", "posicao": "atacante", "status": "ativo"},
    {"nome": "Luis Henrique", "posicao": "atacante", "status": "ativo"},
    {"nome": "Bruno Zanin", "posicao": "centroavante", "status": "ativo"},
    {"nome": "Diego", "posicao": "centroavante", "status": "ativo"},
    {"nome": "Edberto", "posicao": "centroavante", "status": "ativo"},
    {"nome": "Lucas", "posicao": "centroavante", "status": "ativo"},
    {"nome": "Madruguinha", "posicao": "centroavante", "status": "ativo", "fixo": 20},
    {"nome": "Pastor", "posicao": "centroavante", "status": "ativo"}
]

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
    return render_template('admin.html', jogadores=jogadores_db)

@app.route('/api/sortear', methods=['GET'])
def api_sortear():
    ativos = [j for j in jogadores_db if j['status'] == 'ativo']
    
    # Sorteio por posição para equilibrar
    posicoes = ["goleiro", "zagueiro", "lateral", "volante", "meia", "atacante", "centroavante"]
    verde, branco = [], []
    
    for pos in posicoes:
        lista_pos = [j for j in ativos if j['posicao'] == pos]
        random.shuffle(lista_pos)
        for i, jog in enumerate(lista_pos):
            if i % 2 == 0: verde.append(jog)
            else: branco.append(jog)
            
    return jsonify({"verde": verde, "branco": branco})

if __name__ == "__main__":
    app.run(debug=True)
