
import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";

test("getRPGState returns user stats", async () => {
    const t = convexTest(schema);

    await t.run(async (ctx) => {
        await ctx.db.insert("users", {
            clerkUserId: "user_rpg",
            username: "rpg_player",
            xp: 500,
            level: 5,
            gold: 100,
            streak: 3,
            focusPoints: 5,
            hearts: 5,
            streakFreezeCount: 1,
            currentWeek: 2,
            isAdmin: false,
            createdAt: Date.now(),
            bestStreak: 5,
            focusRefreshedAt: Date.now()
        });
    });

    const state = await t.query(api.rpg.getRPGState, { clerkUserId: "user_rpg" });
    expect(state).toBeDefined();
    expect(state.xp).toBe(500);
    expect(state.gold).toBe(100);
});

test("buyItem deducts gold and adds to inventory", async () => {
    const t = convexTest(schema);

    await t.run(async (ctx) => {
        await ctx.db.insert("users", {
            clerkUserId: "buyer",
            username: "buyer",
            xp: 0,
            level: 1,
            gold: 200, // Enough gold
            streak: 0,
            focusPoints: 5,
            hearts: 5,
            streakFreezeCount: 0,
            currentWeek: 1,
            isAdmin: false,
            createdAt: Date.now(),
            bestStreak: 0,
            focusRefreshedAt: Date.now()
        });
    });

    // Buy streak freeze (Cost: 50)
    const result = await t.mutation(api.rpg.buyItem, {
        clerkUserId: "buyer",
        itemId: "streak_freeze"
    });

    expect(result.success).toBe(true);
    expect(result.goldSpent).toBe(50);

    // Verify user gold
    const user = await t.run(async (ctx) => {
        return await ctx.db.query("users").first();
    });
    expect(user?.gold).toBe(150);

    // Verify inventory
    const inventory = await t.run(async (ctx) => {
        return await ctx.db.query("userInventory").collect();
    });
    expect(inventory).toHaveLength(1);
    expect(inventory[0].itemKey).toBe("streak_freeze");
});

test("buyItem fails with insufficient gold", async () => {
    const t = convexTest(schema);

    await t.run(async (ctx) => {
        await ctx.db.insert("users", {
            clerkUserId: "poor_buyer",
            username: "poor",
            xp: 0, level: 1, gold: 10, // Not enough
            streak: 0, bestStreak: 0, focusPoints: 5, hearts: 5, streakFreezeCount: 0,
            currentWeek: 1, isAdmin: false, createdAt: Date.now(), focusRefreshedAt: Date.now()
        });
    });

    await expect(t.mutation(api.rpg.buyItem, {
        clerkUserId: "poor_buyer",
        itemId: "streak_freeze"
    })).rejects.toThrow(); // Or returns success: false depending on implementation
});
