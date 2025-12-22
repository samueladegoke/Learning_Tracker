import CodeBlock from '../../CodeBlock'
import { Lightbulb, FlaskConical, BarChart, Activity, AlertTriangle, CheckCircle } from 'lucide-react'

export default function DeepDiveDay80() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: The Handwashing Discovery */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <FlaskConical className="w-6 h-6 text-primary-400" /> The Handwashing Discovery
                    </h2>
                    <p>
                        In 1847, Dr. Ignaz Semmelweis noticed that doctors who washed hands had dramatically lower patient death rates. We'll prove this statistically using <strong>hypothesis testing</strong>.
                    </p>
                    <CodeBlock
                        code={`import pandas as pd
import matplotlib.pyplot as plt

# Load the historical data
df = pd.read_csv("handwashing.csv", parse_dates=["date"])

# Death rates before and after handwashing started
before = df[df["date"] < "1847-06-01"]["death_rate"]
after = df[df["date"] >= "1847-06-01"]["death_rate"]

print(f"Before: {before.mean():.2%}")  # ~10%
print(f"After:  {after.mean():.2%}")   # ~2%`}
                        language="python"
                    />
                </section>

                {/* Section 2: Understanding Distributions */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <BarChart className="w-6 h-6 text-primary-400" /> Visualizing Distributions
                    </h2>
                    <p>
                        Before running a t-test, we should visualize the data. Histograms and kernel density estimates (KDE) show the shape of distributions.
                    </p>
                    <CodeBlock
                        code={`import seaborn as sns

# Overlapping histograms
plt.figure(figsize=(10, 6))
sns.histplot(before, kde=True, label="Before", color="red", alpha=0.5)
sns.histplot(after, kde=True, label="After", color="green", alpha=0.5)
plt.legend()
plt.xlabel("Death Rate")
plt.title("Death Rates Before vs After Handwashing")
plt.show()`}
                        language="python"
                    />
                </section>

                {/* Section 3: T-Test */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <Activity className="w-6 h-6 text-primary-400" /> The T-Test
                    </h2>
                    <p>
                        A <strong>t-test</strong> determines if the difference between two groups is statistically significant or just random chance. A p-value &lt; 0.05 means we can reject the null hypothesis.
                    </p>
                    <CodeBlock
                        code={`from scipy.stats import ttest_ind

# Independent samples t-test
t_statistic, p_value = ttest_ind(before, after)

print(f"T-statistic: {t_statistic:.3f}")
print(f"P-value: {p_value:.10f}")

# Interpret results
alpha = 0.05
if p_value < alpha:
    print("REJECT null hypothesis: difference is significant!")
else:
    print("Fail to reject null: no significant difference")`}
                        language="python"
                    />
                </section>

                {/* Section 4: Confidence Intervals */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <CheckCircle className="w-6 h-6 text-primary-400" /> Confidence Intervals
                    </h2>
                    <p>
                        A 95% confidence interval gives the range where the true mean likely falls. Non-overlapping intervals suggest a real difference.
                    </p>
                    <CodeBlock
                        code={`import numpy as np
from scipy import stats

def confidence_interval(data, confidence=0.95):
    n = len(data)
    mean = np.mean(data)
    se = stats.sem(data)  # Standard error
    h = se * stats.t.ppf((1 + confidence) / 2, n - 1)
    return mean - h, mean + h

ci_before = confidence_interval(before)
ci_after = confidence_interval(after)
print(f"Before: {ci_before}")
print(f"After: {ci_after}")`}
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1"><AlertTriangle className="w-4 h-4 inline" /> P-Value Pitfalls</h4>
                            <p className="text-sm text-surface-400">
                                P &lt; 0.05 doesn't mean the effect is <em>large</em>, just that it's unlikely due to chance. Always check effect size too.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">ttest_ind vs ttest_rel</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>ttest_ind</code> for independent samples. Use <code>ttest_rel</code> for paired data (same subjects, before/after).
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Historical Impact</h4>
                            <p className="text-sm text-surface-400">
                                Semmelweis's findings were rejected during his lifetime. He died in an asylum—but saved millions posthumously.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
