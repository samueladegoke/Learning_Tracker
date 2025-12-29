import CodeBlock from '../../CodeBlock'
import { Target, Layers, CheckCircle2, GitBranch, MessageSquareQuote, Sparkles, AlertTriangle, Globe, FileText } from 'lucide-react'

export default function DeepDiveDay92() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <Target className="w-6 h-6 text-primary-400" /> The Brief
                    </h2>
                    <div className="bg-surface-800/50 p-5 rounded-lg border border-surface-700">
                        <p className="italic text-surface-300 mb-4">
                            "Build a custom Selenium web scraper that extracts rental listing data from Zillow and populates a Google Form for later analysis."
                        </p>
                        <h4 className="font-semibold text-surface-100 mb-2">Deliverables:</h4>
                        <ul className="list-disc list-inside space-y-1 text-surface-300">
                            <li>Selenium script to scrape Zillow listings</li>
                            <li>Extract address, price, and link for each listing</li>
                            <li>Automate Google Form submission</li>
                            <li>Export Form responses to Google Sheets</li>
                        </ul>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <Layers className="w-6 h-6 text-primary-400" /> Recommended Tech Stack
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-surface-700 flex items-start gap-3">
                            <Globe className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-surface-100">Selenium</h4>
                                <p className="text-sm text-surface-400">Browser automation for dynamic content.</p>
                            </div>
                        </div>
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-surface-700 flex items-start gap-3">
                            <FileText className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-surface-100">BeautifulSoup</h4>
                                <p className="text-sm text-surface-400">HTML parsing and extraction.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <GitBranch className="w-6 h-6 text-primary-400" /> Architecture Pattern
                    </h2>
                    <CodeBlock
                        code={`from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://www.zillow.com/sf-ca/rentals/")

# Wait for dynamic content to load
import time
time.sleep(5)

listings = driver.find_elements(By.CLASS_NAME, "property-card")
for listing in listings:
    address = listing.find_element(By.CLASS_NAME, "address").text
    price = listing.find_element(By.CLASS_NAME, "price").text
    link = listing.find_element(By.TAG_NAME, "a").get_attribute("href")
    print(address, price, link)`}
                        language="python"
                    />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <CheckCircle2 className="w-6 h-6 text-primary-400" /> Milestones
                    </h2>
                    <div className="space-y-3">
                        {[
                            { title: "Selenium Setup", desc: "Install webdriver and navigate to target URL." },
                            { title: "Data Extraction", desc: "Parse listing cards for required fields." },
                            { title: "Google Form", desc: "Create form and automate submissions." },
                            { title: "Data Export", desc: "Link responses to Google Sheets." }
                        ].map((m, i) => (
                            <div key={i} className="flex gap-3 items-start bg-surface-800/30 p-4 rounded-lg border border-surface-700">
                                <span className="text-primary-400 font-bold">{i + 1}</span>
                                <div>
                                    <h4 className="font-semibold text-surface-100">{m.title}</h4>
                                    <p className="text-sm text-surface-400">{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">05.</span> <AlertTriangle className="w-6 h-6 text-amber-400" /> Common Pitfalls
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-amber-500/20">
                            <h4 className="font-semibold text-amber-300 mb-1">CAPTCHA</h4>
                            <p className="text-sm text-surface-400">Zillow may block automated requests; use delays and headless mode wisely.</p>
                        </div>
                        <div className="bg-surface-800/30 p-4 rounded-lg border border-amber-500/20">
                            <h4 className="font-semibold text-amber-300 mb-1">Dynamic Selectors</h4>
                            <p className="text-sm text-surface-400">Class names may change; use more stable selectors.</p>
                        </div>
                    </div>
                </section>
            </div>

            <aside className="space-y-6">
                <div className="bg-surface-800/40 p-5 rounded-xl border border-surface-700">
                    <h3 className="font-bold text-surface-100 mb-3 flex items-center gap-2">
                        <MessageSquareQuote className="w-5 h-5 text-primary-400" /> Interview Prep
                    </h3>
                    <ul className="space-y-3 text-sm text-surface-300">
                        <li className="flex gap-2 items-start">
                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>"What's the difference between Selenium and BeautifulSoup?"</span>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    )
}
