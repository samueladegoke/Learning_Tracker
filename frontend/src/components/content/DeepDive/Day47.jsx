import CodeBlock from '../../CodeBlock'
import { Lightbulb, ShoppingCart } from 'lucide-react'

export default function DeepDiveDay47() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <ShoppingCart className="w-6 h-6 text-primary-400" /> Amazon Price Tracker
                    </h2>
                    <p>
                        In Day 47, you build an <strong>automated price tracker</strong> that scrapes Amazon
                        product pages and sends you an email when the price drops below your target. This project
                        combines web scraping, HTTP headers, and email automation with SMTP.
                    </p>
                    <p className="text-amber-400 text-sm flex items-center gap-2">
                        <strong>⚠️ Note:</strong> Amazon actively blocks scrapers. Use proper headers and consider
                        using their practice site for testing. Respect robots.txt and rate limits.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> HTTP Headers
                    </h2>
                    <p>
                        When you make a request without headers, Amazon blocks it because it looks like a bot.
                        The most important header is <code>User-Agent</code>, which identifies your browser:
                    </p>
                    <CodeBlock code={`import requests

# Without headers - likely to be blocked
# response = requests.get(url)  # Returns 503 or CAPTCHA

# With headers - looks like a real browser
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9"
}

response = requests.get(url, headers=headers)
print(response.status_code)  # Should be 200`} language="python" />
                    <p className="text-surface-400 text-sm">
                        <strong>Tip:</strong> Get your browser's User-Agent by visiting <code>httpbin.org/headers</code>
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Scraping the Price
                    </h2>
                    <p>
                        Once you get the page, use Beautiful Soup to extract the product title and price.
                        Amazon's structure varies, so always inspect the actual page:
                    </p>
                    <CodeBlock code={`from bs4 import BeautifulSoup

url = "https://appbrewery.github.io/instant_pot/"  # Practice site
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.content, "lxml")

# Extract product title
title = soup.find(id="productTitle").getText().strip()
print(f"Product: {title}")

# Extract price (structure varies by page)
price_whole = soup.find(class_="a-price-whole")
price_fraction = soup.find(class_="a-price-fraction")

if price_whole:
    price_str = price_whole.getText() + price_fraction.getText()
    price = float(price_str.replace(",", ""))
    print(f"Price: ${price}")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Sending Email with SMTP
                    </h2>
                    <p>
                        Python's built-in <code>smtplib</code> lets you send emails. For Gmail, you need
                        to enable 2-Factor Authentication and create an "App Password":
                    </p>
                    <CodeBlock code={`import smtplib
import os

# Use environment variables for security!
MY_EMAIL = os.environ.get("MY_EMAIL")
MY_PASSWORD = os.environ.get("MY_PASSWORD")  # App Password, not regular password

def send_price_alert(product_title, current_price, url):
    """Send an email when price drops below target."""
    
    with smtplib.SMTP("smtp.gmail.com", 587) as connection:
        connection.starttls()  # Enable encryption
        connection.login(MY_EMAIL, MY_PASSWORD)
        
        subject = f"Price Alert: {product_title}"
        body = f"Low price alert!\\n\\n{product_title}\\nNow: ${current_price}\\n\\n{url}"
        
        connection.sendmail(
            from_addr=MY_EMAIL,
            to_addrs=MY_EMAIL,
            msg=f"Subject:{subject}\\n\\n{body}"
        )`} language="python" />
                    <p className="text-amber-400 text-sm">
                        <strong>Security:</strong> Never hardcode passwords! Use environment variables.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Complete Price Tracker
                    </h2>
                    <p>
                        Putting it all together—a script that checks the price and alerts you:
                    </p>
                    <CodeBlock code={`import requests
from bs4 import BeautifulSoup
import smtplib
import os

# Configuration
PRODUCT_URL = "https://appbrewery.github.io/instant_pot/"
TARGET_PRICE = 100.00

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    "Accept-Language": "en-US,en;q=0.9"
}

# Fetch and parse
response = requests.get(PRODUCT_URL, headers=HEADERS)
soup = BeautifulSoup(response.content, "lxml")

# Extract data
title = soup.find(id="productTitle").getText().strip()
price_elem = soup.find(class_="a-offscreen")
price = float(price_elem.getText().replace("$", "").replace(",", ""))

print(f"Product: {title}")
print(f"Current Price: ${price}")

# Check and alert
if price < TARGET_PRICE:
    print(f"Price is below ${TARGET_PRICE}! Sending alert...")
    
    with smtplib.SMTP("smtp.gmail.com", 587) as connection:
        connection.starttls()
        connection.login(os.environ["EMAIL"], os.environ["PASSWORD"])
        connection.sendmail(
            from_addr=os.environ["EMAIL"],
            to_addrs=os.environ["EMAIL"],
            msg=f"Subject:Price Alert!\\n\\n{title}\\nNow ${price}\\n{PRODUCT_URL}"
        )
    print("Alert sent!")
else:
    print(f"Price is still above ${TARGET_PRICE}")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Scheduling the Tracker
                    </h2>
                    <p>
                        To run the tracker periodically, you can use the <code>schedule</code> library
                        or a simple loop with <code>time.sleep()</code>:
                    </p>
                    <CodeBlock code={`import time
import schedule

def check_price():
    """Run the price check logic."""
    # ... (price checking code here)
    print("Checked price at", time.strftime("%H:%M"))

# Option 1: Using schedule library
schedule.every().day.at("09:00").do(check_price)

while True:
    schedule.run_pending()
    time.sleep(60)

# Option 2: Simple loop (check every hour)
# while True:
#     check_price()
#     time.sleep(3600)  # 3600 seconds = 1 hour`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Use lxml Parser</h4>
                            <p className="text-sm text-surface-400">
                                Install lxml: <code>pip install lxml</code>. It handles malformed HTML better than html.parser.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">App Passwords</h4>
                            <p className="text-sm text-surface-400">
                                Gmail requires an App Password when 2FA is enabled. Generate one in your Google Account settings.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Practice Site</h4>
                            <p className="text-sm text-surface-400">
                                Use the practice site at <code>appbrewery.github.io/instant_pot</code> to avoid Amazon's bot detection.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Environment Variables</h4>
                            <p className="text-sm text-surface-400">
                                Store credentials in <code>.env</code> files or system environment variables—never in code!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
