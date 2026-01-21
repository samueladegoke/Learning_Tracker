import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Dumbbell, Lightbulb } from 'lucide-react'

export default function DeepDiveDay38() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Dumbbell className="w-6 h-6 text-primary-400" /> Workout Tracking with Google Sheets
                    </h2>
                    <p>
                        Day 38 builds a <strong>workout tracker</strong> that uses natural language processing
                        to understand exercise descriptions and logs them to Google Sheets. You'll use
                        the Nutritionix API for NLP and Sheety to interact with Google Sheets.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Nutritionix API - Natural Language
                    </h2>
                    <p>
                        The <strong>Nutritionix API</strong> understands natural language exercise descriptions
                        and returns structured data (exercise name, duration, calories burned).
                    </p>
                    <CodeBlock code={`import requests
import os

NUTRITIONIX_APP_ID = os.environ.get("NUTRITIONIX_APP_ID")
NUTRITIONIX_API_KEY = os.environ.get("NUTRITIONIX_API_KEY")

exercise_endpoint = "https://trackapi.nutritionix.com/v2/natural/exercise"

headers = {
    "x-app-id": NUTRITIONIX_APP_ID,
    "x-app-key": NUTRITIONIX_API_KEY,
}

# Natural language input
user_input = input("Tell me which exercises you did: ")
# Example: "Ran 5 kilometers and did 20 minutes of cycling"

exercise_params = {
    "query": user_input,
    "weight_kg": 70,
    "height_cm": 175,
    "age": 30
}

response = requests.post(exercise_endpoint, json=exercise_params, headers=headers)
result = response.json()
print(result)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Parsing Exercise Data
                    </h2>
                    <p>
                        The API returns a list of exercises with details. Extract what you need for logging.
                    </p>
                    <CodeBlock code={`# Response structure
exercises = result["exercises"]

for exercise in exercises:
    exercise_name = exercise["name"]
    duration = exercise["duration_min"]
    calories = exercise["nf_calories"]
    
    print(f"Exercise: {exercise_name}")
    print(f"Duration: {duration} minutes")
    print(f"Calories: {calories}")
    
# Example output:
# Exercise: running
# Duration: 30 minutes
# Calories: 350`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Sheety API - Google Sheets Interface
                    </h2>
                    <p>
                        <strong>Sheety</strong> turns Google Sheets into a REST API. Create a spreadsheet,
                        connect it to Sheety, and use HTTP requests to read/write data.
                    </p>
                    <CodeBlock code={`import datetime as dt

SHEETY_ENDPOINT = os.environ.get("SHEETY_ENDPOINT")
SHEETY_TOKEN = os.environ.get("SHEETY_TOKEN")

sheety_headers = {
    "Authorization": f"Bearer {SHEETY_TOKEN}",
    "Content-Type": "application/json"
}

# Get current date and time
now = dt.datetime.now()
date_string = now.strftime("%d/%m/%Y")
time_string = now.strftime("%H:%M:%S")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Logging Workouts to Sheets
                    </h2>
                    <p>
                        Loop through parsed exercises and POST each one to your Google Sheet via Sheety.
                    </p>
                    <CodeBlock code={`for exercise in exercises:
    # Sheety expects data wrapped in sheet name
    # If your sheet is named "workouts", the key is "workout" (singular)
    sheet_data = {
        "workout": {
            "date": date_string,
            "time": time_string,
            "exercise": exercise["name"].title(),
            "duration": exercise["duration_min"],
            "calories": exercise["nf_calories"]
        }
    }
    
    # POST to add row
    response = requests.post(
        SHEETY_ENDPOINT,
        json=sheet_data,
        headers=sheety_headers
    )
    
    print(f"Logged: {exercise['name']} - {response.status_code}")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Complete Workout Flow
                    </h2>
                    <p>
                        The full workflow: get user input → parse with Nutritionix → log to Sheets.
                    </p>
                    <CodeBlock code={`# Complete workout tracker
user_input = input("What exercises did you do today? ")

# Get exercise data from Nutritionix
exercise_response = requests.post(
    exercise_endpoint,
    json={"query": user_input, "weight_kg": 70, "height_cm": 175, "age": 30},
    headers=nutritionix_headers
)
exercises = exercise_response.json()["exercises"]

# Log each exercise to Google Sheets
now = dt.datetime.now()
for exercise in exercises:
    sheet_data = {
        "workout": {
            "date": now.strftime("%d/%m/%Y"),
            "time": now.strftime("%H:%M:%S"),
            "exercise": exercise["name"].title(),
            "duration": exercise["duration_min"],
            "calories": exercise["nf_calories"]
        }
    }
    requests.post(SHEETY_ENDPOINT, json=sheet_data, headers=sheety_headers)

print(f"Logged {len(exercises)} exercises!")`} language="python" />
                </section>

            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500 inline mr-2" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Natural Language Power</h4>
                            <p className="text-sm text-surface-400">
                                Nutritionix understands "ran 5k" and "20 pushups" — no need for structured input.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Sheety Sheet Names</h4>
                            <p className="text-sm text-surface-400">
                                Sheety uses singular form of sheet name as key: "workouts" sheet → "workout" key.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Bearer Token Auth</h4>
                            <p className="text-sm text-surface-400">
                                Enable Bearer Token in Sheety settings for secure API access.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">title() for Names</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>.title()</code> to capitalize exercise names properly in your log.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
