import { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react'

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

    useEffect(() => {
        let isMounted = true

        async function loadPyodide() {
            // If already loaded, don't load again
            if (pyodideRef.current) return

            try {
                setLoadingProgress(10)

                // Dynamic import of pyodide
                const pyodideModule = await import('pyodide')

                if (!isMounted) return
                setLoadingProgress(30)

                // Load Pyodide - use CDN for assets since Vite doesn't serve them locally
                const py = await pyodideModule.loadPyodide({
                    indexURL: PYODIDE_CDN_URL
                })

                if (!isMounted) return
                setLoadingProgress(90)

                pyodideRef.current = py
                setPyodide(py)
                setLoadingProgress(100)
            } catch (err) {
                console.error('Failed to load Pyodide:', err)
                if (isMounted) {
                    setError(err.message)
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        loadPyodide()

        return () => {
            isMounted = false
        }
    }, [])

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
        executionMutex.current = execution.catch(() => { })

        return execution
    }, [])

    const value = useMemo(() => ({
        pyodide,
        runPython, // Expose the safe runner instead of raw pyodide where possible
        isLoading,
        error,
        loadingProgress,
        isReady: !isLoading && !error && pyodide !== null
    }), [pyodide, runPython, isLoading, error, loadingProgress])

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
