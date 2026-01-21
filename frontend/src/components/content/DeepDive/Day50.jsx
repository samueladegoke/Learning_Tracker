import CodeBlock from '../../CodeBlock'
import { Lightbulb, Heart } from 'lucide-react'

export default function DeepDiveDay50() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Heart className="w-6 h-6 text-primary-400" /> Auto Swiping Bot
                    </h2>
                    <p>
                        Day 50 builds an <strong>automated interaction bot</strong> that handles complex
                        scenarios like OAuth login popups, iframes, random modals, and multi-window navigation.
                        These are essential techniques for any real-world browser automation.
                    </p>
                    <p className="text-amber-400 text-sm flex items-center gap-2">
                        <strong>⚠️ Ethics Note:</strong> This is for learning automation techniques only.
                        Always respect Terms of Service and use automation responsibly.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Handling Multiple Windows
                    </h2>
                    <p>
                        When you click "Login with Facebook/Google," a popup window opens. You need to
                        switch to that window to interact with it:
                    </p>
                    <CodeBlock code={`from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get("https://example.com/login")

# Store the original window handle
main_window = driver.current_window_handle

# Click the "Login with Facebook" button
fb_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Facebook')]")
fb_button.click()

# Wait for popup to appear
WebDriverWait(driver, 10).until(lambda d: len(d.window_handles) > 1)

# Switch to the popup
for handle in driver.window_handles:
    if handle != main_window:
        driver.switch_to.window(handle)
        break

# Now interact with the Facebook login popup
email = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, "email"))
)
email.send_keys("your_email@example.com")

password = driver.find_element(By.ID, "pass")
password.send_keys("your_password")
password.submit()

# Switch back to main window after login
driver.switch_to.window(main_window)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Working with iFrames
                    </h2>
                    <p>
                        Some login forms are embedded in iframes. You must switch to the iframe before
                        accessing its elements:
                    </p>
                    <CodeBlock code={`from selenium.webdriver.common.by import By

# Find the iframe element
iframe = driver.find_element(By.TAG_NAME, "iframe")

# Switch to the iframe
driver.switch_to.frame(iframe)

# Now you can interact with elements inside the iframe
login_form = driver.find_element(By.ID, "login-form")
# ... fill the form

# Switch back to main content when done
driver.switch_to.default_content()

# Alternative: switch by name or index
driver.switch_to.frame("iframe-name")  # By name/id
driver.switch_to.frame(0)              # By index (first iframe)

# Parent frame (nested iframes)
driver.switch_to.parent_frame()        # Go up one level`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Dismissing Popups & Modals
                    </h2>
                    <p>
                        Websites often show popups for notifications, cookies, or promotions.
                        Handle them gracefully with try/except:
                    </p>
                    <CodeBlock code={`from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def dismiss_popups(driver):
    """Try to dismiss common popups that may appear."""
    popups = [
        (By.XPATH, "//button[contains(text(), 'Allow')]"),        # Location permission
        (By.XPATH, "//button[contains(text(), 'Not interested')]"), # Promo popup
        (By.XPATH, "//button[contains(text(), 'No Thanks')]"),    # Notifications
        (By.CSS_SELECTOR, "[aria-label='Close']"),                # Generic close
        (By.XPATH, "//button[contains(@class, 'dismiss')]"),
    ]
    
    for locator in popups:
        try:
            button = WebDriverWait(driver, 2).until(
                EC.element_to_be_clickable(locator)
            )
            button.click()
            print(f"Dismissed popup: {locator[1]}")
        except (NoSuchElementException, TimeoutException):
            pass  # Popup doesn't exist, continue

# Call periodically during automation
dismiss_popups(driver)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Automatic Swiping
                    </h2>
                    <p>
                        The main automation loop finds the interaction button and clicks repeatedly:
                    </p>
                    <CodeBlock code={`import time
from selenium.webdriver.common.by import By
from selenium.common.exceptions import ElementClickInterceptedException

def auto_swipe(driver, count=100):
    """Automatically swipe right on profiles."""
    swiped = 0
    
    for i in range(count):
        try:
            # Dismiss any popups first
            dismiss_popups(driver)
            
            # Find the like button (use actual selector)
            like_button = driver.find_element(
                By.CSS_SELECTOR, "[aria-label='Like']"
            )
            like_button.click()
            swiped += 1
            
            # Random delay to appear human
            import random
            time.sleep(random.uniform(0.5, 1.5))
            
        except ElementClickInterceptedException:
            # Something is blocking - try dismissing
            dismiss_popups(driver)
            time.sleep(1)
            
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(2)
    
    print(f"Swiped on {swiped} profiles")

# Run the bot
auto_swipe(driver, count=50)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Complete Bot Structure
                    </h2>
                    <p>
                        Here's the full structure bringing everything together:
                    </p>
                    <CodeBlock code={`from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import time
import os

# Helper: Dismiss common popups
def dismiss_popups(driver):
    """Try to dismiss any blocking popups."""
    popup_selectors = [
        "//button[contains(text(), 'No Thanks')]",
        "//button[contains(text(), 'Close')]",
        "[aria-label='Close']",
    ]
    for selector in popup_selectors:
        try:
            if selector.startswith("//"):
                btn = driver.find_element(By.XPATH, selector)
            else:
                btn = driver.find_element(By.CSS_SELECTOR, selector)
            btn.click()
        except:
            pass

# Setup Chrome options
options = Options()
options.add_experimental_option("prefs", {
    "profile.default_content_setting_values.notifications": 2,
    "profile.default_content_setting_values.geolocation": 2,
})

driver = webdriver.Chrome(options=options)

try:
    driver.get("https://example.com")
    wait = WebDriverWait(driver, 10)
    
    # Handle OAuth popup login
    main_window = driver.current_window_handle
    fb_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Facebook']")))
    fb_button.click()
    
    for handle in driver.window_handles:
        if handle != main_window:
            driver.switch_to.window(handle)
            break
    
    # Login using environment variables
    wait.until(EC.presence_of_element_located((By.ID, "email"))).send_keys(os.environ["FB_EMAIL"])
    driver.find_element(By.ID, "pass").send_keys(os.environ["FB_PASS"])
    driver.find_element(By.NAME, "login").click()
    
    time.sleep(3)
    driver.switch_to.window(main_window)
    
    # Main automation loop
    for i in range(100):
        dismiss_popups(driver)
        # ... add your interaction logic here
        
finally:
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Window Handles</h4>
                            <p className="text-sm text-surface-400">
                                Save the original handle before clicking OAuth buttons so you can switch back.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Random Delays</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>random.uniform(0.5, 1.5)</code> for varied delays that appear more human.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Try/Except Everything</h4>
                            <p className="text-sm text-surface-400">
                                Popups appear randomly. Wrap all popup dismissal in try/except blocks.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Respect ToS</h4>
                            <p className="text-sm text-surface-400">
                                Automation should be used responsibly. Always check Terms of Service.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
