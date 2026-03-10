import { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { logError } from '@/utils/logger'
import { PYODIDE_LOAD_FAILED } from '@/constants/errorIds'

const PYODIDE_CDN_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/"
const PythonContext = createContext(null)

export function PythonProvider({ children }) {
    const [pyodide, setPyodide] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [loadingProgress, setLoadingProgress] = useState(0)
    const pyodideRef = useRef(null)

    // Mutex for sequential execution to prevent stdout/stderr race conditions
    const executionMutex = useRef(Promise.resolve())

    // Extracted load function that can be called for retry
    const loadPyodideInstance = useCallback(async () => {
        // If already loaded, don't load again
        if (pyodideRef.current) return pyodideRef.current

        setIsLoading(true)
        setError(null)
        setLoadingProgress(10)

        try {
            // Dynamic import of pyodide
            const pyodideModule = await import('pyodide')
            setLoadingProgress(30)

            // Load Pyodide - use CDN for assets since Vite doesn't serve them locally
            const py = await pyodideModule.loadPyodide({
                indexURL: PYODIDE_CDN_URL
            })

            setLoadingProgress(90)
            pyodideRef.current = py
            setPyodide(py)
            setLoadingProgress(100)
            return py
        } catch (err) {
            logError(PYODIDE_LOAD_FAILED, { error: err.message })
            setError(err.message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Retry function exposed to consumers
    const retryLoad = useCallback(async () => {
        pyodideRef.current = null
        setPyodide(null)
        return loadPyodideInstance()
    }, [loadPyodideInstance])

    useEffect(() => {
        loadPyodideInstance().catch(() => {
            // Error already handled in loadPyodideInstance
        })
    }, [loadPyodideInstance])

    // Safe execution method that handles locking and output capture
    const runPython = useCallback(async (code, { onStdout, onStderr } = {}) => {
        if (!pyodideRef.current) {
            throw new Error('Python runtime not loaded')
        }

        // Chain execution to the mutex to ensure sequential access
        const execution = executionMutex.current.then(async () => {
            const py = pyodideRef.current

            // Reset streams
            if (onStdout) py.setStdout({ batched: onStdout })
            if (onStderr) py.setStderr({ batched: onStderr })

            try {
                return await py.runPythonAsync(code)
            } finally {
                // Cleanup streams to prevent leaking output to wrong caller
                py.setStdout({ batched: () => { } })
                py.setStderr({ batched: () => { } })
            }
        })

        // Update mutex to point to this new execution (catch error to keep chain alive)
        executionMutex.current = execution.catch((err) => {
            console.error('[Python Execution Error]', {
                error: err?.message || err,
                stack: err?.stack
            });
        })

        return execution
    }, [])

    const value = useMemo(() => ({
        pyodide,
        runPython, // Expose the safe runner instead of raw pyodide where possible
        isLoading,
        error,
        loadingProgress,
        retryLoad,
        isReady: !isLoading && !error && pyodide !== null
    }), [pyodide, runPython, isLoading, error, loadingProgress, retryLoad])

    return (
        <PythonContext.Provider value={value}>
            {children}
        </PythonContext.Provider>
    )
}

export function usePythonContext() {
    const context = useContext(PythonContext)
    if (!context) {
        throw new Error('usePythonContext must be used within a PythonProvider')
    }
    return context
}
