import { lazy, Suspense, Component } from 'react'
import { Loader2, AlertTriangle } from 'lucide-react'

/**
 * Loading fallback component for lazy-loaded DeepDive content
 */
const DeepDiveLoadingSpinner = () => (
    <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
        <span className="ml-3 text-surface-300">Loading content...</span>
    </div>
)

/**
 * Fallback for days without DeepDive content
 */
const ComingSoon = ({ day }) => (
    <div className="text-surface-400 p-8">
        Deep Dive for {day} coming soon...
    </div>
)

/**
 * Error boundary for catching lazy load failures
 */
class DeepDiveErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('DeepDive load error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                    <AlertTriangle className="w-12 h-12 text-amber-400 mb-4" />
                    <h3 className="text-lg font-semibold text-surface-200 mb-2">
                        Content Unavailable
                    </h3>
                    <p className="text-surface-400 mb-4">
                        Unable to load this day's content. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            )
        }
        return this.props.children
    }
}

/**
 * Single source of truth for DeepDive component mapping
 * Using explicit imports to avoid Vite build issues with dynamic paths
 */
const DEEP_DIVE_COMPONENTS = {
    'day-1': lazy(() => import('./DeepDive/Day1')),
    'day-2': lazy(() => import('./DeepDive/Day2')),
    'day-3': lazy(() => import('./DeepDive/Day3')),
    'day-4': lazy(() => import('./DeepDive/Day4')),
    'day-5': lazy(() => import('./DeepDive/Day5')),
    'day-6': lazy(() => import('./DeepDive/Day6')),
    'day-7': lazy(() => import('./DeepDive/Day7')),
    'day-8': lazy(() => import('./DeepDive/Day8')),
    'day-9': lazy(() => import('./DeepDive/Day9')),
    'day-10': lazy(() => import('./DeepDive/Day10')),
    'day-11': lazy(() => import('./DeepDive/Day11')),
    'day-12': lazy(() => import('./DeepDive/Day12')),
    'day-13': lazy(() => import('./DeepDive/Day13')),
    'day-14': lazy(() => import('./DeepDive/Day14')),
    'day-15': lazy(() => import('./DeepDive/Day15')),
    'day-16': lazy(() => import('./DeepDive/Day16')),
    'day-17': lazy(() => import('./DeepDive/Day17')),
    'day-18': lazy(() => import('./DeepDive/Day18')),
    'day-19': lazy(() => import('./DeepDive/Day19')),
    'day-20': lazy(() => import('./DeepDive/Day20')),
    'day-21': lazy(() => import('./DeepDive/Day21')),
    'day-22': lazy(() => import('./DeepDive/Day22')),
    'day-23': lazy(() => import('./DeepDive/Day23')),
    'day-24': lazy(() => import('./DeepDive/Day24')),
    'day-25': lazy(() => import('./DeepDive/Day25')),
    'day-26': lazy(() => import('./DeepDive/Day26')),
    'day-27': lazy(() => import('./DeepDive/Day27')),
    'day-28': lazy(() => import('./DeepDive/Day28')),
    'day-29': lazy(() => import('./DeepDive/Day29')),
    'day-30': lazy(() => import('./DeepDive/Day30')),
    'day-31': lazy(() => import('./DeepDive/Day31')),
    'day-32': lazy(() => import('./DeepDive/Day32')),
    'day-33': lazy(() => import('./DeepDive/Day33')),
    'day-34': lazy(() => import('./DeepDive/Day34')),
    'day-35': lazy(() => import('./DeepDive/Day35')),
    'day-36': lazy(() => import('./DeepDive/Day36')),
    'day-37': lazy(() => import('./DeepDive/Day37')),
    'day-38': lazy(() => import('./DeepDive/Day38')),
    'day-39': lazy(() => import('./DeepDive/Day39')),
    'day-40': lazy(() => import('./DeepDive/Day40')),
    'day-41': lazy(() => import('./DeepDive/Day41')),
    'day-42': lazy(() => import('./DeepDive/Day42')),
    'day-43': lazy(() => import('./DeepDive/Day43')),
    'day-44': lazy(() => import('./DeepDive/Day44')),
    'day-45': lazy(() => import('./DeepDive/Day45')),
    'day-46': lazy(() => import('./DeepDive/Day46')),
    'day-47': lazy(() => import('./DeepDive/Day47')),
    'day-48': lazy(() => import('./DeepDive/Day48')),
    'day-49': lazy(() => import('./DeepDive/Day49')),
    'day-50': lazy(() => import('./DeepDive/Day50')),
    'day-51': lazy(() => import('./DeepDive/Day51')),
    'day-52': lazy(() => import('./DeepDive/Day52')),
    'day-53': lazy(() => import('./DeepDive/Day53')),
    'day-54': lazy(() => import('./DeepDive/Day54')),
    'day-55': lazy(() => import('./DeepDive/Day55')),
    'day-56': lazy(() => import('./DeepDive/Day56')),
    'day-57': lazy(() => import('./DeepDive/Day57')),
    'day-58': lazy(() => import('./DeepDive/Day58')),
    'day-59': lazy(() => import('./DeepDive/Day59')),
    'day-60': lazy(() => import('./DeepDive/Day60')),
    'day-61': lazy(() => import('./DeepDive/Day61')),
    'day-62': lazy(() => import('./DeepDive/Day62')),
    'day-63': lazy(() => import('./DeepDive/Day63')),
    'day-64': lazy(() => import('./DeepDive/Day64')),
    'day-65': lazy(() => import('./DeepDive/Day65')),
    'day-66': lazy(() => import('./DeepDive/Day66')),
    'day-67': lazy(() => import('./DeepDive/Day67')),
    'day-68': lazy(() => import('./DeepDive/Day68')),
    'day-69': lazy(() => import('./DeepDive/Day69')),
    'day-70': lazy(() => import('./DeepDive/Day70')),
    'day-71': lazy(() => import('./DeepDive/Day71')),
    'day-72': lazy(() => import('./DeepDive/Day72')),
    'day-73': lazy(() => import('./DeepDive/Day73')),
    'day-74': lazy(() => import('./DeepDive/Day74')),
    'day-75': lazy(() => import('./DeepDive/Day75')),
    'day-76': lazy(() => import('./DeepDive/Day76')),
    'day-77': lazy(() => import('./DeepDive/Day77')),
    'day-78': lazy(() => import('./DeepDive/Day78')),
    'day-79': lazy(() => import('./DeepDive/Day79')),
    'day-80': lazy(() => import('./DeepDive/Day80')),
    'day-81': lazy(() => import('./DeepDive/Day81')),
    'day-82': lazy(() => import('./DeepDive/Day82')),
    'day-83': lazy(() => import('./DeepDive/Day83')),
    'day-84': lazy(() => import('./DeepDive/Day84')),
    'day-85': lazy(() => import('./DeepDive/Day85')),
    'day-86': lazy(() => import('./DeepDive/Day86')),
    'day-87': lazy(() => import('./DeepDive/Day87')),
    'day-88': lazy(() => import('./DeepDive/Day88')),
    'day-89': lazy(() => import('./DeepDive/Day89')),
    'day-90': lazy(() => import('./DeepDive/Day90')),
    'day-91': lazy(() => import('./DeepDive/Day91')),
    'day-92': lazy(() => import('./DeepDive/Day92')),
    'day-93': lazy(() => import('./DeepDive/Day93')),
    'day-94': lazy(() => import('./DeepDive/Day94')),
    'day-95': lazy(() => import('./DeepDive/Day95')),
    'day-96': lazy(() => import('./DeepDive/Day96')),
    'day-97': lazy(() => import('./DeepDive/Day97')),
    'day-98': lazy(() => import('./DeepDive/Day98')),
    'day-99': lazy(() => import('./DeepDive/Day99')),
    'day-100': lazy(() => import('./DeepDive/Day100')),
}

/**
 * DeepDive component loader with lazy loading and Suspense
 * @param {Object} props
 * @param {string} props.activeDay - The day key (e.g., 'day-1')
 */
export function DeepDiveLoader({ activeDay }) {
    const Component = DEEP_DIVE_COMPONENTS[activeDay]

    if (!Component) {
        return <ComingSoon day={activeDay} />
    }

    return (
        <DeepDiveErrorBoundary>
            <Suspense fallback={<DeepDiveLoadingSpinner />}>
                <Component />
            </Suspense>
        </DeepDiveErrorBoundary>
    )
}

export default DeepDiveLoader
