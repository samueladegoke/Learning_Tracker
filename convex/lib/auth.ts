import { Doc, Id } from "../_generated/dataModel";
import { QueryCtx, MutationCtx } from "../_generated/server";

// Dev mode: Bypass auth for local development when DEV_BYPASS_AUTH=true
const DEV_USER_ID = "dev_user";

/** Type guard to check if context is a MutationCtx (has insert method) */
function isMutationCtx(ctx: QueryCtx | MutationCtx): ctx is MutationCtx {
    return "insert" in ctx.db;
}

export type AuthResult =
    | { success: true; clerkUserId: string }
    | { success: false; error: string };

export type UserLookupResult<T = Doc<"users">> =
    | { success: true; user: T }
    | { success: false; error: string; code: "unauthorized" | "user_not_found" };

/** Require auth from context — returns Clerk user ID or error. Bypassed in dev mode. */
export async function requireAuth(ctx: QueryCtx | MutationCtx): Promise<AuthResult> {
    if (process.env.DEV_BYPASS_AUTH) {
        return { success: true, clerkUserId: DEV_USER_ID };
    }
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        return { success: false, error: "Unauthorized: Please sign in" };
    }
    return { success: true, clerkUserId: identity.subject };
}

/** Auth + user lookup in one call. Auto-creates dev user in dev mode. */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx): Promise<UserLookupResult> {
    const authResult = await requireAuth(ctx);
    if (!authResult.success) {
        return { success: false, error: authResult.error, code: "unauthorized" };
    }

    let user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", authResult.clerkUserId))
        .unique();

    if (!user && process.env.DEV_BYPASS_AUTH && isMutationCtx(ctx)) {
        await ctx.db.insert("users", {
            clerk_user_id: DEV_USER_ID,
            username: "Developer",
            xp: 0,
            level: 1,
            streak: 0,
            gold: 100,
            hearts: 5,
            focus_points: 5,
            focus_refreshed_at: Date.now(),
            streak_freeze_count: 0,
            last_activity_date: undefined,
        });
        user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", DEV_USER_ID))
            .unique();
    }

    if (!user) {
        return { success: false, error: "User not found: Please complete registration", code: "user_not_found" };
    }

    return { success: true, user };
}

/** Look up user by Clerk ID (when you already have it from args) */
export async function getUserByClerkId(ctx: QueryCtx | MutationCtx, clerkUserId: string): Promise<Doc<"users"> | null> {
    return await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerk_user_id", clerkUserId))
        .unique();
}

/** Look up user by Clerk ID — throws if not found */
export async function requireUserByClerkId(ctx: QueryCtx | MutationCtx, clerkUserId: string): Promise<Doc<"users">> {
    const user = await getUserByClerkId(ctx, clerkUserId);
    if (!user) throw new Error(`User not found: ${clerkUserId}`);
    return user;
}
