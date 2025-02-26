import google.generativeai as genai
from flask import jsonify

genai.configure(api_key="YOUR_API_KEY")

# Create the model
generation_config = {
    "temperature": 0.5,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 1024,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    system_instruction="Your name is Schrody. You are a helpful physics tutor for students aged 12-20 years old. Help the students with their questions and make study recommendations but don't overcomplicate things."
)


def ask_schrody(prompt):
    chat_session = model.start_chat(
        history=[]
    )

    response = chat_session.send_message(prompt)

    return response
