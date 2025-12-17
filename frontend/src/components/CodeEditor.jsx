import { useState, useEffect, useRef } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import { Check, X, RotateCcw, Play, Send } from 'lucide-react'
import { usePythonRunner } from '../hooks/usePythonRunner'

function CodeEditor({
  starterCode = '',
  testCases = [],
  onResult,
  questionId,
  readOnly = false
}) {
  const [code, setCode] = useState(starterCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState(null)
  const [activeTab, setActiveTab] = useState('code') // 'code' | 'output' | 'tests'

  const { runCode, runTestCases, isLoading, loadingProgress, isReady, error: pyError } = usePythonRunner()

  // Reset code when starter code changes
  useEffect(() => {
    setCode(starterCode)
    setOutput('')
    setTestResults(null)
  }, [starterCode, questionId])

  const handleRun = async () => {
    if (!isReady) return

    setIsRunning(true)
    setOutput('')
    setActiveTab('output')

    try {
      const result = await runCode(code)

      if (result.error) {
        setOutput(`Error:\n${result.error}`)
      } else {
        setOutput(result.output || '(No output)')
      }
    } catch (err) {
      setOutput(`Execution error: ${err.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    if (!isReady || testCases.length === 0) return

    setIsRunning(true)
    setTestResults(null)
    setActiveTab('tests')

    try {
      const results = await runTestCases(code, testCases)
      setTestResults(results)

      const passed = results.filter(r => r.passed).length
      const total = results.length

      // Report result to parent
      if (onResult) {
        onResult({
          questionId,
          code,
          passed,
          total,
          allPassed: passed === total
        })
      }
    } catch (err) {
      setOutput(`Test error: ${err.message}`)
      setActiveTab('output')
    } finally {
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your code? This cannot be undone.')) {
      setCode(starterCode)
      setOutput('')
      setTestResults(null)
      setActiveTab('code')
    }
  }

  return (
    <div className="code-editor rounded-xl overflow-hidden border border-surface-700 bg-[#282c34] shadow-2xl">
      {/* Header with tabs */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#21252b] border-b border-white/5">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'code'
              ? 'bg-primary-500/10 text-primary-400 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]'
              : 'text-surface-500 hover:text-surface-300 hover:bg-white/5'
              }`}
          >
            Terminal
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'output'
              ? 'bg-primary-500/10 text-primary-400 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]'
              : 'text-surface-500 hover:text-surface-300 hover:bg-white/5'
              }`}
          >
            Output
          </button>
          {testCases.length > 0 && (
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'tests'
                ? 'bg-primary-500/10 text-primary-400 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]'
                : 'text-surface-500 hover:text-surface-300 hover:bg-white/5'
                }`}
            >
              Test Suite {testResults && <span className="ml-1 opacity-60">({testResults.filter(r => r.passed).length}/{testResults.length})</span>}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isReady && (
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-amber-500">
                {pyError ? 'Core Offline' : `Syncing Python: ${loadingProgress}%`}
              </span>
            </div>
          )}
          <button
            onClick={handleReset}
            className="p-1.5 text-surface-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all"
            title="Reset to starter code"
            disabled={isRunning}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code editor with CodeMirror */}
      {activeTab === 'code' && (
        <div className="relative group">
          <CodeMirror
            value={code}
            height="320px"
            theme={oneDark}
            extensions={[python()]}
            onChange={(value) => setCode(value)}
            className="text-sm border-0 focus:outline-none"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              foldGutter: true,
            }}
            readOnly={readOnly}
          />
          {readOnly && (
            <div className="absolute inset-0 bg-black/5 pointer-events-none border-t border-white/5"></div>
          )}
        </div>
      )}

      {/* Output panel */}
      {activeTab === 'output' && (
        <div className="p-4 min-h-[200px] font-mono text-sm">
          {isRunning ? (
            <div className="flex items-center gap-2 text-surface-400">
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              Running code...
            </div>
          ) : output ? (
            <pre className={`whitespace-pre-wrap ${output.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
              {output}
            </pre>
          ) : (
            <span className="text-surface-500">Click "Run" to execute your code</span>
          )}
        </div>
      )}

      {/* Test results panel */}
      {activeTab === 'tests' && (
        <div className="p-4 min-h-[200px] space-y-3">
          {isRunning ? (
            <div className="flex items-center gap-2 text-surface-400">
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              Running tests...
            </div>
          ) : testResults ? (
            <>
              {/* Summary */}
              <div className={`p-3 rounded-lg ${testResults.every(r => r.passed)
                ? 'bg-emerald-500/10 border border-emerald-500/30'
                : 'bg-amber-500/10 border border-amber-500/30'
                }`}>
                <span className={`font-medium ${testResults.every(r => r.passed) ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                  {testResults.filter(r => r.passed).length} of {testResults.length} tests passed
                </span>
              </div>

              {/* Individual test results */}
              {testResults.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${result.passed
                    ? 'bg-surface-800 border-surface-700'
                    : 'bg-red-500/5 border-red-500/30'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-lg ${result.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.passed ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                    </span>
                    <span className="text-sm font-medium text-surface-200">
                      Test {idx + 1}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="text-surface-400">
                      Input: <span className="text-surface-300">{result.input}</span>
                    </div>
                    <div className="text-surface-400">
                      Expected: <span className="text-emerald-400">{String(result.expected)}</span>
                    </div>
                    <div className="text-surface-400">
                      Got: <span className={result.passed ? 'text-emerald-400' : 'text-red-400'}>
                        {result.actual || '(no output)'}
                      </span>
                    </div>
                    {result.error && (
                      <div className="text-red-400 mt-2">Error: {result.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <span className="text-surface-500">Click "Submit" to run tests</span>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#21252b] border-t border-white/5">
        <div className="text-[10px] font-bold uppercase tracking-widest text-surface-500">
          {testCases.length > 0 && `${testCases.length} Logic Gate${testCases.length > 1 ? 's' : ''} Active`}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRun}
            disabled={!isReady || isRunning}
            className="px-5 py-2 bg-surface-700 hover:bg-surface-600 disabled:opacity-50 disabled:cursor-not-allowed text-surface-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-black/20 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Execute
          </button>
          {testCases.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={!isReady || isRunning}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-primary-900/40 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" /> Deploy Code
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodeEditor



