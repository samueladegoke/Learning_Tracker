import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const insertRow = mutation({
    args: { table: v.string(), data: v.any() },
    handler: async (ctx, args) => {
        return await ctx.db.insert(args.table as any, args.data);
    },
});

export const insertRows = mutation({
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

export const countRows = query({
    args: { table: v.string() },
    handler: async (ctx, args) => {
        const rows = await ctx.db.query(args.table as any).collect();
        return rows.length;
    },
});
