import CodeBlock from '../../CodeBlock'
import { Lightbulb, Search } from 'lucide-react'

export default function DeepDiveDay45() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">

                {/* Intro */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <Search className="w-6 h-6 text-primary-400" /> Web Scraping with Beautiful Soup
                    </h2>
                    <p>
                        Day 45 introduces <strong>web scraping</strong>—extracting data from websites programmatically.
                        Beautiful Soup is a Python library that makes it easy to parse HTML and navigate the
                        document structure to find exactly the data you need.
                    </p>
                    <p className="text-amber-400 text-sm flex items-center gap-2">
                        <strong>⚠️ Legal Note:</strong> Always check a website's <code>robots.txt</code> and
                        Terms of Service before scraping. Respect rate limits and don't overwhelm servers.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> Setting Up Beautiful Soup
                    </h2>
                    <p>
                        Beautiful Soup parses HTML content into a navigable Python object. First, install it
                        and read HTML from a file or URL:
                    </p>
                    <CodeBlock code={`# Install: pip install beautifulsoup4

from bs4 import BeautifulSoup

# Option 1: Parse from a local file
with open("website.html") as file:
    contents = file.read()

soup = BeautifulSoup(contents, "html.parser")

# Option 2: Parse from a website (with requests)
import requests

response = requests.get("https://example.com")
soup = BeautifulSoup(response.text, "html.parser")

# Print prettified HTML
print(soup.prettify())`} language="python" />
                    <p>
                        The <code>html.parser</code> is Python's built-in parser. For complex sites, you can
                        use <code>lxml</code> (faster) after installing it.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> Basic Navigation
                    </h2>
                    <p>
                        Once you have a soup object, access elements directly by tag name:
                    </p>
                    <CodeBlock code={`# Get the first matching element
title = soup.title           # <title> tag
h1 = soup.h1                  # First <h1>
first_link = soup.a           # First <a> tag
first_paragraph = soup.p      # First <p>

# Get the tag name
print(title.name)             # "title"

# Get the text content
print(title.string)           # "My Website"
print(h1.getText())           # Alternative method

# Get an attribute
print(first_link.get("href")) # The URL
print(soup.p["class"])        # Class attribute (returns list)`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> find() vs find_all()
                    </h2>
                    <p>
                        To search for elements, use <code>find()</code> for one result or <code>find_all()</code> for multiple:
                    </p>
                    <CodeBlock code={`# find() - Returns FIRST matching element (or None)
heading = soup.find(name="h1")
heading_with_id = soup.find(name="h1", id="main-title")
link_in_nav = soup.find(name="a", class_="nav-link")

# Note: class_ (with underscore) because 'class' is Python keyword

# find_all() - Returns LIST of all matching elements
all_links = soup.find_all(name="a")
all_paragraphs = soup.find_all("p")  # 'name=' is optional

# Loop through results
for link in all_links:
    print(link.getText())    # Link text
    print(link.get("href"))  # URL

# Find by attributes
items_with_class = soup.find_all(class_="highlight")
item_with_id = soup.find(id="header")`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> CSS Selectors with select()
                    </h2>
                    <p>
                        If you know CSS selectors, you can use <code>select()</code> and <code>select_one()</code>
                        for even more powerful searching:
                    </p>
                    <CodeBlock code={`# select() - Returns LIST (like find_all)
# select_one() - Returns FIRST match (like find)

# Element selector
all_h2 = soup.select("h2")

# Class selector (.)
highlights = soup.select(".highlight")

# ID selector (#)
header = soup.select_one("#header")

# Nested elements (ancestor descendant)
links_in_nav = soup.select("nav a")

# Direct child (>)
direct_children = soup.select("div > p")

# Multiple selectors
headings = soup.select("h1, h2, h3")

# Attribute selectors
external_links = soup.select('a[href^="https://"]')  # Starts with
pdf_links = soup.select('a[href$=".pdf"]')           # Ends with`} language="python" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> Real-World Example
                    </h2>
                    <p>
                        Here's a complete example scraping article titles from a news site:
                    </p>
                    <CodeBlock code={`import requests
from bs4 import BeautifulSoup

# 1. Fetch the page
url = "https://news.ycombinator.com/"
response = requests.get(url)

# 2. Parse the HTML
soup = BeautifulSoup(response.text, "html.parser")

# 3. Find all article titles (inspect the page to find selectors)
titles = soup.select(".titleline > a")

# 4. Extract and print
for i, title in enumerate(titles[:10], 1):
    print(f"{i}. {title.getText()}")
    print(f"   Link: {title.get('href')}\\n")

# 5. Get associated scores
scores = soup.select(".score")
for score in scores[:10]:
    print(score.getText())  # e.g., "245 points"`} language="python" />
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Inspect First</h4>
                            <p className="text-sm text-surface-400">
                                Right-click → Inspect on any webpage to find the CSS selectors you need for scraping.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">class_ underscore</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>class_</code> (with underscore) in find() since <code>class</code> is a Python keyword.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Handle None</h4>
                            <p className="text-sm text-surface-400">
                                Always check if <code>find()</code> returns <code>None</code> before accessing attributes.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">lxml Parser</h4>
                            <p className="text-sm text-surface-400">
                                If <code>html.parser</code> has issues, try <code>lxml</code> parser after installing it.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
