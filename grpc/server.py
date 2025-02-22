import json
from concurrent import futures
import grpc
import educational_pb2
import educational_pb2_grpc
import time
from datetime import datetime
import sqlite3
import pika


#Database setup
DB_FILE = 'educational_data.db'

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
            CREATE TABLE IF NOT EXISTS educational_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                summary TEXT NOT NULL,
                link TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        ''')

    # Add "level" column to the table if it doesn't exist
    cursor.execute('''
        PRAGMA table_info(educational_data)
    ''')
    columns = [row[1] for row in cursor.fetchall()]
    if 'level' not in columns:
        cursor.execute('''
            ALTER TABLE educational_data ADD COLUMN level TEXT
        ''')
        print("Added 'level' column to the educational_data table.")

    conn.commit()
    conn.close()

# In-memory data storage
#educational_data = []


# gRPC Service implementation
class EducationalService(educational_pb2_grpc.EducationalServiceServicer):
    def GetEducationalData(self, request, context):
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        # Check if title is provided; if not, return all entries
        if request.title.strip():
            print(request.title)
            cursor.execute('''
                    SELECT title, summary, link, created_at
                    FROM educational_data
                    WHERE title LIKE ?
                ''', (f"%{request.title}%",))
        else:
            print("No title provided")
            cursor.execute('''
                    SELECT title, summary, link, created_at
                    FROM educational_data
                ''')

        rows = cursor.fetchall()
        conn.close()

        data = [
            educational_pb2.EducationalData(
                title=row[0], summary=row[1], link=row[2], created_at=row[3]
            )
            for row in rows
        ]
        return educational_pb2.EducationalDataResponse(data=data)

    def AddEducationalData(self, request, context):
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO educational_data (title, summary, link, created_at, level)
            VALUES (?, ?, ?, ?, ?)
        ''', (request.title, request.summary, request.link, datetime.now().isoformat(), request.level))
        conn.commit()
        conn.close()

        # Publish the new educational content to rabbitMQ
        connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        channel = connection.channel()
        channel.queue_declare(queue='educational_notifications')

        message = {
            "title": request.title,
            "summary": request.summary,
            "level": request.level
        }
        channel.basic_publish(exchange='', routing_key='educational_notifications', body=json.dumps(message))
        connection.close()


        return educational_pb2.AddEducationalDataResponse(message="Educational data added successfully!")

    def StreamEducationalData(self, request, context):
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()

        print("streaming...")
        # Check if the title is provided and apply filtering
        if request.title.strip():
            cursor.execute(''' 
                    SELECT title, summary, link, created_at
                    FROM educational_data
                    WHERE title LIKE ?
                ''', (f"%{request.title}%",))  # Filter by the title (or part of the title)
        else:
            cursor.execute(''' 
                    SELECT title, summary, link, created_at
                    FROM educational_data
                ''')  # If no title is provided, return all records

        rows = cursor.fetchall()
        conn.close()

        for row in rows:
            yield educational_pb2.EducationalData(
                title=row[0], summary=row[1], link=row[2], created_at=row[3]
            )

    def DeleteEducationalData(self, request, context):
        # Create a new connection for the database
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()

        # Execute the delete statement
        cursor.execute("DELETE FROM educational_data WHERE title = ?", (request.title,))
        conn.commit()

        # Check if any rows were deleted
        if cursor.rowcount > 0:
            message = f"Educational data with title '{request.title}' was deleted successfully."
        else:
            message = f"Educational data with title '{request.title}' not found."

        # Close the connection
        conn.close()

        # Return the response
        return educational_pb2.DeleteEducationalDataResponse(message=message)


#Main server code
def serve():
    init_db()
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    educational_pb2_grpc.add_EducationalServiceServicer_to_server(EducationalService(), server)
    server.add_insecure_port('[::]:50051')
    print("Server started on port 50051")
    server.start()
    server.wait_for_termination()

if __name__ == "__main__":
    serve()