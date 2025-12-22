import CodeBlock from '../../CodeBlock'
import { Lightbulb, BarChart3, PieChart, Layers, Zap, Smartphone } from 'lucide-react'

export default function DeepDiveDay76() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Introduction to Plotly */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <BarChart3 className="w-6 h-6 text-primary-400" /> Beautiful Interactive Charts
                    </h2>
                    <p>
                        <strong>Plotly</strong> creates interactive, publication-quality graphs. Unlike Matplotlib's static images, Plotly charts allow users to hover, zoom, and pan—perfect for data exploration.
                    </p>
                    <CodeBlock
                        code={`import plotly.express as px

# Load the Android App Store dataset
df = pd.read_csv("apps.csv")

# Create an interactive bar chart
fig = px.bar(df, x="Category", y="Installs",
             title="App Installs by Category",
             color="Category")
fig.show()`}
                        language="python"
                    />
                </section>

                {/* Section 2: Scatter Plots */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <Layers className="w-6 h-6 text-primary-400" /> Scatter Plots for Correlation
                    </h2>
                    <p>
                        Scatter plots reveal relationships between variables. With Plotly, you can color by category and scale by a third variable.
                    </p>
                    <CodeBlock
                        code={`# Size by number of reviews, color by category
fig = px.scatter(df, 
                 x="Size", 
                 y="Rating",
                 size="Reviews",
                 color="Category",
                 hover_name="App",
                 title="Rating vs Size")
fig.show()`}
                        language="python"
                    />
                </section>

                {/* Section 3: Pie and Donut Charts */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <PieChart className="w-6 h-6 text-primary-400" /> Pie & Donut Charts
                    </h2>
                    <p>
                        Pie charts show proportions. A "donut" chart is a pie with a hole in the middle—often more readable for many categories.
                    </p>
                    <CodeBlock
                        code={`# Create a donut chart with the hole parameter
fig = px.pie(df_category, 
             names="Category", 
             values="Apps",
             hole=0.4,      # Creates donut hole
             title="App Distribution by Category")
fig.show()`}
                        language="python"
                    />
                </section>

                {/* Section 4: Data Cleaning for Analysis */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <Zap className="w-6 h-6 text-primary-400" /> Data Cleaning
                    </h2>
                    <p>
                        Real datasets are messy. App Store installs have "+" and "," characters that need cleaning before analysis.
                    </p>
                    <CodeBlock
                        code={`# Remove special characters and convert to numeric
df["Installs"] = df["Installs"].str.replace(",", "")
df["Installs"] = df["Installs"].str.replace("+", "")
df["Installs"] = pd.to_numeric(df["Installs"])

# Handle NaN values
df.dropna(subset=["Rating"], inplace=True)`}
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Express vs Graph Objects</h4>
                            <p className="text-sm text-surface-400">
                                <code>plotly.express</code> is high-level and easy. <code>plotly.graph_objects</code> gives fine-grained control for complex charts.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Color Scales</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>color_continuous_scale="Viridis"</code> for numeric data and <code>color_discrete_sequence</code> for categories.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1"><Smartphone className="w-4 h-4 inline" /> App Store Insights</h4>
                            <p className="text-sm text-surface-400">
                                Free apps dominate (92%), but paid apps often have higher ratings. Game and Family categories have the most apps.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
