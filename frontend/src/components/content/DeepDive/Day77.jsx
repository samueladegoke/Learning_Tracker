import CodeBlock from '../../CodeBlock'
import { Lightbulb, Grid3X3, Calculator, Layers, Zap, Cpu } from 'lucide-react'

export default function DeepDiveDay77() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Section 1: Creating NumPy Arrays */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">01.</span> <Grid3X3 className="w-6 h-6 text-primary-400" /> Creating NumPy Arrays
                    </h2>
                    <p>
                        <strong>NumPy</strong> (Numerical Python) is the foundation of scientific computing. Its core object is the <code>ndarray</code>—a fast, memory-efficient multi-dimensional array.
                    </p>
                    <CodeBlock
                        code={`import numpy as np

# WRONG - common beginner mistake
a = np.array(1, 2, 3, 4)  # TypeError!

# RIGHT - pass a list
a = np.array([1, 2, 3, 4])
print(a)  # [1 2 3 4]

# 2D array (matrix)
matrix = np.array([[1, 2, 3], 
                   [4, 5, 6]])
print(matrix.shape)  # (2, 3)`}
                        language="python"
                    />
                </section>

                {/* Section 2: Array Operations */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">02.</span> <Calculator className="w-6 h-6 text-primary-400" /> Vectorized Operations
                    </h2>
                    <p>
                        NumPy's power comes from <strong>vectorization</strong>—operations apply to entire arrays without loops, running at C speed.
                    </p>
                    <CodeBlock
                        code={`a = np.array([1, 2, 3, 4])

# Element-wise operations
print(a * 2)      # [2 4 6 8]
print(a ** 2)     # [1 4 9 16]
print(a + 10)     # [11 12 13 14]

# Statistics
print(np.mean(a))  # 2.5
print(np.std(a))   # 1.118...
print(np.sum(a))   # 10`}
                        language="python"
                    />
                </section>

                {/* Section 3: Broadcasting */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">03.</span> <Layers className="w-6 h-6 text-primary-400" /> Broadcasting Rules
                    </h2>
                    <p>
                        Broadcasting allows operations on arrays of different shapes. NumPy "stretches" smaller arrays to match larger ones—when dimensions are compatible.
                    </p>
                    <CodeBlock
                        code={`a = np.array([1, 2, 3])       # Shape: (3,)
b = np.array([[1], [2], [3]]) # Shape: (3, 1)

# Broadcasting works - shapes are compatible
result = a + b  # Shape: (3, 3)

# ERROR: shapes not compatible
c = np.array([[1, 2], [3, 4]])  # Shape: (2, 2)
# a + c  # ValueError: shapes (3,) and (2,2)`}
                        language="python"
                    />
                </section>

                {/* Section 4: Indexing and Slicing */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">04.</span> <Zap className="w-6 h-6 text-primary-400" /> Advanced Indexing
                    </h2>
                    <p>
                        NumPy supports powerful slicing, boolean indexing, and fancy indexing for extracting specific elements.
                    </p>
                    <CodeBlock
                        code={`arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

# Slicing: rows 0-1, all columns
print(arr[:2, :])  # [[1 2 3], [4 5 6]]

# Boolean indexing
print(arr[arr > 5])  # [6 7 8 9]

# Fancy indexing
indices = [0, 2]
print(arr[indices])  # Rows 0 and 2`}
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
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1"><Cpu className="w-4 h-4 inline" /> Performance</h4>
                            <p className="text-sm text-surface-400">
                                NumPy operations are 10-100x faster than Python loops. Always prefer vectorized operations.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Shape Matters</h4>
                            <p className="text-sm text-surface-400">
                                Use <code>.shape</code> and <code>.reshape()</code> to inspect and transform array dimensions.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Useful Functions</h4>
                            <p className="text-sm text-surface-400">
                                <code>np.zeros()</code>, <code>np.ones()</code>, <code>np.arange()</code>, <code>np.linspace()</code> for array creation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
