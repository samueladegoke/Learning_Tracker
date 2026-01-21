import React from 'react'
import CodeBlock from '../../CodeBlock'
import { Mail, Clock, Calendar, Send, Lightbulb } from 'lucide-react'

export default function DeepDiveDay32() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Mail className="w-6 h-6 text-primary-400" /> Email & Date Management
                    </h2>
                    <p>
                        Day 32 teaches you to <strong>send emails programmatically</strong> using Python's built-in
                        <code>smtplib</code> module, and work with dates using the <code>datetime</code> module.
                        These skills enable automation like birthday reminders and scheduled notifications.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> SMTP Basics
                    </h2>
                    <p>
                        <strong>SMTP</strong> (Simple Mail Transfer Protocol) is the standard for sending emails.
                        Python's <code>smtplib</code> connects to email servers like Gmail, Yahoo, or Outlook.
                    </p>
                    <CodeBlock code={`import smtplib

# SMTP server addresses
# Gmail: smtp.gmail.com
# Yahoo: smtp.mail.yahoo.com
# Outlook: smtp-mail.outlook.com

# Create connection (use port 587 for TLS)
with smtplib.SMTP("smtp.gmail.com", 587) as connection:
    connection.starttls()  # Encrypt the connection
    connection.login(user="your_email@gmail.com", password="your_app_password")
    connection.sendmail(
        from_addr="your_email@gmail.com",
        to_addrs="recipient@example.com",
        msg="Subject:Hello\\n\\nThis is the email body."
    )`} language="python" />
                    <p>
                        <strong>Important:</strong> For Gmail, you need an "App Password" (not your regular password).
                        Enable 2FA in your Google account, then create an app password.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Email Structure
                    </h2>
                    <p>
                        The email message has a specific format: subject line followed by a blank line, then the body.
                        Use <code>\n\n</code> to separate them.
                    </p>
                    <CodeBlock code={`# Email format
message = "Subject:Test Email\\n\\nHello!\\nThis is line 2 of the body."

# Or use f-strings for dynamic content
subject = "Birthday Reminder"
body = f"Don't forget - it's {name}'s birthday today!"
message = f"Subject:{subject}\\n\\n{body}"`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> The datetime Module
                    </h2>
                    <p>
                        The <code>datetime</code> module provides classes for manipulating dates and times.
                        Use it to check today's date, compare dates, and format output.
                    </p>
                    <CodeBlock code={`import datetime as dt

# Get current date and time
now = dt.datetime.now()
print(now.year)      # 2025
print(now.month)     # 12
print(now.day)       # 15
print(now.weekday()) # 0 = Monday, 6 = Sunday

# Create a specific date
birthday = dt.datetime(year=1990, month=5, day=15)

# Compare dates
if now.month == birthday.month and now.day == birthday.day:
    print("Happy Birthday!")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> Formatting Dates with strftime
                    </h2>
                    <p>
                        The <code>strftime()</code> method formats dates as strings using format codes.
                    </p>
                    <CodeBlock code={`import datetime as dt

now = dt.datetime.now()

# Common format codes
print(now.strftime("%Y-%m-%d"))     # 2025-12-15
print(now.strftime("%B %d, %Y"))    # December 15, 2025
print(now.strftime("%A"))           # Sunday
print(now.strftime("%H:%M:%S"))     # 14:30:45

# Format codes reference:
# %Y = 4-digit year, %y = 2-digit year
# %m = month (01-12), %B = full month name
# %d = day (01-31), %A = full weekday name
# %H = hour (24h), %I = hour (12h), %M = minute, %S = second`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Automated Birthday Wisher
                    </h2>
                    <p>
                        Combine CSV data, datetime checking, and SMTP to create an automated birthday email system.
                    </p>
                    <CodeBlock code={`import pandas as pd
import datetime as dt
import smtplib
import random

# Load birthdays from CSV
birthdays = pd.read_csv("birthdays.csv")

# Check if today matches any birthday
today = dt.datetime.now()
for index, row in birthdays.iterrows():
    if row["month"] == today.month and row["day"] == today.day:
        # Pick random letter template
        with open(f"letter_{random.randint(1,3)}.txt") as f:
            template = f.read()
            letter = template.replace("[NAME]", row["name"])
        
        # Send email
        with smtplib.SMTP("smtp.gmail.com", 587) as connection:
            connection.starttls()
            connection.login(MY_EMAIL, MY_PASSWORD)
            connection.sendmail(MY_EMAIL, row["email"], 
                f"Subject:Happy Birthday!\\n\\n{letter}")`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Use App Passwords</h4>
                            <p className="text-sm text-surface-400">
                                Gmail requires an App Password (not your login password). Enable 2FA first, then generate one in Security settings.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Context Manager</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>with smtplib.SMTP(...) as connection:</code> to ensure the connection is properly closed.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Environment Variables</h4>
                            <p className="text-sm text-surface-400">
                                Never hardcode passwords! Use <code>os.environ.get("EMAIL_PASSWORD")</code> instead.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">weekday() Returns Int</h4>
                            <p className="text-sm text-surface-400">
                                Monday = 0, Sunday = 6. Use this to send "Monday Motivation" emails only on Mondays.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
