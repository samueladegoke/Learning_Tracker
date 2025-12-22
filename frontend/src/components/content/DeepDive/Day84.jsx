import CodeBlock from '../../CodeBlock'
import { Lightbulb, Bot, Clock, FileText, Repeat, Zap } from 'lucide-react'

export default function DeepDiveDay84() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Automation Scripts */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <Bot className="w-6 h-6 text-primary-400" /> Python Automation
                    </h2>
                    <p>
                        Automation scripts save hours of manual work. Common use cases include web scraping, data processing, and scheduled tasks.
                    </p>
                    <CodeBlock
                        code={`import requests
from bs4 import BeautifulSoup
import csv

def scrape_prices(url):
    """Scrape product prices from a webpage."""
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    
    products = []
    for item in soup.select(".product-card"):
        name = item.select_one(".title").text.strip()
        price = item.select_one(".price").text.strip()
        products.append({"name": name, "price": price})
    
    return products

# Save to CSV
with open("prices.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "price"])
    writer.writeheader()
    writer.writerows(scrape_prices("https://example.com"))`}
                        language="python"
                    />
                </section>

                {/* Section 2: Scheduled Tasks */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <Clock className="w-6 h-6 text-primary-400" /> Scheduled Tasks
                    </h2>
                    <p>
                        Use <code>schedule</code> library for simple task scheduling, or cron jobs for system-level automation.
                    </p>
                    <CodeBlock
                        code={`import schedule
import time

def job():
    print("Running scheduled task...")
    # Your automation code here

# Schedule the job
schedule.every().day.at("09:00").do(job)
schedule.every(10).minutes.do(job)

# Keep the script running
while True:
    schedule.run_pending()
    time.sleep(60)  # Check every minute`}
                        language="python"
                    />
                </section>

                {/* Section 3: Email Automation */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <FileText className="w-6 h-6 text-primary-400" /> Report Generation
                    </h2>
                    <p>
                        Automate report generation by combining data processing with email sending.
                    </p>
                    <CodeBlock
                        code={`import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def send_report(subject, body, to_email):
    """Send an email report."""
    msg = MIMEMultipart()
    msg["From"] = os.getenv("EMAIL_USER")
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "html"))
    
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
        server.send_message(msg)

# Generate and send daily report
report = generate_daily_report()
send_report("Daily Report", report, "boss@company.com")`}
                        language="python"
                    />
                </section>

                {/* Section 4: Data Pipeline */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <Repeat className="w-6 h-6 text-primary-400" /> ETL Pipelines
                    </h2>
                    <p>
                        ETL (Extract, Transform, Load) pipelines automate data processing workflows.
                    </p>
                    <CodeBlock
                        code={`import pandas as pd

def etl_pipeline():
    # Extract: Read from multiple sources
    df1 = pd.read_csv("sales.csv")
    df2 = pd.read_json("inventory.json")
    
    # Transform: Clean and merge
    df1["date"] = pd.to_datetime(df1["date"])
    df1 = df1[df1["amount"] > 0]  # Filter invalid
    merged = df1.merge(df2, on="product_id")
    
    # Load: Save to database or file
    merged.to_sql("processed_data", engine, if_exists="replace")
    print(f"Processed {len(merged)} records")

if __name__ == "__main__":
    etl_pipeline()`}
                        language="python"
                    />
                </section>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                    <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1"><Zap className="w-4 h-4 inline" /> Logging</h4>
                            <p className="text-sm text-surface-400">
                                Use Python's <code>logging</code> module instead of print. Log to files for debugging automated scripts.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Error Handling</h4>
                            <p className="text-sm text-surface-400">
                                Wrap automation in try/except. Send alert emails when scripts fail.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Portfolio Ideas</h4>
                            <p className="text-sm text-surface-400">
                                Price tracker, social media bot, backup script, data sync, invoice generator.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
