import CodeBlock from '../../CodeBlock'
import { Lightbulb, Home, TrendingUp, Layers, Target, Wrench } from 'lucide-react'

export default function DeepDiveDay81() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: The Problem */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <Home className="w-6 h-6 text-primary-400" /> Predicting House Prices
                    </h2>
                    <p>
                        The capstone project applies everything we've learned: data cleaning, visualization, feature engineering, and machine learning to predict house prices from the Boston Housing dataset.
                    </p>
                    <CodeBlock
                        code={`import pandas as pd
from sklearn.datasets import load_boston

# Note: Boston dataset is deprecated for ethical reasons
# but the concepts apply to any regression problem
data = pd.read_csv("housing.csv")

# Features: rooms, crime rate, age, etc.
# Target: Median home value (MEDV)
print(data.head())
print(data.describe())`}
                        language="python"
                    />
                </section>

                {/* Section 2: Feature Engineering */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <Layers className="w-6 h-6 text-primary-400" /> Feature Engineering
                    </h2>
                    <p>
                        Raw data rarely works perfectly. We create new features, handle missing values, and transform skewed distributions.
                    </p>
                    <CodeBlock
                        code={`import numpy as np

# Handle missing values
data.fillna(data.median(), inplace=True)

# Log transform skewed features
data["log_crime"] = np.log1p(data["CRIM"])

# Create new features
data["rooms_per_dwelling"] = data["RM"] / data["AGE"]

# Check correlations with target
print(data.corr()["MEDV"].sort_values(ascending=False))`}
                        language="python"
                    />
                </section>

                {/* Section 3: Train-Test Split */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <Target className="w-6 h-6 text-primary-400" /> Training the Model
                    </h2>
                    <p>
                        We split data into training and test sets, then fit a regression model. Never evaluate on training data—that's cheating!
                    </p>
                    <CodeBlock
                        code={`from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

# Prepare features and target
X = data.drop("MEDV", axis=1)
y = data["MEDV"]

# Split: 80% train, 20% test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Fit the model
model = LinearRegression()
model.fit(X_train, y_train)`}
                        language="python"
                    />
                </section>

                {/* Section 4: Evaluation */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <TrendingUp className="w-6 h-6 text-primary-400" /> Model Evaluation
                    </h2>
                    <p>
                        We use multiple metrics to assess model quality: R², RMSE, and residual analysis.
                    </p>
                    <CodeBlock
                        code={`from sklearn.metrics import r2_score, mean_squared_error
import matplotlib.pyplot as plt

# Predictions
y_pred = model.predict(X_test)

# Metrics
r2 = r2_score(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print(f"R²: {r2:.3f}, RMSE: \$\${rmse * 1000:.0f}")

# Residual plot
residuals = y_test - y_pred
plt.scatter(y_pred, residuals, alpha=0.5)
plt.axhline(y=0, color='r', linestyle='--')
plt.xlabel("Predicted")
plt.ylabel("Residuals")
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1"><Wrench className="w-4 h-4 inline" /> Hyperparameter Tuning</h4>
                            <p className="text-sm text-surface-400">
                                Try different models (RandomForest, XGBoost) and use <code>GridSearchCV</code> to find optimal parameters.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Feature Scaling</h4>
                            <p className="text-sm text-surface-400">
                                For distance-based models (KNN, SVM), use <code>StandardScaler</code> or <code>MinMaxScaler</code>.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Residual Patterns</h4>
                            <p className="text-sm text-surface-400">
                                Random residuals = good fit. Patterns suggest missing features or non-linear relationships.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
