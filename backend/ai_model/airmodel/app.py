from flask import Flask, redirect, url_for, render_template, jsonify, request
from flask_socketio import SocketIO
import threading
from VirtualPainter import strt

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")  # Enable real-time updates

# Global variable to store the recognized word
recognized_word = ""

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/feature")
def feature():
    return render_template("feature.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

# Route to start air writing (runs VirtualPainter in a separate thread)
@app.route("/start-airwriting", methods=["POST"])
def start_airwriting():
    try:
        # Start VirtualPainter in a background thread
        thread = threading.Thread(target=run_virtual_painter)
        thread.daemon = True  # Ensure the thread exits when the main program does
        thread.start()
        return jsonify({"message": "Air writing started successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Helper function to run VirtualPainter and capture words
def run_virtual_painter():
    global recognized_word
    for word in strt():  # Ensure VirtualPainter yields recognized words
        recognized_word = word
        print(f"Recognized Word: {recognized_word}")
        
        # Emit the recognized word to connected clients
        socketio.emit('update_word', recognized_word)

# API route to fetch the current recognized word
@app.route("/get_word", methods=["GET"])
def get_word():
    global recognized_word
    return jsonify({"recognized_word": recognized_word})

@socketio.on("connect")
def handle_connect():
    print("Client connected")

if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000)
