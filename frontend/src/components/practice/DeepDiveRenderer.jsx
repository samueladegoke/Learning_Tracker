import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'

// Lazy load DeepDive components for code splitting
// Relative path from src/components/practice/DeepDiveRenderer.jsx 
// to src/components/content/DeepDive/DayX.jsx is ../content/DeepDive/DayX
const DeepDiveDay1 = lazy(() => import('../content/DeepDive/Day1'))
const DeepDiveDay2 = lazy(() => import('../content/DeepDive/Day2'))
const DeepDiveDay3 = lazy(() => import('../content/DeepDive/Day3'))
const DeepDiveDay4 = lazy(() => import('../content/DeepDive/Day4'))
const DeepDiveDay5 = lazy(() => import('../content/DeepDive/Day5'))
const DeepDiveDay6 = lazy(() => import('../content/DeepDive/Day6'))
const DeepDiveDay7 = lazy(() => import('../content/DeepDive/Day7'))
const DeepDiveDay8 = lazy(() => import('../content/DeepDive/Day8'))
const DeepDiveDay9 = lazy(() => import('../content/DeepDive/Day9'))
const DeepDiveDay10 = lazy(() => import('../content/DeepDive/Day10'))
const DeepDiveDay11 = lazy(() => import('../content/DeepDive/Day11'))
const DeepDiveDay12 = lazy(() => import('../content/DeepDive/Day12'))
const DeepDiveDay13 = lazy(() => import('../content/DeepDive/Day13'))
const DeepDiveDay14 = lazy(() => import('../content/DeepDive/Day14'))
const DeepDiveDay15 = lazy(() => import('../content/DeepDive/Day15'))
const DeepDiveDay16 = lazy(() => import('../content/DeepDive/Day16'))
const DeepDiveDay17 = lazy(() => import('../content/DeepDive/Day17'))
const DeepDiveDay18 = lazy(() => import('../content/DeepDive/Day18'))
const DeepDiveDay19 = lazy(() => import('../content/DeepDive/Day19'))
const DeepDiveDay20 = lazy(() => import('../content/DeepDive/Day20'))
const DeepDiveDay21 = lazy(() => import('../content/DeepDive/Day21'))
const DeepDiveDay22 = lazy(() => import('../content/DeepDive/Day22'))
const DeepDiveDay23 = lazy(() => import('../content/DeepDive/Day23'))
const DeepDiveDay24 = lazy(() => import('../content/DeepDive/Day24'))
const DeepDiveDay25 = lazy(() => import('../content/DeepDive/Day25'))
const DeepDiveDay26 = lazy(() => import('../content/DeepDive/Day26'))
const DeepDiveDay27 = lazy(() => import('../content/DeepDive/Day27'))
const DeepDiveDay28 = lazy(() => import('../content/DeepDive/Day28'))
const DeepDiveDay29 = lazy(() => import('../content/DeepDive/Day29'))
const DeepDiveDay30 = lazy(() => import('../content/DeepDive/Day30'))
const DeepDiveDay31 = lazy(() => import('../content/DeepDive/Day31'))
const DeepDiveDay32 = lazy(() => import('../content/DeepDive/Day32'))
const DeepDiveDay33 = lazy(() => import('../content/DeepDive/Day33'))
const DeepDiveDay34 = lazy(() => import('../content/DeepDive/Day34'))
const DeepDiveDay35 = lazy(() => import('../content/DeepDive/Day35'))
const DeepDiveDay36 = lazy(() => import('../content/DeepDive/Day36'))
const DeepDiveDay37 = lazy(() => import('../content/DeepDive/Day37'))
const DeepDiveDay38 = lazy(() => import('../content/DeepDive/Day38'))
const DeepDiveDay39 = lazy(() => import('../content/DeepDive/Day39'))
const DeepDiveDay40 = lazy(() => import('../content/DeepDive/Day40'))
const DeepDiveDay41 = lazy(() => import('../content/DeepDive/Day41'))
const DeepDiveDay42 = lazy(() => import('../content/DeepDive/Day42'))
const DeepDiveDay43 = lazy(() => import('../content/DeepDive/Day43'))
const DeepDiveDay44 = lazy(() => import('../content/DeepDive/Day44'))
const DeepDiveDay45 = lazy(() => import('../content/DeepDive/Day45'))
const DeepDiveDay46 = lazy(() => import('../content/DeepDive/Day46'))
const DeepDiveDay47 = lazy(() => import('../content/DeepDive/Day47'))
const DeepDiveDay48 = lazy(() => import('../content/DeepDive/Day48'))
const DeepDiveDay49 = lazy(() => import('../content/DeepDive/Day49'))
const DeepDiveDay50 = lazy(() => import('../content/DeepDive/Day50'))
const DeepDiveDay51 = lazy(() => import('../content/DeepDive/Day51'))
const DeepDiveDay52 = lazy(() => import('../content/DeepDive/Day52'))
const DeepDiveDay53 = lazy(() => import('../content/DeepDive/Day53'))
const DeepDiveDay54 = lazy(() => import('../content/DeepDive/Day54'))
const DeepDiveDay55 = lazy(() => import('../content/DeepDive/Day55'))
const DeepDiveDay56 = lazy(() => import('../content/DeepDive/Day56'))
const DeepDiveDay57 = lazy(() => import('../content/DeepDive/Day57'))
const DeepDiveDay58 = lazy(() => import('../content/DeepDive/Day58'))
const DeepDiveDay59 = lazy(() => import('../content/DeepDive/Day59'))
const DeepDiveDay60 = lazy(() => import('../content/DeepDive/Day60'))
const DeepDiveDay61 = lazy(() => import('../content/DeepDive/Day61'))
const DeepDiveDay62 = lazy(() => import('../content/DeepDive/Day62'))
const DeepDiveDay63 = lazy(() => import('../content/DeepDive/Day63'))
const DeepDiveDay64 = lazy(() => import('../content/DeepDive/Day64'))
const DeepDiveDay65 = lazy(() => import('../content/DeepDive/Day65'))
const DeepDiveDay66 = lazy(() => import('../content/DeepDive/Day66'))
const DeepDiveDay67 = lazy(() => import('../content/DeepDive/Day67'))
const DeepDiveDay68 = lazy(() => import('../content/DeepDive/Day68'))
const DeepDiveDay69 = lazy(() => import('../content/DeepDive/Day69'))
const DeepDiveDay70 = lazy(() => import('../content/DeepDive/Day70'))
const DeepDiveDay71 = lazy(() => import('../content/DeepDive/Day71'))
const DeepDiveDay72 = lazy(() => import('../content/DeepDive/Day72'))
const DeepDiveDay73 = lazy(() => import('../content/DeepDive/Day73'))
const DeepDiveDay74 = lazy(() => import('../content/DeepDive/Day74'))
const DeepDiveDay75 = lazy(() => import('../content/DeepDive/Day75'))
const DeepDiveDay76 = lazy(() => import('../content/DeepDive/Day76'))
const DeepDiveDay77 = lazy(() => import('../content/DeepDive/Day77'))
const DeepDiveDay78 = lazy(() => import('../content/DeepDive/Day78'))
const DeepDiveDay79 = lazy(() => import('../content/DeepDive/Day79'))
const DeepDiveDay80 = lazy(() => import('../content/DeepDive/Day80'))
const DeepDiveDay81 = lazy(() => import('../content/DeepDive/Day81'))
const DeepDiveDay82 = lazy(() => import('../content/DeepDive/Day82'))
const DeepDiveDay83 = lazy(() => import('../content/DeepDive/Day83'))
const DeepDiveDay84 = lazy(() => import('../content/DeepDive/Day84'))
const DeepDiveDay85 = lazy(() => import('../content/DeepDive/Day85'))

const components = {
    'day-1': DeepDiveDay1,
    'day-2': DeepDiveDay2,
    'day-3': DeepDiveDay3,
    'day-4': DeepDiveDay4,
    'day-5': DeepDiveDay5,
    'day-6': DeepDiveDay6,
    'day-7': DeepDiveDay7,
    'day-8': DeepDiveDay8,
    'day-9': DeepDiveDay9,
    'day-10': DeepDiveDay10,
    'day-11': DeepDiveDay11,
    'day-12': DeepDiveDay12,
    'day-13': DeepDiveDay13,
    'day-14': DeepDiveDay14,
    'day-15': DeepDiveDay15,
    'day-16': DeepDiveDay16,
    'day-17': DeepDiveDay17,
    'day-18': DeepDiveDay18,
    'day-19': DeepDiveDay19,
    'day-20': DeepDiveDay20,
    'day-21': DeepDiveDay21,
    'day-22': DeepDiveDay22,
    'day-23': DeepDiveDay23,
    'day-24': DeepDiveDay24,
    'day-25': DeepDiveDay25,
    'day-26': DeepDiveDay26,
    'day-27': DeepDiveDay27,
    'day-28': DeepDiveDay28,
    'day-29': DeepDiveDay29,
    'day-30': DeepDiveDay30,
    'day-31': DeepDiveDay31,
    'day-32': DeepDiveDay32,
    'day-33': DeepDiveDay33,
    'day-34': DeepDiveDay34,
    'day-35': DeepDiveDay35,
    'day-36': DeepDiveDay36,
    'day-37': DeepDiveDay37,
    'day-38': DeepDiveDay38,
    'day-39': DeepDiveDay39,
    'day-40': DeepDiveDay40,
    'day-41': DeepDiveDay41,
    'day-42': DeepDiveDay42,
    'day-43': DeepDiveDay43,
    'day-44': DeepDiveDay44,
    'day-45': DeepDiveDay45,
    'day-46': DeepDiveDay46,
    'day-47': DeepDiveDay47,
    'day-48': DeepDiveDay48,
    'day-49': DeepDiveDay49,
    'day-50': DeepDiveDay50,
    'day-51': DeepDiveDay51,
    'day-52': DeepDiveDay52,
    'day-53': DeepDiveDay53,
    'day-54': DeepDiveDay54,
    'day-55': DeepDiveDay55,
    'day-56': DeepDiveDay56,
    'day-57': DeepDiveDay57,
    'day-58': DeepDiveDay58,
    'day-59': DeepDiveDay59,
    'day-60': DeepDiveDay60,
    'day-61': DeepDiveDay61,
    'day-62': DeepDiveDay62,
    'day-63': DeepDiveDay63,
    'day-64': DeepDiveDay64,
    'day-65': DeepDiveDay65,
    'day-66': DeepDiveDay66,
    'day-67': DeepDiveDay67,
    'day-68': DeepDiveDay68,
    'day-69': DeepDiveDay69,
    'day-70': DeepDiveDay70,
    'day-71': DeepDiveDay71,
    'day-72': DeepDiveDay72,
    'day-73': DeepDiveDay73,
    'day-74': DeepDiveDay74,
    'day-75': DeepDiveDay75,
    'day-76': DeepDiveDay76,
    'day-77': DeepDiveDay77,
    'day-78': DeepDiveDay78,
    'day-79': DeepDiveDay79,
    'day-80': DeepDiveDay80,
    'day-81': DeepDiveDay81,
    'day-82': DeepDiveDay82,
    'day-83': DeepDiveDay83,
    'day-84': DeepDiveDay84,
    'day-85': DeepDiveDay85
}

const DeepDiveLoader = () => (
    <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
        <span className="ml-3 text-surface-300">Loading content...</span>
    </div>
)

export function DeepDiveRenderer({ activeDay }) {
    const Component = components[activeDay]
    if (!Component) {
        return <div className="text-surface-400 p-8">Deep Dive for {activeDay} coming soon...</div>
    }
    return (
        <Suspense fallback={<DeepDiveLoader />}>
            <Component />
        </Suspense>
    )
}
