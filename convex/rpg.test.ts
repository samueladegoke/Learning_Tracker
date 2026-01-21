import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";
import { SHOP_ITEMS } from "./rpg";

test("buyItem deducts gold and updates inventory", async () => {
  const t = convexTest(schema);
  const user = await t.run(async (ctx) => {
    return await ctx.db.insert("users", {
      username: "shopper",
      clerk_user_id: "shopper_id",
      xp: 0,
      level: 1,
      gold: 100, // Enough for streak_freeze (50)
      streak: 0,
      hearts: 5,
      focus_points: 100,
      streak_freeze_count: 0
    });
  });

  await t.run(async (ctx) => {
    await ctx.db.insert("userInventory", {
        user_id: user,
        item_type: "consumable",
        item_key: "streak_freeze",
        quantity: 0
    });
  });

  const result = await t.withIdentity({ subject: "shopper_id" }).mutation(api.rpg.buyItem, {
    itemId: "streak_freeze"
  });

  expect(result.success).toBe(true);
  expect(result.new_gold).toBe(50);

  const updatedUser = await t.run(async (ctx) => await ctx.db.get(user));
  if (!updatedUser) throw new Error("User not found");
  expect(updatedUser.gold).toBe(50);
  expect(updatedUser.streak_freeze_count).toBe(1);
});

test("buyItem fails with insufficient gold", async () => {
  const t = convexTest(schema);
  await t.run(async (ctx) => {
    await ctx.db.insert("users", {
      username: "poor",
      clerk_user_id: "poor_id",
      xp: 0,
      level: 1,
      gold: 0, 
      streak: 0,
      hearts: 5,
      focus_points: 100,
      streak_freeze_count: 0
    });
  });

  await expect(t.withIdentity({ subject: "poor_id" }).mutation(api.rpg.buyItem, {
    itemId: "streak_freeze"
  })).rejects.toThrow("Not enough gold");
});

test("buyItem heart_refill restores hearts", async () => {
    const t = convexTest(schema);
    const user = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        username: "hurt",
        clerk_user_id: "hurt_id",
        xp: 0,
        level: 1,
        gold: 200, 
        streak: 0,
        hearts: 3, // Damaged
        focus_points: 100,
        streak_freeze_count: 0
      });
    });
  
    await t.withIdentity({ subject: "hurt_id" }).mutation(api.rpg.buyItem, {
      itemId: "health_potion"
    });
  
    const updatedUser = await t.run(async (ctx) => await ctx.db.get(user));
    if (!updatedUser) throw new Error("User not found");
    expect(updatedUser.hearts).toBe(4);
});
