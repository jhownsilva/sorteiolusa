from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import random

app = Flask(__name__)
app.secret_key = "lusa_secret_2026"

# Banco de dados temporário (em produção usaríamos um arquivo JSON ou SQLite)
jogadores_db = [
    {"nome": "Felipe", "posicao": "goleiro", "status": "ativo"},
    {"nome": "Guilherme Felix", "posicao": "zagueiro", "status": "ativo", "fixo": 19},
    {"nome": "Jackson", "posicao": "meia", "status": "ativo", "fixo": 21},
    {"nome": "Madruguinha", "posicao": "centroavante", "status": "ativo", "fixo": 20},
    # Adicione os demais aqui...
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
    if not session.get('admin'):
        return redirect(url_for('login'))
    return render_template('admin.html', jogadores=jogadores_db)

@app.route('/api/sortear', methods=['GET'])
def api_sortear():
    # Filtra apenas quem não está no DM ou Suspenso
    ativos = [j for j in jogadores_db if j['status'] == 'ativo']
    random.shuffle(ativos)
    
    # Lógica simples de divisão (Meio a meio)
    meio = len(ativos) // 2
    return jsonify({
        "verde": ativos[:meio],
        "branco": ativos[meio:]
    })

if __name__ == "__main__":
    app.run(debug=True)
