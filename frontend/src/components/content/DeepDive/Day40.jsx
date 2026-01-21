import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Users, Bell, Mail, Globe, Lightbulb } from 'lucide-react'

export default function DeepDiveDay40() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary-400" /> Flight Deal Finder - Part 2
                    </h2>
                    <p>
                        Day 40 extends the Flight Deal Finder into a <strong>Flight Club</strong> with user
                        management, email notifications, and deal verification. You'll add a notification
                        system that alerts users when flights are cheaper than their target price.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> NotificationManager Class
                    </h2>
                    <p>
                        Create a <code>NotificationManager</code> to handle sending deal alerts via SMS and email.
                    </p>
                    <CodeBlock code={`import smtplib
from twilio.rest import Client
import os

class NotificationManager:
    def __init__(self):
        self.twilio_sid = os.environ.get("TWILIO_ACCOUNT_SID")
        self.twilio_auth = os.environ.get("TWILIO_AUTH_TOKEN")
        self.twilio_number = os.environ.get("TWILIO_PHONE_NUMBER")
        self.email = os.environ.get("MY_EMAIL")
        self.email_password = os.environ.get("MY_EMAIL_PASSWORD")
    
    def send_sms(self, message, phone_number):
        client = Client(self.twilio_sid, self.twilio_auth)
        message = client.messages.create(
            body=message,
            from_=self.twilio_number,
            to=phone_number
        )
        print(f"SMS sent: {message.status}")
    
    def send_emails(self, emails, message):
        with smtplib.SMTP("smtp.gmail.com", 587) as connection:
            connection.starttls()
            connection.login(self.email, self.email_password)
            for email in emails:
                connection.sendmail(
                    self.email,
                    email,
                    msg=f"Subject:New Low Price Flight!\\n\\n{message}".encode('utf-8')
                )
        print(f"Emails sent to {len(emails)} users")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> User Management
                    </h2>
                    <p>
                        Add a second sheet for <strong>Flight Club members</strong> with their email addresses.
                        Extend DataManager to handle user data.
                    </p>
                    <CodeBlock code={`class DataManager:
    def __init__(self):
        self.destination_data = {}
        self.customer_data = {}
        self.prices_endpoint = os.environ.get("SHEETY_PRICES_ENDPOINT")
        self.users_endpoint = os.environ.get("SHEETY_USERS_ENDPOINT")
    
    def get_customer_emails(self):
        """Fetch all customer emails from the users sheet"""
        response = requests.get(self.users_endpoint, headers=self.headers)
        data = response.json()
        self.customer_data = data["users"]
        return self.customer_data
    
    def add_customer(self, first_name, last_name, email):
        """Add a new Flight Club member"""
        new_user = {
            "user": {
                "firstName": first_name,
                "lastName": last_name,
                "email": email
            }
        }
        response = requests.post(
            self.users_endpoint, 
            json=new_user, 
            headers=self.headers
        )
        return response.json()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> User Registration
                    </h2>
                    <p>
                        Create a simple registration flow for new Flight Club members.
                    </p>
                    <CodeBlock code={`# registration.py
from data_manager import DataManager

print("Welcome to the Flight Club!")
print("We find the best flight deals and email you.")

first_name = input("What is your first name? ")
last_name = input("What is your last name? ")

while True:
    email = input("What is your email? ")
    email_confirm = input("Type your email again: ")
    
    if email == email_confirm:
        break
    print("Emails don't match. Try again.")

data_manager = DataManager()
result = data_manager.add_customer(first_name, last_name, email)

print("You're in the club!")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Deal Detection & Alert
                    </h2>
                    <p>
                        When a flight is cheaper than the target price, send notifications to all members.
                    </p>
                    <CodeBlock code={`from flight_data import find_cheapest_flight

notification_manager = NotificationManager()

for destination in sheet_data:
    flight_data = flight_search.check_flights(
        ORIGIN_CODE,
        destination["iataCode"],
        tomorrow.strftime("%d/%m/%Y"),
        six_months.strftime("%d/%m/%Y")
    )
    
    cheapest = find_cheapest_flight(flight_data)
    
    if cheapest is None:
        continue
    
    # Check if flight is cheaper than target price
    if cheapest.price < destination["lowestPrice"]:
        message = f"""
Low price alert! Only £{cheapest.price} to fly from 
{cheapest.origin_city}-{cheapest.origin_airport} to 
{cheapest.destination_city}-{cheapest.destination_airport}, 
from {cheapest.out_date} to {cheapest.return_date}.
"""
        # Get all customer emails
        customers = data_manager.get_customer_emails()
        email_list = [customer["email"] for customer in customers]
        
        # Send notifications
        notification_manager.send_emails(email_list, message)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Handling Stopovers
                    </h2>
                    <p>
                        If no direct flights are found, expand search to include flights with up to 2 stopovers.
                    </p>
                    <CodeBlock code={`def check_flights(self, origin, destination, from_date, to_date, max_stopovers=0):
    """Search with configurable stopovers"""
    query = {
        "fly_from": origin,
        "fly_to": destination,
        "date_from": from_date,
        "date_to": to_date,
        "max_stopovers": max_stopovers,
        # ... other params
    }
    return requests.get(self.search_endpoint, params=query, headers=self.headers).json()

# In main.py - fallback to stopover flights
cheapest = find_cheapest_flight(flight_data)

if cheapest is None:
    # Try again with stopovers
    flight_data = flight_search.check_flights(
        ORIGIN_CODE,
        destination["iataCode"],
        tomorrow.strftime("%d/%m/%Y"),
        six_months.strftime("%d/%m/%Y"),
        max_stopovers=2  # Allow up to 2 stopovers
    )
    cheapest = find_cheapest_flight(flight_data)
    if cheapest:
        cheapest.stops = 2  # Mark as having stopovers`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Email Validation</h4>
                            <p className="text-sm text-surface-400">
                                Always ask users to confirm their email by typing it twice to prevent typos.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">encode('utf-8')</h4>
                            <p className="text-sm text-surface-400">
                                Encode email messages as UTF-8 to handle special characters like £ or city names.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Fallback Search</h4>
                            <p className="text-sm text-surface-400">
                                If no direct flights exist, search again allowing stopovers before giving up.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Batch Email Sending</h4>
                            <p className="text-sm text-surface-400">
                                Reuse the SMTP connection for multiple emails instead of reconnecting each time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
