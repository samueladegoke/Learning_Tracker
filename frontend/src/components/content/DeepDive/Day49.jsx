import CodeBlock from '../../CodeBlock'
import { Lightbulb, Calendar } from 'lucide-react'

export default function DeepDiveDay49() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-primary-400" /> Automated Gym Booking Bot
                    </h2>
                    <p>
                        Day 49 takes Selenium automation to the next level with a <strong>gym class booking bot</strong>.
                        You'll learn to use Chrome profiles for persistent sessions, WebDriverWait for reliable
                        element handling, and implement resilient error handling for production-quality automation.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Chrome Profiles
                    </h2>
                    <p>
                        Using a Chrome profile lets you persist cookies and login sessions. This means you
                        won't have to log in every time you run your script:
                    </p>
                    <CodeBlock code={`from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# Create Chrome options
options = Options()

# Point to your Chrome profile directory
# Windows: C:\\Users\\YourName\\AppData\\Local\\Google\\Chrome\\User Data
# Mac: /Users/YourName/Library/Application Support/Google/Chrome
options.add_argument("--user-data-dir=C:/Users/YourName/ChromeProfile")
options.add_argument("--profile-directory=Profile 1")  # Optional: specific profile

# Create driver with options
driver = webdriver.Chrome(options=options)

# Now your bookmarks, cookies, and logins are available!
driver.get("https://your-gym-website.com")
# If you logged in before, you'll still be logged in`} language="python" />
                    <p className="text-amber-400 text-sm">
                        <strong>Important:</strong> Close all Chrome windows before running Selenium with a profile.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> WebDriverWait & Expected Conditions
                    </h2>
                    <p>
                        <code>WebDriverWait</code> is much better than <code>time.sleep()</code> because it
                        proceeds as soon as the condition is met, not after a fixed delay:
                    </p>
                    <CodeBlock code={`from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://your-gym-website.com/classes")

# Wait up to 10 seconds for element to be clickable
wait = WebDriverWait(driver, 10)

# Wait for login button to be clickable
login_btn = wait.until(
    EC.element_to_be_clickable((By.ID, "login-button"))
)
login_btn.click()

# Common Expected Conditions:
# EC.presence_of_element_located()    - Element exists in DOM
# EC.visibility_of_element_located()  - Element is visible
# EC.element_to_be_clickable()        - Element is visible and enabled
# EC.text_to_be_present_in_element()  - Element contains specific text
# EC.invisibility_of_element()        - Element is not visible (good for loaders)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Automated Login
                    </h2>
                    <p>
                        Automate the login process by finding form fields and submitting credentials:
                    </p>
                    <CodeBlock code={`import os
from selenium.webdriver.common.keys import Keys

# Get credentials from environment variables
EMAIL = os.environ.get("GYM_EMAIL")
PASSWORD = os.environ.get("GYM_PASSWORD")

def login(driver, wait):
    """Log into the gym website."""
    # Click login link
    login_link = wait.until(
        EC.element_to_be_clickable((By.LINK_TEXT, "Sign In"))
    )
    login_link.click()
    
    # Wait for form and fill it
    email_field = wait.until(
        EC.presence_of_element_located((By.ID, "email"))
    )
    email_field.send_keys(EMAIL)
    
    password_field = driver.find_element(By.ID, "password")
    password_field.send_keys(PASSWORD)
    password_field.send_keys(Keys.ENTER)  # Submit form
    
    # Wait for login to complete
    wait.until(EC.presence_of_element_located((By.CLASS_NAME, "user-dashboard")))`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Booking Classes
                    </h2>
                    <p>
                        Find available classes and click the book buttons:
                    </p>
                    <CodeBlock code={`def book_classes(driver, wait, target_day="Tuesday"):
    """Book all classes for a specific day."""
    booked = 0
    skipped = 0
    
    # Find all class cards
    classes = driver.find_elements(By.CLASS_NAME, "class-card")
    
    for class_card in classes:
        # Check if it's the right day
        day = class_card.find_element(By.CLASS_NAME, "day").text
        if target_day not in day:
            continue
        
        # Check if already booked
        book_btn = class_card.find_element(By.CLASS_NAME, "book-btn")
        if "booked" in book_btn.text.lower():
            skipped += 1
            continue
        
        # Try to book
        try:
            book_btn.click()
            
            # Handle confirmation popup if it appears
            confirm = wait.until(
                EC.element_to_be_clickable((By.ID, "confirm"))
            )
            confirm.click()
            
            booked += 1
        except Exception as e:
            print(f"Could not book class: {e}")
    
    print(f"Booked: {booked}, Already booked: {skipped}")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Resilient Error Handling
                    </h2>
                    <p>
                        Production automation needs to handle network failures, missing elements, and other issues:
                    </p>
                    <CodeBlock code={`from selenium.common.exceptions import (
    NoSuchElementException, 
    TimeoutException,
    StaleElementReferenceException
)
import time

def click_with_retry(driver, locator, max_retries=3):
    """Click an element with retry logic for resilience."""
    for attempt in range(max_retries):
        try:
            element = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable(locator)
            )
            element.click()
            return True
        except StaleElementReferenceException:
            # DOM changed, try again
            print(f"Stale element, retry {attempt + 1}")
            time.sleep(1)
        except TimeoutException:
            print(f"Timeout waiting for element, retry {attempt + 1}")
            driver.refresh()
            time.sleep(2)
        except Exception as e:
            print(f"Error: {e}")
            if attempt == max_retries - 1:
                raise
    return False

# Usage
try:
    click_with_retry(driver, (By.ID, "book-button"))
except Exception as e:
    print(f"Failed after all retries: {e}")`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Close Chrome First</h4>
                            <p className="text-sm text-surface-400">
                                When using a Chrome profile, close all Chrome windows before running your script.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Explicit > Implicit</h4>
                            <p className="text-sm text-surface-400">
                                Prefer <code>WebDriverWait</code> over implicit waits—it's more precise and flexible.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Re-find After DOM Changes</h4>
                            <p className="text-sm text-surface-400">
                                If clicking changes the page, re-find elements to avoid <code>StaleElementReferenceException</code>.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Use Counters</h4>
                            <p className="text-sm text-surface-400">
                                Track bookings, skips, and failures with counters for a clear summary at the end.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
