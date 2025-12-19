import CodeBlock from '../../CodeBlock'
import { Lightbulb, Wifi } from 'lucide-react'

export default function DeepDiveDay51() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Wifi className="w-6 h-6 text-primary-400" /> Internet Speed Twitter Complaint Bot
                    </h2>
                    <p>
                        Day 51 builds an <strong>automated complaint bot</strong> that tests your internet speed
                        and tweets at your ISP if it's below what you're paying for. This combines the
                        speedtest-cli library with Selenium's Twitter automation.
                    </p>
                    <p className="text-amber-400 text-sm flex items-center gap-2">
                        <strong>⚠️ Ethics Note:</strong> Use responsibly. Check Twitter's Terms of Service
                        and avoid spamming.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Testing Internet Speed
                    </h2>
                    <p>
                        Use the <code>speedtest-cli</code> library to measure your download and upload speeds
                        programmatically:
                    </p>
                    <CodeBlock code={`import speedtest

# Create a Speedtest object
st = speedtest.Speedtest()

# Find the best server based on latency
st.get_best_server()

# Run speed tests (returns bits per second)
download_speed = st.download()
upload_speed = st.upload()

# Convert to Mbps for readability
download_mbps = download_speed / 1_000_000
upload_mbps = upload_speed / 1_000_000

print(f"Download: {download_mbps:.2f} Mbps")
print(f"Upload: {upload_mbps:.2f} Mbps")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Environment Variables for Credentials
                    </h2>
                    <p>
                        Never hardcode passwords! Use environment variables to keep credentials secure:
                    </p>
                    <CodeBlock code={`import os

# Set in terminal: export TWITTER_EMAIL="your@email.com"
# Or in .env file with python-dotenv

TWITTER_EMAIL = os.environ.get("TWITTER_EMAIL")
TWITTER_PASSWORD = os.environ.get("TWITTER_PASSWORD")
PROMISED_DOWN = 100  # Mbps you're paying for
PROMISED_UP = 20

# Validate credentials exist
if not TWITTER_EMAIL or not TWITTER_PASSWORD:
    raise ValueError("Missing Twitter credentials in environment!")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> Bot Class Structure
                    </h2>
                    <p>
                        Organize your bot as a class to keep state and methods together:
                    </p>
                    <CodeBlock code={`from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import speedtest
import os

class InternetSpeedTwitterBot:
    def __init__(self, promised_down, promised_up):
        self.promised_down = promised_down
        self.promised_up = promised_up
        self.down = 0
        self.up = 0
        self.driver = webdriver.Chrome()
    
    def get_internet_speed(self):
        """Test current internet speeds."""
        st = speedtest.Speedtest()
        st.get_best_server()
        self.down = st.download() / 1_000_000
        self.up = st.upload() / 1_000_000
        print(f"Down: {self.down:.2f} | Up: {self.up:.2f}")
    
    def should_complain(self):
        """Check if speeds are below promised."""
        return self.down < self.promised_down or self.up < self.promised_up`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Twitter Login Automation
                    </h2>
                    <p>
                        Automate the Twitter login process with proper waits:
                    </p>
                    <CodeBlock code={`def login_to_twitter(self):
    """Log into Twitter account."""
    self.driver.get("https://twitter.com/login")
    wait = WebDriverWait(self.driver, 15)
    
    # Enter email/username
    email_input = wait.until(
        EC.presence_of_element_located((By.NAME, "text"))
    )
    email_input.send_keys(os.environ["TWITTER_EMAIL"])
    
    # Click Next button
    next_btn = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//span[text()='Next']"))
    )
    next_btn.click()
    
    # Enter password
    password_input = wait.until(
        EC.presence_of_element_located((By.NAME, "password"))
    )
    password_input.send_keys(os.environ["TWITTER_PASSWORD"])
    
    # Click Log in
    login_btn = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//span[text()='Log in']"))
    )
    login_btn.click()`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Composing and Posting the Tweet
                    </h2>
                    <p>
                        Finally, compose and post the complaint tweet:
                    </p>
                    <CodeBlock code={`def tweet_at_provider(self):
    """Compose and send a complaint tweet."""
    wait = WebDriverWait(self.driver, 15)
    
    # Find the tweet compose area
    tweet_box = wait.until(
        EC.presence_of_element_located(
            (By.CSS_SELECTOR, '[data-testid="tweetTextarea_0"]')
        )
    )
    
    # Compose the message
    message = (
        f"Hey @YourISP, why is my internet speed "
        f"{self.down:.1f}Mbps down / {self.up:.1f}Mbps up "
        f"when I pay for {self.promised_down}/{self.promised_up}Mbps?"
    )
    tweet_box.send_keys(message)
    
    # Click the Tweet button
    tweet_btn = wait.until(
        EC.element_to_be_clickable(
            (By.CSS_SELECTOR, '[data-testid="tweetButton"]')
        )
    )
    tweet_btn.click()

# Usage
bot = InternetSpeedTwitterBot(promised_down=100, promised_up=20)
bot.get_internet_speed().

if bot.should_complain():
    bot.login_to_twitter()
    bot.tweet_at_provider()`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Environment Variables</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>python-dotenv</code> with a <code>.env</code> file for easier local development.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Speed Conversion</h4>
                            <p className="text-sm text-surface-400">
                                speedtest returns bits/second. Divide by 1,000,000 for Mbps.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Twitter Selectors</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>data-testid</code> attributes when available — they're more stable than classes.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Rate Limiting</h4>
                            <p className="text-sm text-surface-400">
                                Don't run this too frequently. Add delays and respect Twitter's rate limits.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
