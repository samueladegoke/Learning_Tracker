import CodeBlock from '../../CodeBlock'
import { Lightbulb, Calendar, ZoomIn, Palette, Activity } from 'lucide-react'

export default function DeepDiveDay75() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Descriptive Statistics */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <ZoomIn className="w-6 h-6 text-primary-400" /> Getting the Big Picture
                    </h2>
                    <p>
                        When first opening a dataset (like Google Trends for Bitcoin), we use <code>.describe()</code> and <code>.resample()</code> to understand its scale and frequency.
                    </p>
                    <CodeBlock
                        code={`# Statistical summary (mean, std, max, etc.)
print(df.describe())

# Check for missing values
print(f"Missing values: {df.isna().values.sum()}")`}
                        language="python"
                    />
                </section>

                {/* Section 2: Resampling Time Series */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <Calendar className="w-6 h-6 text-primary-400" /> Resampling Data
                    </h2>
                    <p>
                        Google Trends provides data at different intervals (e.g., daily vs. monthly). To compare two datasets, they must have the same frequency. Use <code>.resample()</code> to aggregate data.
                    </p>
                    <CodeBlock
                        code={`# Convert 'D' (daily) data to 'M' (monthly) data
# taking the average value for that month
df_monthly = df.resample('M', on='DATE').last()`}
                        language="python"
                    />
                    <p>
                        The <code>rule</code> parameter (like 'M' for month, 'Y' for year) determines the new frequency, and <code>.last()</code> or <code>.mean()</code> determines how to calculate the value for each block.
                    </p>
                </section>

                {/* Section 3: Advanced Date Formatting */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <Activity className="w-6 h-6 text-primary-400" /> Professional Date Axes
                    </h2>
                    <p>
                        For long time-series, date labels often overlap. We can use <strong>Locators</strong> and <strong>Formatters</strong> from <code>matplotlib.dates</code> to control exactly where ticks appear.
                    </p>
                    <CodeBlock
                        code={`import matplotlib.dates as mdates

years = mdates.YearLocator()
months = mdates.MonthLocator()
years_fmt = mdates.DateFormatter('%Y')

# Apply to axes
ax1.xaxis.set_major_locator(years)
ax1.xaxis.set_major_formatter(years_fmt)
ax1.xaxis.set_minor_locator(months)`}
                        language="python"
                    />
                </section>

                {/* Section 4: Visual Polish */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <Palette className="w-6 h-6 text-primary-400" /> Chart Styling
                    </h2>
                    <p>
                        To make charts "publication ready", we fine-tune colors, line styles, and resolution.
                    </p>
                    <CodeBlock
                        code={`plt.figure(figsize=(14, 8), dpi=120)

plt.plot(df.DATE, df.BTC_PRICE, 
         color='#F08F2E', 
         linewidth=3, 
         linestyle='--') # Dashed line

plt.grid(color='grey', linestyle='--')`}
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">DPI (Dots Per Inch)</h4>
                            <p className="text-sm text-surface-400">
                                Increasing <code>dpi</code> in <code>plt.figure()</code> makes your charts look sharp on high-resolution screens.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Markers</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>marker='o'</code> or <code>marker='x'</code> to highlight individual data points on a line.
                            </p>
                        </div>
                        <div className="w-full h-px bg-surface-700/50"></div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Limits</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>plt.xlim()</code> and <code>plt.ylim()</code> to "zoom in" on a specific period or value range in your data.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
