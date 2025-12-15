import React from 'react'
import CodeBlock from '../../CodeBlock'
import { TrendingUp, Newspaper, Bell, DollarSign, Lightbulb } from 'lucide-react'

export default function DeepDiveDay36() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-primary-400" /> Stock Trading News Alert
                    </h2>
                    <p>
                        Day 36 builds a <strong>Stock Price Alert System</strong> that monitors stock prices,
                        detects significant changes, and sends relevant news articles via SMS. This combines
                        multiple APIs: Stock prices, News, and Twilio for notifications.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Stock Price API
                    </h2>
                    <p>
                        Use a stock market API like <strong>Alpha Vantage</strong> to get daily stock prices.
                        Compare yesterday's close with the day before to detect significant changes.
                    </p>
                    <CodeBlock code={`import requests
import os

STOCK = "TSLA"
STOCK_API_KEY = os.environ.get("ALPHAVANTAGE_API_KEY")

stock_params = {
    "function": "TIME_SERIES_DAILY",
    "symbol": STOCK,
    "apikey": STOCK_API_KEY
}

response = requests.get("https://www.alphavantage.co/query", params=stock_params)
data = response.json()["Time Series (Daily)"]

# Get the last two days' data
data_list = [value for (key, value) in data.items()]
yesterday_data = data_list[0]
day_before_data = data_list[1]

yesterday_close = float(yesterday_data["4. close"])
day_before_close = float(day_before_data["4. close"])`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Calculating Percentage Change
                    </h2>
                    <p>
                        Calculate the percentage change between the two closing prices. If it exceeds
                        a threshold (e.g., 5%), trigger an alert.
                    </p>
                    <CodeBlock code={`# Calculate the difference
difference = yesterday_close - day_before_close

# Calculate percentage change
diff_percent = round((difference / day_before_close) * 100)

# Determine direction (up or down)
if difference > 0:
    direction = "🔺"
else:
    direction = "🔻"

# Only alert if change is significant (e.g., > 5%)
THRESHOLD = 5
if abs(diff_percent) > THRESHOLD:
    print(f"Significant change detected: {direction}{abs(diff_percent)}%")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> News API Integration
                    </h2>
                    <p>
                        When a significant price change is detected, fetch relevant news articles using
                        the <strong>News API</strong>. Filter by the company name to get context.
                    </p>
                    <CodeBlock code={`COMPANY_NAME = "Tesla Inc"
NEWS_API_KEY = os.environ.get("NEWS_API_KEY")

news_params = {
    "apiKey": NEWS_API_KEY,
    "qInTitle": COMPANY_NAME,
    "sortBy": "publishedAt",
    "language": "en"
}

news_response = requests.get("https://newsapi.org/v2/everything", params=news_params)
articles = news_response.json()["articles"]

# Get the top 3 articles
top_articles = articles[:3]

# Format for SMS
formatted_articles = [
    f"Headline: {article['title']}\\nBrief: {article['description']}"
    for article in top_articles
]`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Sending SMS Alerts
                    </h2>
                    <p>
                        Use Twilio to send SMS notifications with the stock change and relevant news.
                    </p>
                    <CodeBlock code={`from twilio.rest import Client

TWILIO_SID = os.environ.get("TWILIO_ACCOUNT_SID")
TWILIO_AUTH = os.environ.get("TWILIO_AUTH_TOKEN")
TWILIO_NUMBER = os.environ.get("TWILIO_PHONE_NUMBER")
MY_NUMBER = os.environ.get("MY_PHONE_NUMBER")

client = Client(TWILIO_SID, TWILIO_AUTH)

# Send an SMS for each article
for article in formatted_articles:
    message = client.messages.create(
        body=f"{STOCK}: {direction}{abs(diff_percent)}%\\n{article}",
        from_=TWILIO_NUMBER,
        to=MY_NUMBER
    )
    print(f"Message sent: {message.status}")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Complete Alert Flow
                    </h2>
                    <p>
                        The complete flow: check stock → calculate change → if significant, get news → send SMS.
                    </p>
                    <CodeBlock code={`# Complete stock alert flow
if abs(diff_percent) > THRESHOLD:
    # Get news articles
    news_response = requests.get("https://newsapi.org/v2/everything", params=news_params)
    articles = news_response.json()["articles"][:3]
    
    # Send SMS for each article
    for article in articles:
        message_body = f"""
{STOCK}: {direction}{abs(diff_percent)}%
Headline: {article['title']}
Brief: {article['description']}
"""
        client.messages.create(
            body=message_body,
            from_=TWILIO_NUMBER,
            to=MY_NUMBER
        )
else:
    print(f"No significant change: {diff_percent}%")`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">API Rate Limits</h4>
                            <p className="text-sm text-surface-400">
                                Alpha Vantage free tier: 5 calls/min, 500/day. Cache results to avoid re-fetching.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Use abs() for Percentage</h4>
                            <p className="text-sm text-surface-400">
                                Always use <code>abs()</code> when comparing to threshold since change can be negative.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">News API qInTitle</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>qInTitle</code> instead of <code>q</code> for more relevant results limited to headlines.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Schedule with cron</h4>
                            <p className="text-sm text-surface-400">
                                Run this script daily after market close using cron or PythonAnywhere scheduled tasks.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
