from flask import Flask, render_template_string, request, send_file
import qrcode

app = Flask(__name__)

@app.route('/')
def index():
    return render_template_string(open('index.html').read())

@app.route('/generate_qrcode', methods=['POST'])
def generate_qrcode():
    text = request.form['text']
    img = qrcode.make(text)
    img.save('qrcode.png')
    return send_file('qrcode.png', mimetype='image/png', download_name='qrcode.png')

if __name__ == '__main__':
    app.run(debug=True)
