import pika
import json
import sqlite3
import os
import socketio

# Set up the Socket.IO client to communicate with Flask
sio = socketio.Client()

# Connect to Flask's Socket.IO server
def connect_to_socketio():
    sio.connect('http://localhost:5000')

# Send notification to Flask WebSocket
def notify_users_via_websocket(email, title, summary):
    sio.emit('notification', {'email': email, 'title': title, 'summary': summary})
    print(f"Sent WebSocket notification to {email}: {title} - {summary}")

def notification_worker():
    # Connect to the WebSocket server
    connect_to_socketio()

    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue='educational_notifications')

    def callback(ch, method, properties, body):
        message = json.loads(body)
        level = message['level']
        title = message['title']
        summary = message['summary']

        # Query users based on level
        DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'user_data.db')
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('SELECT email FROM user WHERE level = ?', (level,))
        users = cursor.fetchall()
        conn.close()

        # Notify users (for simplicity, just printing here)
        #for user in users:
            #print(f"Notify {user[0]}: New content added - {title}: {summary}")

        # Notify users through WebSocket
        for user in users:
            notify_users_via_websocket(user[0], title, summary)

    channel.basic_consume(queue='educational_notifications', on_message_callback=callback, auto_ack=True)
    print('Waiting for messages...')
    channel.start_consuming()

if __name__ == "__main__":
    notification_worker()