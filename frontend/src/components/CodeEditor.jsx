import { useState, useEffect, useRef } from 'react'
import { Check, X } from 'lucide-react'
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
  const textareaRef = useRef(null)

  const { runCode, runTestCases, isLoading, loadingProgress, isReady, error: pyError } = usePythonRunner()

  // Reset code when starter code changes
  useEffect(() => {
    setCode(starterCode)
    setOutput('')
    setTestResults(null)
  }, [starterCode, questionId])

  // Handle tab key for indentation
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newCode = code.substring(0, start) + '    ' + code.substring(end)
      setCode(newCode)
      // Move cursor after the inserted spaces
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4
      }, 0)
    }
  }

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
    setCode(starterCode)
    setOutput('')
    setTestResults(null)
    setActiveTab('code')
  }

  // Line numbers
  const lineCount = code.split('\n').length
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1)

  return (
    <div className="code-editor rounded-xl overflow-hidden border border-surface-700 bg-surface-900">
      {/* Header with tabs */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface-800 border-b border-surface-700">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${activeTab === 'code'
              ? 'bg-primary-600 text-white'
              : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700'
              }`}
          >
            Code
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${activeTab === 'output'
              ? 'bg-primary-600 text-white'
              : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700'
              }`}
          >
            Output
          </button>
          {testCases.length > 0 && (
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${activeTab === 'tests'
                ? 'bg-primary-600 text-white'
                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700'
                }`}
            >
              Tests {testResults && `(${testResults.filter(r => r.passed).length}/${testResults.length})`}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isReady && (
            <span className="text-xs text-surface-400">
              {pyError ? 'Python failed to load' : `Loading Python... ${loadingProgress}%`}
            </span>
          )}
          <button
            onClick={handleReset}
            className="px-3 py-1 text-xs text-surface-400 hover:text-surface-200 transition-colors"
            disabled={isRunning}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Code editor with line numbers */}
      {activeTab === 'code' && (
        <div className="flex">
          {/* Line numbers */}
          <div className="py-4 px-2 bg-surface-850 text-surface-500 text-right text-sm font-mono select-none border-r border-surface-700 min-w-[3rem]">
            {lineNumbers.map(num => (
              <div key={num} className="leading-6">{num}</div>
            ))}
          </div>

          {/* Code textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-4 bg-transparent text-surface-100 font-mono text-sm resize-none outline-none leading-6 min-h-[200px]"
            style={{ tabSize: 4 }}
            spellCheck={false}
            readOnly={readOnly}
            placeholder="Write your Python code here..."
          />
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
      <div className="flex items-center justify-between px-4 py-3 bg-surface-800 border-t border-surface-700">
        <div className="text-xs text-surface-500">
          {testCases.length > 0 && `${testCases.length} test case${testCases.length > 1 ? 's' : ''}`}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRun}
            disabled={!isReady || isRunning}
            className="px-4 py-2 bg-surface-700 hover:bg-surface-600 disabled:opacity-50 disabled:cursor-not-allowed text-surface-200 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <span>▶</span> Run
          </button>
          {testCases.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={!isReady || isRunning}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodeEditor


