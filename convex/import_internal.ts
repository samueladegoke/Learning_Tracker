import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const insertRow = internalMutation({
    args: { table: v.string(), data: v.any() },
    handler: async (ctx, args) => {
        return await ctx.db.insert(args.table as any, args.data);
    },
});

export const insertRows = internalMutation({
    args: { table: v.string(), rows: v.array(v.any()) },
    handler: async (ctx, args) => {
        const ids = [];
        for (const row of args.rows) {
            const id = await ctx.db.insert(args.table as any, row);
            ids.push(id);
        }
        return ids;
    },
});
