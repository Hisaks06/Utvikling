from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/asteroids')
def asteroids():
    # Here you can add the code to run your Asteroids game
    return "Asteroids game goes here"

if __name__ == '__main__':
    app.run(debug=True)
