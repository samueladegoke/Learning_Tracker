import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Globe, Code, Database, Satellite, Lightbulb } from 'lucide-react'

export default function DeepDiveDay33() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Globe className="w-6 h-6 text-primary-400" /> API Endpoints & Parameters
                    </h2>
                    <p>
                        Day 33 introduces <strong>Application Programming Interfaces (APIs)</strong> — the way
                        applications communicate with each other over the internet. You'll learn to make HTTP requests,
                        handle responses, and work with JSON data.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> What is an API?
                    </h2>
                    <p>
                        An <strong>API</strong> is a set of rules that allows programs to talk to each other.
                        Think of it as a waiter: you (the client) request data, the API delivers it from the server.
                    </p>
                    <CodeBlock code={`# APIs provide endpoints (URLs) that return data
# Example: ISS Current Location API
# Endpoint: http://api.open-notify.org/iss-now.json

# Returns JSON like:
{
    "message": "success",
    "timestamp": 1702656000,
    "iss_position": {
        "latitude": "51.5074",
        "longitude": "-0.1278"
    }
}`} language="json" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Making API Calls with requests
                    </h2>
                    <p>
                        The <code>requests</code> module makes HTTP requests simple. Use <code>requests.get()</code>
                        to fetch data from an API endpoint.
                    </p>
                    <CodeBlock code={`import requests

# Make a GET request to an API
response = requests.get(url="http://api.open-notify.org/iss-now.json")

# Check if request was successful
print(response.status_code)  # 200 = success

# Get the JSON data
data = response.json()
print(data["iss_position"]["latitude"])`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> HTTP Status Codes
                    </h2>
                    <p>
                        Status codes tell you what happened with your request. Use <code>raise_for_status()</code>
                        to automatically raise an exception for error codes.
                    </p>
                    <CodeBlock code={`# Common HTTP status codes:
# 1XX: Informational (hold on...)
# 2XX: Success (here you go!)
# 3XX: Redirect (go away)
# 4XX: Client Error (you messed up)
# 5XX: Server Error (they messed up)

# Specific codes:
# 200 = OK
# 404 = Not Found
# 401 = Unauthorized
# 500 = Server Error

response = requests.get(url="http://api.example.com/data")
response.raise_for_status()  # Raises exception if 4XX or 5XX`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> API Parameters
                    </h2>
                    <p>
                        Many APIs accept <strong>parameters</strong> to customize the response. Pass them as a
                        dictionary to the <code>params</code> argument.
                    </p>
                    <CodeBlock code={`import requests

# Sunrise-Sunset API requires lat/lng parameters
MY_LAT = 51.5074
MY_LNG = -0.1278

parameters = {
    "lat": MY_LAT,
    "lng": MY_LNG,
    "formatted": 0  # Get times in ISO format
}

response = requests.get(
    url="https://api.sunrise-sunset.org/json",
    params=parameters
)

data = response.json()
sunrise = data["results"]["sunrise"]
sunset = data["results"]["sunset"]
print(f"Sunrise: {sunrise}, Sunset: {sunset}")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> ISS Overhead Notifier
                    </h2>
                    <p>
                        Combine the ISS API and Sunrise-Sunset API to notify when the ISS is overhead at night.
                    </p>
                    <CodeBlock code={`import requests
import datetime as dt

MY_LAT = 51.5074
MY_LNG = -0.1278

def is_iss_overhead():
    response = requests.get("http://api.open-notify.org/iss-now.json")
    data = response.json()
    iss_lat = float(data["iss_position"]["latitude"])
    iss_lng = float(data["iss_position"]["longitude"])
    
    # Check if ISS is within 5 degrees of your position
    return (MY_LAT - 5 <= iss_lat <= MY_LAT + 5 and
            MY_LNG - 5 <= iss_lng <= MY_LNG + 5)

def is_night():
    params = {"lat": MY_LAT, "lng": MY_LNG, "formatted": 0}
    response = requests.get("https://api.sunrise-sunset.org/json", params=params)
    data = response.json()
    
    sunrise_hour = int(data["results"]["sunrise"].split("T")[1].split(":")[0])
    sunset_hour = int(data["results"]["sunset"].split("T")[1].split(":")[0])
    now_hour = dt.datetime.now().hour
    
    return now_hour >= sunset_hour or now_hour <= sunrise_hour

if is_iss_overhead() and is_night():
    print("Look up! The ISS is overhead!")`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Always Use .json()</h4>
                            <p className="text-sm text-surface-400">
                                The response object isn't data — call <code>.json()</code> to parse it into a Python dictionary.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">raise_for_status()</h4>
                            <p className="text-sm text-surface-400">
                                Call this method right after the request to automatically handle HTTP errors with exceptions.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">JSON Viewer Extension</h4>
                            <p className="text-sm text-surface-400">
                                Install a browser JSON viewer extension to explore API responses with formatting.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Test in Browser First</h4>
                            <p className="text-sm text-surface-400">
                                Paste API URLs in your browser to see the response structure before coding.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
