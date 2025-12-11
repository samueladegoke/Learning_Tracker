import { useCallback } from 'react'
import { usePythonContext } from '../contexts/PythonContext'

export function usePythonRunner() {
  const { runPython, isLoading, error, loadingProgress, isReady } = usePythonContext()

  const runCode = useCallback(async (code, timeout = 5000) => {
    if (!isReady) {
      return { error: 'Python runtime not loaded yet. Please wait...' }
    }

    const stdout = []
    const stderr = []

    try {
      // Create a promise that rejects on timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Execution timeout - code took too long')), timeout)
      })

      // Run the code with timeout using the safe context runner
      const result = await Promise.race([
        runPython(code, {
          onStdout: (text) => stdout.push(text),
          onStderr: (text) => stderr.push(text)
        }),
        timeoutPromise
      ])

      return {
        output: stdout.join(''),
        result: result !== undefined ? String(result) : null,
        error: stderr.length > 0 ? stderr.join('') : null
      }
    } catch (err) {
      // Format Python errors nicely
      let errorMessage = err.message
      if (err.message && err.message.includes('PythonError')) {
        // Extract the relevant part of Python traceback
        const lines = err.message.split('\n')
        const relevantLines = lines.filter(line =>
          !line.includes('pyodide') &&
          !line.includes('runPythonAsync')
        )
        errorMessage = relevantLines.join('\n') || err.message
      }

      return {
        output: stdout.join(''),
        error: errorMessage
      }
    }
  }, [isReady, runPython])

  const runTestCases = useCallback(async (code, testCases) => {
    if (!isReady) {
      return [{
        passed: false,
        error: 'Python runtime not loaded yet'
      }]
    }

    const results = []
    const RESULT_DELIMITER = '___RESULT_DELIMITER___'

    for (const test of testCases) {
      // Validate test case structure before use
      if (!test || typeof test.function_call !== 'string') {
        results.push({
          passed: false,
          expected: test?.expected,
          actual: null,
          input: 'Invalid test case',
          error: 'Test case is missing or malformed'
        })
        continue
      }

      // Basic sanitization: ensure it looks like a function call
      const safeCallPattern = /^[a-zA-Z_][a-zA-Z0-9_]*\(.*\)$/
      if (!safeCallPattern.test(test.function_call)) {
        results.push({
          passed: false,
          expected: test.expected,
          actual: null,
          input: test.function_call,
          error: 'Invalid function call format in test case'
        })
        continue
      }

      // Construct test code: user code + print delimiter + print(function_call)
      // Use repr() for strings to handle quotes correctly, or strictly cast to str
      // We interpret the DB expected values as strings mostly
      const testCode = `${code}
__result__ = ${test.function_call}
print("${RESULT_DELIMITER}")
print(__result__)`

      const result = await runCode(testCode)

      // Separate user output (stdout) from test result (the last print)
      const fullOutput = result.output || ''
      const parts = fullOutput.split(RESULT_DELIMITER)

      // If split found the delimiter, the second part is our result (with potential newline trim)
      // If not found, something went wrong or user printed the delimiter (unlikely)
      const actualReturnValue = parts.length > 1 ? parts[1].trim() : fullOutput.trim()

      const expectedOutput = String(test.expected)

      // Compare only the return value
      const passed = actualReturnValue === expectedOutput

      results.push({
        passed,
        expected: test.expected,
        actual: actualReturnValue,
        input: test.function_call,
        error: result.error
      })
    }

    return results
  }, [isReady, runCode])

  const validateSyntax = useCallback(async (code) => {
    if (!isReady) {
      return { valid: false, error: 'Python runtime not loaded' }
    }

    try {
      // Encode code as base64 to avoid any string escaping issues
      const codeBase64 = btoa(unescape(encodeURIComponent(code)))

      // Use Python's compile() to check syntax without executing
      const checkCode = `
import ast
import base64

try:
    code_bytes = base64.b64decode("${codeBase64}")
    code_str = code_bytes.decode('utf-8')
    ast.parse(code_str)
    print("VALID")
except SyntaxError as e:
    print(f"SYNTAX_ERROR: Line {e.lineno}: {e.msg}")
except Exception as e:
    print(f"SYNTAX_ERROR: {str(e)}")
`
      const result = await runCode(checkCode)

      if (result.output?.includes('VALID')) {
        return { valid: true }
      } else {
        const errorMatch = result.output?.match(/SYNTAX_ERROR: (.+)/)
        return {
          valid: false,
          error: errorMatch ? errorMatch[1] : 'Syntax error in code'
        }
      }
    } catch (err) {
      return { valid: false, error: err.message }
    }
  }, [isReady, runCode])

  return {
    runCode,
    runTestCases,
    validateSyntax,
    isLoading,
    loadingProgress,
    error,
    isReady
  }
}
