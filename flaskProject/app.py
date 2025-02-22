import os
from flask import Flask, jsonify, request, render_template
from koledar import main
from gemini_asistant import ask_schrody
from scrapers import scrape_formulas, scrape_formulas_and_explanations, scrape_links_from_table
from flask_cors import CORS
from grpc_client.client import fetch_educational_data, add_educational_data, remove_educational_data, stream_educational_data
import grpc
import sqlite3
from flask_socketio import SocketIO, emit
import pika
import json

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins=["http://localhost:5173"])
cors = CORS(app, origins='*')
app.secret_key = os.urandom(24)
base_url = "https://www.geeksforgeeks.org/list-of-physics-formulas/"

DB_FILE = "user_data.db"

# Function to initialize the database
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Create 'user' table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            level INTEGER NOT NULL
        )
    ''')

    # Add 5 test entries if the table is empty
    cursor.execute('SELECT COUNT(*) FROM user')
    if cursor.fetchone()[0] == 0:  # Check if the table is empty
        test_entries = [
            ("Alice", "alice@example.com", 1),
            ("Bob", "bob@example.com", 2),
            ("Charlie", "charlie@example.com", 3),
            ("David", "david@example.com", 4),
            ("Eve", "eve@example.com", 1),
        ]
        cursor.executemany('''
            INSERT INTO user (username, email, level)
            VALUES (?, ?, ?)
        ''', test_entries)
        print("Added test entries to the user table.")

    conn.commit()
    conn.close()

# Initialize database before running the app
init_db()


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'


@app.route('/ask_tutor', methods=['POST'])
def ask_tutor():
    try:
        data = request.get_json()
        prompt = data['prompt']

        if not prompt:
            return jsonify({"Error": "No prompt provided"}), 500

        response = ask_schrody(prompt)

        return jsonify({"response": response.text}), 200

    except Exception as e:
        return jsonify({"Error": str(e)}), 500


@app.route('/calendar', methods=['POST'])
def schedule_lessons_route():
    try:
        main()
        return jsonify({"message": "Lessons scheduled!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/formulas', methods=['POST'])   #get in add daj vun
def add_topics():
    data = request.json
    topics = data.get('topics', [])
    print(topics)
    if not topics:
        return jsonify({"Error": "No topics provided"}), 400

    formulas = scrape_formulas(base_url, topics)
    explanations = scrape_formulas_and_explanations(base_url, topics)
    links = scrape_links_from_table(base_url, topics)

    return jsonify({'formulas': formulas, 'explanations': explanations, 'links': links})


@app.route('/educational-data', methods=['GET'])
def get_educational_data():
    title = request.args.get('title', '')  # Get the topic from query parameters
    try:
        data = fetch_educational_data(title)
        return jsonify([{
            'title': item.title,
            'summary': item.summary,
            'link': item.link,
            'created_at': item.created_at
        } for item in data])
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/educational-data', methods=['POST'])
def post_educational_data():
    data = request.json
    try:
        message = add_educational_data(data['title'], data['summary'], data['link'], data['level'])
        return jsonify({'message': message})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/educational-data', methods=['DELETE'])
def delete_educational_data():
    try:
        # Parse the title from the request JSON
        request_data = request.get_json()
        title = request_data.get('title')

        if not title:
            return jsonify({"error": "Title is required"}), 400

        # Use the gRPC client to delete the data
        message = remove_educational_data(title)
        return jsonify({"message": message}), 200

    except grpc.RpcError as e:
        return jsonify({"error": f"gRPC Error: {e.details()}"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/educational-data/search', methods=['GET'])
def get_educational_data_filtered():
    title = request.args.get('title', '')  # Get title from query parameter
    try:
        data = stream_educational_data(title)
        return jsonify([item for item in data])  # Stream data back to client as it arrives
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Set up RabbitMQ consumer (subscriber)
def notification_worker():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue='educational_notifications')

    def callback(ch, method, properties, body):
        message = json.loads(body)
        level = message['level']
        title = message['title']
        summary = message['summary']

        # Query users based on level (similar to your previous implementation)
        DB_PATH = os.path.join(os.path.dirname(__file__), '.', 'user_data.db')
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('SELECT email FROM user WHERE level = ?', (level,))
        users = cursor.fetchall()
        conn.close()

        # Notify users (emit the message to the front-end via WebSocket)
        for user in users:
            print(f"Notify {user[0]}: New content added - {title}: {summary}")
            socketio.emit('new_notification', {
                'email': user[0],
                'title': title,
                'summary': summary,
                'level': level
            })

    channel.basic_consume(queue='educational_notifications', on_message_callback=callback, auto_ack=True)
    print('Waiting for messages...')
    channel.start_consuming()


# Start the RabbitMQ worker in a background thread
@socketio.on('connect')
def handle_connect():
    print("A user connected.")
    socketio.start_background_task(notification_worker)


if __name__ == '__main__':
    socketio.run(app)
    #app.run()
