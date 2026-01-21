import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Plane, Server, Layers, Search, Lightbulb } from 'lucide-react'

export default function DeepDiveDay39() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Plane className="w-6 h-6 text-primary-400" /> Flight Deal Finder - Part 1
                    </h2>
                    <p>
                        Day 39 begins a <strong>capstone project</strong>: building a Flight Deal Finder.
                        This two-day project uses OOP architecture with multiple modules, the Tequila API
                        for flight data, and Sheety for destination management.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Project Architecture
                    </h2>
                    <p>
                        Structure the project with <strong>separate modules</strong> for different responsibilities.
                        This makes the code maintainable and testable.
                    </p>
                    <CodeBlock code={`# Project structure:
flight-deals/
├── main.py              # Entry point
├── data_manager.py      # Handles sheet data (Sheety API)
├── flight_search.py     # Searches for flights (Tequila API)
├── flight_data.py       # Data structure for flights
└── notification_manager.py  # Sends alerts (SMS/Email)

# Each module has a single responsibility:
# - DataManager: CRUD operations on destination sheet
# - FlightSearch: Query flight APIs
# - FlightData: Find cheapest flight from results
# - NotificationManager: Send deal notifications`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> DataManager Class
                    </h2>
                    <p>
                        The <code>DataManager</code> reads destination data from Google Sheets and updates
                        it with IATA codes if missing.
                    </p>
                    <CodeBlock code={`import requests
import os

class DataManager:
    def __init__(self):
        self.destination_data = {}
        self.sheety_endpoint = os.environ.get("SHEETY_PRICES_ENDPOINT")
        self.headers = {
            "Authorization": f"Bearer {os.environ.get('SHEETY_TOKEN')}"
        }
    
    def get_destination_data(self):
        response = requests.get(self.sheety_endpoint, headers=self.headers)
        data = response.json()
        self.destination_data = data["prices"]
        return self.destination_data
    
    def update_destination_codes(self):
        for city in self.destination_data:
            new_data = {
                "price": {
                    "iataCode": city["iataCode"]
                }
            }
            response = requests.put(
                f"{self.sheety_endpoint}/{city['id']}",
                json=new_data,
                headers=self.headers
            )
            print(response.text)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> FlightSearch Class
                    </h2>
                    <p>
                        The <code>FlightSearch</code> uses the <strong>Tequila/Kiwi API</strong> to search for
                        flights and get IATA city codes.
                    </p>
                    <CodeBlock code={`class FlightSearch:
    def __init__(self):
        self.tequila_endpoint = "https://api.tequila.kiwi.com"
        self.headers = {
            "apikey": os.environ.get("TEQUILA_API_KEY")
        }
    
    def get_destination_code(self, city_name):
        """Get IATA code for a city name"""
        location_endpoint = f"{self.tequila_endpoint}/locations/query"
        query = {
            "term": city_name,
            "location_types": "city"
        }
        response = requests.get(location_endpoint, params=query, headers=self.headers)
        results = response.json()["locations"]
        code = results[0]["code"]
        return code
    
    def check_flights(self, origin_code, destination_code, from_date, to_date):
        """Search for flights between dates"""
        search_endpoint = f"{self.tequila_endpoint}/v2/search"
        query = {
            "fly_from": origin_code,
            "fly_to": destination_code,
            "date_from": from_date,
            "date_to": to_date,
            "nights_in_dst_from": 7,
            "nights_in_dst_to": 28,
            "flight_type": "round",
            "one_for_city": 1,
            "max_stopovers": 0,
            "curr": "GBP"
        }
        response = requests.get(search_endpoint, params=query, headers=self.headers)
        return response.json()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> FlightData Class
                    </h2>
                    <p>
                        The <code>FlightData</code> class structures flight information and finds the cheapest option.
                    </p>
                    <CodeBlock code={`class FlightData:
    def __init__(self, price, origin_city, origin_airport, 
                 destination_city, destination_airport,
                 out_date, return_date):
        self.price = price
        self.origin_city = origin_city
        self.origin_airport = origin_airport
        self.destination_city = destination_city
        self.destination_airport = destination_airport
        self.out_date = out_date
        self.return_date = return_date


def find_cheapest_flight(data):
    """Parse API response and return FlightData for cheapest flight"""
    if data is None or data.get("data") is None:
        return None
    
    first_flight = data["data"][0]
    lowest_price = first_flight["price"]
    
    cheapest_flight = FlightData(
        price=first_flight["price"],
        origin_city=first_flight["route"][0]["cityFrom"],
        origin_airport=first_flight["route"][0]["flyFrom"],
        destination_city=first_flight["route"][0]["cityTo"],
        destination_airport=first_flight["route"][0]["flyTo"],
        out_date=first_flight["route"][0]["local_departure"].split("T")[0],
        return_date=first_flight["route"][1]["local_departure"].split("T")[0]
    )
    
    return cheapest_flight`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Main Application Flow
                    </h2>
                    <p>
                        The main script orchestrates all modules to find flight deals.
                    </p>
                    <CodeBlock code={`# main.py
from data_manager import DataManager
from flight_search import FlightSearch
from datetime import datetime, timedelta

data_manager = DataManager()
flight_search = FlightSearch()

# Get destinations from sheet
sheet_data = data_manager.get_destination_data()

# Fill in missing IATA codes
for row in sheet_data:
    if row["iataCode"] == "":
        row["iataCode"] = flight_search.get_destination_code(row["city"])
data_manager.destination_data = sheet_data
data_manager.update_destination_codes()

# Search dates: tomorrow to 6 months
tomorrow = datetime.now() + timedelta(days=1)
six_months = datetime.now() + timedelta(days=180)

ORIGIN_CODE = "LON"  # Your home city

for destination in sheet_data:
    flight = flight_search.check_flights(
        ORIGIN_CODE,
        destination["iataCode"],
        tomorrow.strftime("%d/%m/%Y"),
        six_months.strftime("%d/%m/%Y")
    )
    # Process and check for deals...`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Separation of Concerns</h4>
                            <p className="text-sm text-surface-400">
                                Each class handles one thing: data, search, results, notifications. Easier to debug!
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">IATA Codes</h4>
                            <p className="text-sm text-surface-400">
                                IATA codes are 3-letter airport/city codes (e.g., LON for London, PAR for Paris).
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Flight API Date Format</h4>
                            <p className="text-sm text-surface-400">
                                Tequila uses dd/mm/YYYY format for dates. Use strftime("%d/%m/%Y").
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">one_for_city=1</h4>
                            <p className="text-sm text-surface-400">
                                Returns only the cheapest flight for each destination, saving API quota.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
