import CodeBlock from '../../CodeBlock'
import { Lightbulb, Database } from 'lucide-react'

export default function DeepDiveDay53() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Database className="w-6 h-6 text-primary-400" /> Data Entry Job Automation
                    </h2>
                    <p>
                        Day 53 is a <strong>capstone project</strong> that combines web scraping (BeautifulSoup)
                        with browser automation (Selenium) to scrape property listings and automatically
                        enter them into a Google Form — the kind of repetitive task that can be fully automated!
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Scraping Property Listings
                    </h2>
                    <p>
                        Use BeautifulSoup to extract property data from a listings website:
                    </p>
                    <CodeBlock code={`import requests
from bs4 import BeautifulSoup

# Use headers to avoid being blocked
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0",
    "Accept-Language": "en-US,en;q=0.9"
}

def scrape_listings(url):
    """Scrape property listings from URL."""
    response = requests.get(url, headers=HEADERS)
    soup = BeautifulSoup(response.text, "html.parser")
    
    # Find all listing cards (adjust selectors for target site)
    cards = soup.find_all("div", class_="listing-card")
    
    listings = []
    for card in cards:
        listing = {
            "address": card.find("address").text.strip(),
            "price": card.find("span", class_="price").text.strip(),
            "link": card.find("a")["href"]
        }
        listings.append(listing)
    
    return listings`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Cleaning the Data
                    </h2>
                    <p>
                        Property data often needs cleaning before it's useful:
                    </p>
                    <CodeBlock code={`import re

def clean_price(price_str):
    """Extract numeric value from price string."""
    # Remove $, commas, '/mo', etc.
    # "$1,200/mo" -> "1200"
    numbers = re.findall(r'\\d+', price_str.replace(',', ''))
    return ''.join(numbers) if numbers else price_str

def clean_address(address_str):
    """Normalize address formatting."""
    # Remove extra whitespace and newlines
    return ' '.join(address_str.split())

def clean_link(link, base_url):
    """Ensure absolute URL."""
    if link.startswith('/'):
        return base_url + link
    return link

# Apply cleaning to all listings
for listing in listings:
    listing['price'] = clean_price(listing['price'])
    listing['address'] = clean_address(listing['address'])
    listing['link'] = clean_link(listing['link'], "https://example.com")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Setting Up Google Form Automation
                    </h2>
                    <p>
                        Use Selenium to navigate to your Google Form and fill it out:
                    </p>
                    <CodeBlock code={`from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

FORM_URL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform"

class FormFiller:
    def __init__(self):
        self.driver = webdriver.Chrome()
        self.wait = WebDriverWait(self.driver, 10)
    
    def open_form(self):
        """Navigate to the Google Form."""
        self.driver.get(FORM_URL)
        time.sleep(2)
    
    def close(self):
        self.driver.quit()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Filling and Submitting the Form
                    </h2>
                    <p>
                        Enter data into each form field and submit:
                    </p>
                    <CodeBlock code={`def fill_form(self, listing):
    """Fill form with listing data and submit."""
    # Google Forms uses specific class names for inputs
    inputs = self.driver.find_elements(
        By.CSS_SELECTOR, 'input[type="text"]'
    )
    
    # Assuming form has: Address, Price, Link (in order)
    inputs[0].send_keys(listing['address'])
    inputs[1].send_keys(listing['price'])
    inputs[2].send_keys(listing['link'])
    
    # Click Submit button
    submit_btn = self.driver.find_element(
        By.XPATH, "//span[text()='Submit']"
    )
    submit_btn.click()
    time.sleep(1)

def submit_another(self):
    """Click 'Submit another response' link."""
    try:
        another_link = self.wait.until(
            EC.element_to_be_clickable(
                (By.LINK_TEXT, "Submit another response")
            )
        )
        another_link.click()
        time.sleep(1)
    except:
        # Fallback: reload the form
        self.open_form()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Complete Workflow
                    </h2>
                    <p>
                        Putting scraping and form filling together:
                    </p>
                    <CodeBlock code={`def main():
    # Step 1: Scrape listings
    listings = scrape_listings("https://zillow-clone-site.com/listings")
    print(f"Found {len(listings)} listings")
    
    # Step 2: Clean the data
    for listing in listings:
        listing['price'] = clean_price(listing['price'])
        listing['address'] = clean_address(listing['address'])
    
    # Step 3: Fill Google Form for each listing
    filler = FormFiller()
    
    try:
        for i, listing in enumerate(listings, 1):
            filler.open_form()
            filler.fill_form(listing)
            print(f"Submitted {i}/{len(listings)}: {listing['address']}")
            filler.submit_another()
    finally:
        filler.close()
    
    print("All listings submitted!")

if __name__ == "__main__":
    main()`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">User-Agent Headers</h4>
                            <p className="text-sm text-surface-400">
                                Always include browser-like headers. Many sites block requests without them.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">CSS Selectors</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>soup.select()</code> for complex queries like nested elements.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Form Input Order</h4>
                            <p className="text-sm text-surface-400">
                                Google Forms inputs are in DOM order. Verify by inspecting the form.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Error Handling</h4>
                            <p className="text-sm text-surface-400">
                                Wrap form filling in try/except to handle individual failures gracefully.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
