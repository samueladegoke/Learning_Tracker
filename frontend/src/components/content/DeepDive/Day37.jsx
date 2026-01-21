import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Activity, Send, Edit, Trash2, Lightbulb } from 'lucide-react'

export default function DeepDiveDay37() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-primary-400" /> Habit Tracking with Pixela
                    </h2>
                    <p>
                        Day 37 introduces <strong>HTTP POST, PUT, and DELETE requests</strong> using the
                        Pixela habit tracking API. You'll learn to create graphs, add data points, and
                        manage your habits programmatically.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> POST Requests - Creating Resources
                    </h2>
                    <p>
                        <strong>POST requests</strong> create new resources on the server. Unlike GET (which
                        retrieves data), POST sends data to create something new.
                    </p>
                    <CodeBlock code={`import requests

# Create a Pixela user account
pixela_endpoint = "https://pixe.la/v1/users"

user_params = {
    "token": "your-secret-token",  # You create this
    "username": "your-username",
    "agreeTermsOfService": "yes",
    "notMinor": "yes"
}

# POST request to create user
response = requests.post(url=pixela_endpoint, json=user_params)
print(response.text)`} language="python" />
                    <p>
                        Note: Use <code>json=</code> instead of <code>params=</code> to send data in the request body.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> HTTP Headers for Authentication
                    </h2>
                    <p>
                        Many APIs use <strong>headers</strong> for authentication instead of URL parameters.
                        Pixela uses a custom header <code>X-USER-TOKEN</code>.
                    </p>
                    <CodeBlock code={`USERNAME = "your-username"
TOKEN = "your-secret-token"

# Headers for authentication
headers = {
    "X-USER-TOKEN": TOKEN
}

# Create a graph (habit tracker)
graph_endpoint = f"https://pixe.la/v1/users/{USERNAME}/graphs"

graph_config = {
    "id": "graph1",
    "name": "Coding Habit",
    "unit": "hours",
    "type": "float",
    "color": "shibafu"  # green
}

response = requests.post(url=graph_endpoint, json=graph_config, headers=headers)
print(response.text)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Adding Data Points (Pixels)
                    </h2>
                    <p>
                        Add daily habit data by POSTing "pixels" to your graph. Each pixel has a date and quantity.
                    </p>
                    <CodeBlock code={`import datetime as dt

GRAPH_ID = "graph1"
pixel_endpoint = f"https://pixe.la/v1/users/{USERNAME}/graphs/{GRAPH_ID}"

# Get today's date in required format (yyyyMMdd)
today = dt.datetime.now()
date_string = today.strftime("%Y%m%d")  # e.g., "20251215"

pixel_data = {
    "date": date_string,
    "quantity": "2.5"  # Must be a string
}

response = requests.post(url=pixel_endpoint, json=pixel_data, headers=headers)
print(response.text)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> PUT Requests - Updating Data
                    </h2>
                    <p>
                        Use <strong>PUT requests</strong> to update existing resources. The URL includes
                        the specific resource to update.
                    </p>
                    <CodeBlock code={`# Update a specific pixel
update_endpoint = f"https://pixe.la/v1/users/{USERNAME}/graphs/{GRAPH_ID}/{date_string}"

new_data = {
    "quantity": "3.5"  # Update the value
}

# PUT request to update
response = requests.put(url=update_endpoint, json=new_data, headers=headers)
print(response.text)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> DELETE Requests - Removing Data
                    </h2>
                    <p>
                        <strong>DELETE requests</strong> remove resources. Be careful - this is permanent!
                    </p>
                    <CodeBlock code={`# Delete a specific pixel
delete_endpoint = f"https://pixe.la/v1/users/{USERNAME}/graphs/{GRAPH_ID}/{date_string}"

# DELETE request - no body needed
response = requests.delete(url=delete_endpoint, headers=headers)
print(response.text)

# HTTP Methods Summary:
# GET    - Read data (retrieve)
# POST   - Create new resource
# PUT    - Update existing resource
# DELETE - Remove resource`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">json= vs params=</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>json=</code> for POST/PUT body data, <code>params=</code> for URL query parameters.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Headers for Auth</h4>
                            <p className="text-sm text-surface-400">
                                Headers are more secure for tokens since they're not visible in URLs or server logs.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Pixela Date Format</h4>
                            <p className="text-sm text-surface-400">
                                Pixela requires dates as <code>yyyyMMdd</code> — use strftime("%Y%m%d").
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">String Quantities</h4>
                            <p className="text-sm text-surface-400">
                                Pixela quantities must be strings, even for numbers: <code>"quantity": "2.5"</code>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
