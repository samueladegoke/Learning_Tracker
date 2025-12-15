import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Key, Shield, MessageSquare, Lock, Lightbulb } from 'lucide-react'

export default function DeepDiveDay35() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Key className="w-6 h-6 text-primary-400" /> API Authentication & Environment Variables
                    </h2>
                    <p>
                        Day 35 covers <strong>API authentication</strong> using API keys and tokens, plus
                        <strong>environment variables</strong> for secure credential storage. You'll also
                        learn to send SMS messages using the Twilio API.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> API Keys & Authentication
                    </h2>
                    <p>
                        Many APIs require authentication via <strong>API keys</strong>. These are passed as
                        parameters, headers, or in the URL depending on the API.
                    </p>
                    <CodeBlock code={`import requests

# Method 1: API key as parameter
API_KEY = "your_api_key_here"
params = {
    "appid": API_KEY,
    "lat": 51.5,
    "lon": -0.1
}
response = requests.get("https://api.openweathermap.org/data/2.5/weather", params=params)

# Method 2: API key in header
headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}
response = requests.get("https://api.example.com/data", headers=headers)

# Method 3: Basic Auth (username + password/token)
from requests.auth import HTTPBasicAuth
response = requests.get(url, auth=HTTPBasicAuth("username", "password"))`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Environment Variables
                    </h2>
                    <p>
                        <strong>Never hardcode API keys</strong> in your code! Use environment variables to keep
                        them secure and out of version control.
                    </p>
                    <CodeBlock code={`import os

# Set environment variables (in terminal/shell):
# Windows: set MY_API_KEY=abc123
# Mac/Linux: export MY_API_KEY=abc123

# Access in Python
API_KEY = os.environ.get("MY_API_KEY")
ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID")
AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN")

# With default fallback
DEBUG_MODE = os.environ.get("DEBUG", "False")

# Never do this in production:
# API_KEY = "sk_live_12345..."  # ❌ Exposed in code!`} language="python" />
                    <p>
                        Create a <code>.env</code> file for local development and add it to <code>.gitignore</code>
                        to prevent accidental commits.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Twilio Setup for SMS
                    </h2>
                    <p>
                        <strong>Twilio</strong> is a cloud communications platform. After creating an account,
                        you get an Account SID, Auth Token, and a phone number for sending SMS.
                    </p>
                    <CodeBlock code={`# Install: pip install twilio

from twilio.rest import Client
import os

account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
twilio_number = os.environ.get("TWILIO_PHONE_NUMBER")

client = Client(account_sid, auth_token)

message = client.messages.create(
    body="Hello from Python!",
    from_=twilio_number,
    to="+1234567890"  # Recipient's phone number
)

print(message.status)  # 'queued', 'sent', 'delivered', etc.`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Weather Alert System
                    </h2>
                    <p>
                        Combine weather API data with Twilio SMS to send alerts when rain is expected.
                    </p>
                    <CodeBlock code={`import requests
from twilio.rest import Client
import os

OWM_API_KEY = os.environ.get("OWM_API_KEY")
MY_LAT = 51.5074
MY_LNG = -0.1278

# OpenWeatherMap API - hourly forecast
params = {
    "lat": MY_LAT,
    "lon": MY_LNG,
    "appid": OWM_API_KEY,
    "exclude": "current,minutely,daily"
}

response = requests.get(
    "https://api.openweathermap.org/data/2.5/onecall",
    params=params
)
response.raise_for_status()

weather_data = response.json()["hourly"][:12]  # Next 12 hours

will_rain = False
for hour in weather_data:
    condition_code = hour["weather"][0]["id"]
    if condition_code < 700:  # Rain, snow, thunderstorm
        will_rain = True
        break

if will_rain:
    client = Client(os.environ.get("TWILIO_SID"), os.environ.get("TWILIO_AUTH"))
    client.messages.create(
        body="☔ Bring an umbrella today!",
        from_=os.environ.get("TWILIO_NUMBER"),
        to="+1234567890"
    )`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Security Best Practices
                    </h2>
                    <p>
                        Follow these practices to keep your credentials safe:
                    </p>
                    <CodeBlock code={`# 1. Use .env files for local development
# .env file:
TWILIO_SID=ACxxxxxxx
TWILIO_AUTH=xxxxxxxxx
OWM_API_KEY=xxxxxxxxx

# 2. Load with python-dotenv
from dotenv import load_dotenv
load_dotenv()  # Load .env file into os.environ

# 3. Add .env to .gitignore
# .gitignore:
.env
*.env
.env.local

# 4. Use different keys for dev/prod
API_KEY = os.environ.get("PROD_API_KEY" if PRODUCTION else "DEV_API_KEY")

# 5. Rotate keys if exposed
# If you accidentally commit a key, regenerate it immediately!`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Never Commit Secrets</h4>
                            <p className="text-sm text-surface-400">
                                Add <code>.env</code> to <code>.gitignore</code> immediately. Check git history if you ever exposed keys.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">python-dotenv</h4>
                            <p className="text-sm text-surface-400">
                                Install <code>python-dotenv</code> and call <code>load_dotenv()</code> to load .env files automatically.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Twilio Trial Limits</h4>
                            <p className="text-sm text-surface-400">
                                Trial accounts can only send SMS to verified numbers. Upgrade for production use.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Weather Codes</h4>
                            <p className="text-sm text-surface-400">
                                OpenWeatherMap condition codes: &lt;700 = precipitation (rain/snow), 800 = clear, &gt;800 = clouds.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
