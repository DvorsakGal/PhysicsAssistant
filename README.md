# Physics Learning Assistant ⚛️

## Overview
This project is a **Physics Learning Assistant Web App** designed to integrate various technologies and APIs to enhance the learning experience. The app is developed as part of the "Technologies of Digitalization and Integration" course, focusing on seamless integration between services.

The app consists of two main sections:
1. **🏫 Classroom** - A section where users can add, search, and delete educational content using gRPC as a separate microservice.
   <img src="https://github.com/user-attachments/assets/7ae107c2-5e4e-4d07-850d-bcb73a3ddbee" alt="Classroom site" width="600"/>

2. **🧑‍🎓 Helper** - A section that allows users to scrape formulas, explanations, and links from the web, as well as ask a chatbot (Schrody) for assistance.
   <img src="https://github.com/user-attachments/assets/9f2b8407-e064-460d-bd32-2c1297c62916" alt="Helper site" width="600"/>


## Tech Stack 🖥️
### Frontend:
- **React** (TypeScript)

### Backend:
- **Flask** (Python)
- **gRPC** (for educational content management)
- **RabbitMQ** (for event-based notifications)
- **SQLite** (for data storage)
- **BeautifulSoup** (for web scraping)
- **Google Gemini API** (for chatbot functionality)
- **Flask-SocketIO** (for real-time notifications)

## Features
### 1. Classroom Section 📖
- Users can **add, search, and delete** educational content.
- Implemented as a **gRPC service** with its own server.
- The **proto file** (`educational.proto`) defines the gRPC service.
- The gRPC server is implemented in `server.py`.
- Users are notified of new content based on their subscription level.

### 2. Helper Section 🧑‍🎓
- Users can **scrape** physics formulas, explanations, and useful links.
- Uses **BeautifulSoup** to extract relevant information.
- Users can ask a **chatbot (Schrody)** questions, which are answered using the **Google Gemini API**.

### 3. Event Bus (RabbitMQ) 🚌
- Users subscribing to educational content receive **real-time notifications**.
- Implemented in `notification_consumer.py`, which listens for new content events.
- Notifications are sent via **WebSockets** to the frontend.

### 4. User Authentication (Mock Login) 🔒
- The database includes **test users** at startup.
- Login is **mocked** (only email required) to demonstrate the event bus functionality.
- Security was **not a primary focus** of this project.

## Running the app ▶️
- **gRPC service** should be run with:
  ```sh
  python server.py
- **flask app** should be run with:
  ```sh
  python -m flask run
- **react frontend** should be run with:
  ```sh
  npm i
  npm run dev
  
