import datetime
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ['https://www.googleapis.com/auth/calendar']

def main():
    creds = None

    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json")

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)

        with open("token.json", "w") as token:
            token.write(creds.to_json())

    try:
        service = build("calendar", "v3", credentials=creds)

        now = datetime.datetime.now().isoformat() + "Z"
        # window v katerem bom iskal dogodke, da se ti ne bodo prekrivali - 10 dni
        ten_day_window = (datetime.datetime.now() + datetime.timedelta(days=10)).isoformat() + "Z"

        event_result = service.events().list(calendarId="primary", timeMin=now, timeMax=ten_day_window, singleEvents=True, orderBy="startTime").execute()
        events = event_result.get("items", [])

        if not events:
            print("No events found")
            return

        for event in events:
            start = event["start"].get("dateTime", event["start"].get("date"))
            print(start, event["summary"])


        event = {
            'summary': 'Physics Lesson',
            'description': 'Learn topics related to physics.',
            'start': {
                'dateTime': "2024-12-05T09:00:00",
                'timeZone': 'Europe/Ljubljana',
            },
            'end': {
                'dateTime': "2024-12-05T11:00:00",
                'timeZone': 'Europe/Ljubljana',
            },
            "recurrence": [
                "RRULE:FREQ=DAILY;COUNT=3"
            ]
        }

        event = service.events().insert(calendarId='primary', body=event).execute()

        print(f"Event created {event.get('htmlLink')}")

    except HttpError as error:
        print("an error occured: ", error)

