import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexReactClient, ConvexProvider } from 'convex/react'
import App from './App'
import './index.css'

const convexUrl = import.meta.env.VITE_CONVEX_URL
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Only create Convex client if URL is defined
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null

function DevModeApp() {
  // In dev mode without Clerk, still wrap with ConvexProvider if available
  if (convex) {
    return (
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    )
  }
  // Fallback: no Convex at all (will show errors if components use useQuery)
  return <App />
}

function AuthenticatedApp() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {clerkPubKey && clerkPubKey !== 'pk_test_REPLACE_WITH_YOUR_KEY' && convex ? (
      <AuthenticatedApp />
    ) : (
      <DevModeApp />
    )}
  </React.StrictMode>,
)
