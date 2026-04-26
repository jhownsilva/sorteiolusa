from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import random
import json
import os

app = Flask(__name__)
app.secret_key = "lusa_secret_key"

# Dados iniciais e numeração por zona
ZONAS = {
    "goleiro": [1], "zagueiro": [3, 4, 13, 12, 26], "lateral": [2, 6, 14, 25, 28],
    "volante": [5, 15, 16, 24, 27], "meia": [18, 8, 10, 17],
    "atacante": [11, 7, 27, 29], "centroavante": [9, 23, 22]
}

FIXOS = {'Guilherme Felix': 19, 'Jackson': 21, 'Madruguinha': 20}

# Rota de Login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form['username'] == 'admin' and request.form['password'] == 'admin':
            session['logged_in'] = True
            return redirect(url_for('admin'))
    return render_template('login.html')

# Rota do Sorteio (Página Principal)
@app.route('/')
def index():
    return render_template('index.html')

# Lógica do Sorteio
@app.route('/sortear', methods=['POST'])
def sortear():
    # Recebe a lista de jogadores ativos do frontend
    jogadores_input = request.json['jogadores'] 
    
    random.shuffle(jogadores_input)
    
    # Separação por posição para os dois times
    time_verde = []
    time_branco = []
    
    # ... Lógica de divisão por zonas ...
    
    return jsonify({"verde": time_verde, "branco": time_branco})

if __name__ == "__main__":
    app.run(debug=True)