import CodeBlock from '../../CodeBlock'
import { Lightbulb, Award, BarChart3, Globe, LineChart, Filter } from 'lucide-react'

export default function DeepDiveDay79() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Nobel Prize Dataset */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <Award className="w-6 h-6 text-primary-400" /> Exploring Nobel Prize Data
                    </h2>
                    <p>
                        The Nobel Prize dataset contains over a century of laureates across Physics, Chemistry, Medicine, Literature, Peace, and Economics. We'll analyze trends and patterns.
                    </p>
                    <CodeBlock
                        code={`import pandas as pd
import plotly.express as px

df = pd.read_csv("nobel_prize.csv")

# Basic exploration
print(df.shape)        # (954, 18)
print(df.columns)
print(df["category"].value_counts())`}
                        language="python"
                    />
                </section>

                {/* Section 2: Choropleth Maps */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <Globe className="w-6 h-6 text-primary-400" /> Choropleth Maps with Plotly
                    </h2>
                    <p>
                        <strong>Choropleth maps</strong> color geographic regions by data values. Plotly makes them interactive with just a few lines of code.
                    </p>
                    <CodeBlock
                        code={`# Count prizes by birth country
country_counts = df["birth_country"].value_counts().reset_index()
country_counts.columns = ["country", "prizes"]

# Create choropleth map
fig = px.choropleth(country_counts,
                    locations="country",
                    locationmode="country names",
                    color="prizes",
                    title="Nobel Prizes by Birth Country",
                    color_continuous_scale="Viridis")
fig.show()`}
                        language="python"
                    />
                </section>

                {/* Section 3: Sunburst Charts */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <BarChart3 className="w-6 h-6 text-primary-400" /> Sunburst Visualizations
                    </h2>
                    <p>
                        Sunburst charts show hierarchical data—like category → gender → country. Each ring represents a level.
                    </p>
                    <CodeBlock
                        code={`# Sunburst: Category > Gender > Country
fig = px.sunburst(df, 
                  path=["category", "sex", "birth_country"],
                  values=None,  # Each leaf counts as 1
                  title="Nobel Prize Distribution")
fig.show()`}
                        language="python"
                    />
                </section>

                {/* Section 4: Time Series Analysis */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <LineChart className="w-6 h-6 text-primary-400" /> Trends Over Time
                    </h2>
                    <p>
                        How has the distribution of prizes changed over time? Let's plot cumulative prizes by country using Matplotlib.
                    </p>
                    <CodeBlock
                        code={`import matplotlib.pyplot as plt
import seaborn as sns

# Prizes per year by gender
yearly_gender = df.groupby(["year", "sex"]).size().unstack()

# Plot with Seaborn
sns.lineplot(data=yearly_gender)
plt.title("Nobel Prizes by Gender Over Time")
plt.xlabel("Year")
plt.ylabel("Number of Prizes")
plt.legend(title="Gender")
plt.show()`}
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Location Modes</h4>
                            <p className="text-sm text-surface-400">
                                Plotly choropleth supports "country names", "ISO-3", and "USA-states" for different geographic granularity.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1"><Filter className="w-4 h-4 inline" /> Rolling Averages</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>.rolling(10).mean()</code> to smooth noisy time series with a 10-period moving average.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Data Insight</h4>
                            <p className="text-sm text-surface-400">
                                The USA dominates post-1945 prizes. Marie Curie remains the only person to win in two different sciences.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
