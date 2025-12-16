import CodeBlock from '../../CodeBlock'
import { Lightbulb, Bot } from 'lucide-react'

export default function DeepDiveDay48() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Bot className="w-6 h-6 text-primary-400" /> Selenium WebDriver
                    </h2>
                    <p>
                        Day 48 introduces <strong>Selenium WebDriver</strong>—a powerful tool for automating
                        browser interactions. Unlike Beautiful Soup, Selenium runs a real browser, letting you
                        click buttons, fill forms, and interact with JavaScript-rendered content.
                    </p>
                    <p className="text-amber-400 text-sm flex items-center gap-2">
                        <strong>⚠️ Note:</strong> Selenium 4+ handles driver management automatically.
                        No need to download chromedriver manually!
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Setting Up Selenium
                    </h2>
                    <p>
                        Install Selenium and create your first browser automation:
                    </p>
                    <CodeBlock code={`# Install Selenium
# pip install selenium

from selenium import webdriver
from selenium.webdriver.common.by import By

# Selenium 4+ auto-manages the driver!
driver = webdriver.Chrome()

# Navigate to a website
driver.get("https://www.python.org")

# Get page title
print(driver.title)  # "Welcome to Python.org"

# Close the browser when done
driver.quit()`} language="python" />
                    <p className="text-surface-400 text-sm">
                        <strong>Selenium 4+:</strong> No need to download chromedriver! The browser
                        automatically manages its own driver.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Finding Elements
                    </h2>
                    <p>
                        Selenium 4 uses the <code>By</code> class for locating elements. Common locators include
                        ID, class name, CSS selector, and XPath:
                    </p>
                    <CodeBlock code={`from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://www.python.org")

# Find by ID (most reliable)
search_bar = driver.find_element(By.ID, "id-search-field")

# Find by CSS selector
logo = driver.find_element(By.CSS_SELECTOR, ".python-logo")

# Find by class name
menu = driver.find_element(By.CLASS_NAME, "navigation")

# Find by tag name
links = driver.find_elements(By.TAG_NAME, "a")  # Returns list

# Find by link text
docs_link = driver.find_element(By.LINK_TEXT, "Documentation")

# Find by XPath (most flexible)
event = driver.find_element(By.XPATH, "//div[@class='event-widget']//li/a")

print(f"Found {len(links)} links on the page")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> XPath Basics
                    </h2>
                    <p>
                        XPath is a powerful query language for navigating HTML. Here are common patterns:
                    </p>
                    <CodeBlock code={`# XPath Syntax Reference

# Select all divs
"//div"

# Select div with specific class
"//div[@class='container']"

# Select div with ID
"//div[@id='main']"

# Select anchor inside a specific div
"//div[@class='nav']//a"

# Select by text content
"//a[text()='Submit']"

# Select by partial text
"//a[contains(text(), 'Learn')]"

# Select by partial attribute
"//a[contains(@href, 'python')]"

# Select first item
"(//li)[1]"

# Select child elements
"//ul/li"  # Direct children only
"//ul//li" # All descendants

# Example: Get upcoming events from python.org
events = driver.find_elements(By.XPATH, "//ul[@class='list-recent-events']//a")
for event in events:
    print(f"{event.text}: {event.get_attribute('href')}")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Interacting with Elements
                    </h2>
                    <p>
                        Selenium lets you click buttons, fill forms, and submit data:
                    </p>
                    <CodeBlock code={`from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

driver = webdriver.Chrome()
driver.get("https://www.python.org")

# Find the search box
search = driver.find_element(By.NAME, "q")

# Type into it
search.send_keys("selenium")

# Press Enter to submit
search.send_keys(Keys.ENTER)

# Or find and click a button
# button = driver.find_element(By.ID, "submit")
# button.click()

# Clear an input field
# search.clear()

# Get text from an element
result = driver.find_element(By.CSS_SELECTOR, ".list-links li a")
print(result.text)

# Get an attribute
href = result.get_attribute("href")
print(href)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Cookie Clicker Bot
                    </h2>
                    <p>
                        The Day 48 project is a bot for the Cookie Clicker game. Here's a basic structure:
                    </p>
                    <CodeBlock code={`from selenium import webdriver
from selenium.webdriver.common.by import By
import time

driver = webdriver.Chrome()
driver.get("https://orteil.dashnet.org/experiments/cookie/")

# Find the cookie element
cookie = driver.find_element(By.ID, "cookie")

# Game loop
timeout = time.time() + 60  # Run for 60 seconds
check_time = time.time() + 5  # Check upgrades every 5 seconds

while time.time() < timeout:
    # Click the cookie
    cookie.click()
    
    # Every 5 seconds, buy best available upgrade
    if time.time() > check_time:
        # Find available upgrades
        store = driver.find_elements(By.CSS_SELECTOR, "#store div")
        
        for item in reversed(store):  # Start from most expensive
            # Check if we can afford it (not greyed out)
            if "grayed" not in item.get_attribute("class"):
                item.click()
                break
        
        check_time = time.time() + 5

# Get final score
score = driver.find_element(By.ID, "money").text
print(f"Final Score: {score}")

driver.quit()`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Use By Class</h4>
                            <p className="text-sm text-surface-400">
                                Always import <code>By</code> for Selenium 4: <code>from selenium.webdriver.common.by import By</code>
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">ID is Best</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>By.ID</code> when possible—IDs are unique and the most reliable locator.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Copy XPath</h4>
                            <p className="text-sm text-surface-400">
                                Right-click any element in DevTools → Copy → Copy XPath for quick locators.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">quit() vs close()</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>driver.quit()</code> to close all windows and end session properly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
