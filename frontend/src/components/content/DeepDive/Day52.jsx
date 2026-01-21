import CodeBlock from '../../CodeBlock'
import { Lightbulb, Users } from 'lucide-react'

export default function DeepDiveDay52() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary-400" /> Instagram Follower Bot
                    </h2>
                    <p>
                        Day 52 builds an <strong>Instagram follower bot</strong> that finds followers of a
                        target account (like a competitor) and follows them. This leverages the
                        "follow-back" strategy many users employ.
                    </p>
                    <p className="text-amber-400 text-sm flex items-center gap-2">
                        <strong>⚠️ Ethics Note:</strong> Instagram prohibits automation. This is for learning only.
                        Accounts using bots risk suspension.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Bot Class Setup
                    </h2>
                    <p>
                        Create a class to manage the browser session and credentials:
                    </p>
                    <CodeBlock code={`from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import ElementClickInterceptedException
import time
import os

class InstaFollower:
    def __init__(self):
        self.driver = webdriver.Chrome()
        self.wait = WebDriverWait(self.driver, 10)
    
    def close(self):
        self.driver.quit()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Login to Instagram
                    </h2>
                    <p>
                        Handle the Instagram login flow and dismiss any popups:
                    </p>
                    <CodeBlock code={`def login(self):
    """Log into Instagram with credentials from environment."""
    self.driver.get("https://www.instagram.com/accounts/login/")
    time.sleep(3)
    
    # Accept cookies if prompted
    try:
        cookies_btn = self.driver.find_element(
            By.XPATH, "//button[text()='Allow all cookies']"
        )
        cookies_btn.click()
    except:
        pass
    
    # Enter credentials
    username_input = self.wait.until(
        EC.presence_of_element_located((By.NAME, "username"))
    )
    username_input.send_keys(os.environ["INSTAGRAM_USER"])
    
    password_input = self.driver.find_element(By.NAME, "password")
    password_input.send_keys(os.environ["INSTAGRAM_PASS"])
    
    # Submit login
    login_btn = self.driver.find_element(
        By.XPATH, "//button[@type='submit']"
    )
    login_btn.click()
    time.sleep(5)
    
    # Dismiss "Save Login Info" popup
    self._dismiss_popup("Not Now")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Finding Target Account's Followers
                    </h2>
                    <p>
                        Navigate to a target account and open their followers modal:
                    </p>
                    <CodeBlock code={`def find_followers(self, target_account):
    """Navigate to target and open followers modal."""
    self.driver.get(f"https://www.instagram.com/{target_account}/")
    time.sleep(3)
    
    # Click on "followers" link
    followers_link = self.wait.until(
        EC.element_to_be_clickable(
            (By.XPATH, f"//a[contains(@href, '/{target_account}/followers')]")
        )
    )
    followers_link.click()
    time.sleep(2)
    
    # Get the scrollable modal
    modal = self.wait.until(
        EC.presence_of_element_located(
            (By.XPATH, "//div[@class='_aano']")  # Modal container
        )
    )
    
    # Scroll to load more followers
    for _ in range(5):  # Adjust based on how many you want
        self.driver.execute_script(
            "arguments[0].scrollTop = arguments[0].scrollHeight",
            modal
        )
        time.sleep(2)
    
    return modal`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Following Users
                    </h2>
                    <p>
                        Find and click all the Follow buttons with appropriate delays:
                    </p>
                    <CodeBlock code={`def follow_all(self):
    """Click all visible Follow buttons."""
    follow_buttons = self.driver.find_elements(
        By.XPATH, "//button[.//div[text()='Follow']]"
    )
    
    followed = 0
    for button in follow_buttons:
        try:
            button.click()
            followed += 1
            print(f"Followed {followed} users")
            
            # Random delay to appear human
            import random
            time.sleep(random.uniform(1, 3))
            
        except ElementClickInterceptedException:
            # Popup blocking - try to dismiss
            self._dismiss_popup("Cancel")
            time.sleep(1)
            
        except Exception as e:
            print(f"Could not follow: {e}")
            continue
    
    print(f"Successfully followed {followed} users")
    return followed`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Complete Usage
                    </h2>
                    <p>
                        Putting it all together:
                    </p>
                    <CodeBlock code={`def _dismiss_popup(self, button_text):
    """Try to dismiss popups with given button text."""
    try:
        button = self.wait.until(
            EC.element_to_be_clickable(
                (By.XPATH, f"//button[text()='{button_text}']")
            )
        )
        button.click()
    except:
        pass  # Popup not present

# Main execution
if __name__ == "__main__":
    bot = InstaFollower()
    
    try:
        bot.login()
        bot.find_followers("target_account_username")
        bot.follow_all()
    finally:
        bot.close()`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Rate Limits</h4>
                            <p className="text-sm text-surface-400">
                                Instagram limits ~20-50 follows/hour. Exceeding this triggers temporary blocks.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Modal Scrolling</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>scrollTop</code> on the modal element, not <code>window.scrollTo</code>.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Stale Elements</h4>
                            <p className="text-sm text-surface-400">
                                Re-fetch elements after scrolling. The DOM changes as new users load.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Random Delays</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>random.uniform(1, 3)</code> for varied, human-like timing.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
