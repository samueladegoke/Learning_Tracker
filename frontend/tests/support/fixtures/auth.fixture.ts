import { test as base } from '@playwright/test';
import { createUser } from '../factories/user.factory';

export type AuthFixture = {
    loginPage: {
        visit: () => Promise<void>;
        login: (email?: string, password?: string) => Promise<void>;
        logout: () => Promise<void>;
    };
    mockAuth: (user?: any) => Promise<void>;
    createAuthenticatedSession: (user?: any) => Promise<void>;
};

export const authFixture = base.extend<AuthFixture>({
    mockAuth: async ({ page }, use) => {
        await use(async (user = createUser()) => {
            // Mock Supabase Auth Endpoints
            const projectRef = process.env.VITE_SUPABASE_URL?.match(/https:\/\/(.*?)\./)?.[1] || 'placeholder';

            // Mock Token/Login Endpoint
            await page.route(`**/auth/v1/token?grant_type=password`, async route => {
                const json = {
                    access_token: 'fake-access-token',
                    token_type: 'bearer',
                    expires_in: 3600,
                    refresh_token: 'fake-refresh-token',
                    user: user,
                    session: {
                        access_token: 'fake-access-token',
                        token_type: 'bearer',
                        user: user
                    }
                };
                await route.fulfill({ json });
            });

            // Mock User/Session Endpoint
            await page.route(`**/auth/v1/user`, async route => {
                await route.fulfill({ json: user });
            });
        });
    },

    loginPage: async ({ page }, use) => {
        await use({
            visit: async () => {
                await page.goto('/login');
            },
            login: async (email = 'test@example.com', password = 'password123') => {
                await page.fill('input[type="email"]', email);
                await page.fill('input[type="password"]', password);
                await page.click('button[type="submit"]');
            },
            logout: async () => {
                // Assuming there is a verify logout capability or button in the UI
                // This might need adjustment based on UI implementation
                await page.evaluate(() => {
                    // Direct supabase signOut if UI is tricky, or click the button
                    // (window as any).supabase?.auth?.signOut(); 
                    // For E2E we verify UI interaction usually:
                });
                // We will implement specific UI clicks in the test or here if specific
            }
        });
    },

    createAuthenticatedSession: async ({ page, mockAuth }, use) => {
        await use(async (userOrOverrides = {}) => {
            const user = userOrOverrides.id ? userOrOverrides : createUser(userOrOverrides);

            // Setup mocks
            await mockAuth(user);

            // Set LocalStorage to simulate persisted session
            // Note: The key depends on the supabase client options. Default is `sb-<project-ref>-auth-token`
            // We might need to inspect the app to know the exact key or just mock the network heavily
            // For now, simpler to just "Mock Network" and "Run Login Flow" or "Mock User Endpoint" and reload

            // A trick to "force" login without UI:
            // 1. Mock the specific `getSession` response that happens on mount
            // The `AuthContext` calls `supabase.auth.getSession()`
            // We need to ensure that call returns our fake session.
            // Since it's a network request (usually), the route mock above covers it IF it hits the network.

            // Often `getSession` reads from localStorage first. 
            // Let's set the generic known key if possible, but identifying it is hard without running code.
            // We will rely on "Mock Auth + Visit Protected Route" strategy if implicit login doesn't work.
        });
    }
});
