import CodeBlock from '../../CodeBlock'
import { Lightbulb, TrendingUp, BarChart, Palette, Target, FileSpreadsheet } from 'lucide-react'

export default function DeepDiveDay78() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Introduction to Seaborn */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <Palette className="w-6 h-6 text-primary-400" /> Seaborn: Statistical Visualization
                    </h2>
                    <p>
                        <strong>Seaborn</strong> sits on top of Matplotlib and provides beautiful statistical graphics with minimal code. It integrates deeply with Pandas DataFrames.
                    </p>
                    <CodeBlock
                        code={`import seaborn as sns
import matplotlib.pyplot as plt

# Load sample dataset
df = sns.load_dataset("tips")

# Set visual style
sns.set_style("whitegrid")
sns.set_palette("husl")

# Create a distribution plot
sns.histplot(df["total_bill"], kde=True)
plt.show()`}
                        language="python"
                    />
                </section>

                {/* Section 2: Regression Plots */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <TrendingUp className="w-6 h-6 text-primary-400" /> Linear Regression with regplot
                    </h2>
                    <p>
                        <code>regplot()</code> creates a scatter plot with a fitted regression line and confidence interval—perfect for visualizing relationships.
                    </p>
                    <CodeBlock
                        code={`# Simple regression plot
sns.regplot(x="total_bill", y="tip", data=df,
            scatter_kws={"alpha": 0.5},
            line_kws={"color": "red"})

# lmplot for faceting by category
sns.lmplot(x="total_bill", y="tip", 
           hue="smoker",  # Color by category
           col="time",    # Separate plots
           data=df)
plt.show()`}
                        language="python"
                    />
                </section>

                {/* Section 3: Understanding Linear Regression */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <Target className="w-6 h-6 text-primary-400" /> The Math: y = mx + b
                    </h2>
                    <p>
                        Linear regression finds the "best fit" line through data points by minimizing the error (residuals) between predicted and actual values.
                    </p>
                    <CodeBlock
                        code={`from sklearn.linear_model import LinearRegression

# Prepare data
X = df[["total_bill"]]  # Features (2D)
y = df["tip"]           # Target (1D)

# Fit the model
model = LinearRegression()
model.fit(X, y)

# Coefficients
print(f"Slope (m): {model.coef_[0]:.3f}")
print(f"Intercept (b): {model.intercept_:.3f}")
# Prediction: tip = 0.105 * total_bill + 0.92`}
                        language="python"
                    />
                </section>

                {/* Section 4: Evaluating the Model */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <BarChart className="w-6 h-6 text-primary-400" /> R-Squared: Model Quality
                    </h2>
                    <p>
                        R² (R-squared) measures how well the model explains variance. An R² of 0.8 means 80% of variance is explained by the model.
                    </p>
                    <CodeBlock
                        code={`from sklearn.metrics import r2_score, mean_squared_error

# Make predictions
predictions = model.predict(X)

# Evaluate
r2 = r2_score(y, predictions)
rmse = mean_squared_error(y, predictions, squared=False)

print(f"R²: {r2:.3f}")      # 0-1, higher is better
print(f"RMSE: {rmse:.3f}")  # Lower is better`}
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">regplot vs lmplot</h4>
                            <p className="text-sm text-surface-400">
                                <code>regplot</code> works on axes, <code>lmplot</code> creates a figure with faceting capabilities (col, row, hue).
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1"><FileSpreadsheet className="w-4 h-4 inline" /> Feature Shape</h4>
                            <p className="text-sm text-surface-400">
                                sklearn expects X as 2D (<code>df[["col"]]</code>), not 1D (<code>df["col"]</code>). Common error!
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Correlation ≠ Causation</h4>
                            <p className="text-sm text-surface-400">
                                A strong fit doesn't mean one variable <em>causes</em> the other.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
