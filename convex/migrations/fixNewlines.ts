/**
 * Migration: Fix escaped newlines in questions
 * 
 * This mutation fixes improperly escaped \n patterns in text, starter_code, and code fields.
 * Run with: npx convex run migrations/fixNewlines:fixEscapedNewlines
 * 
 * SECURITY: Uses internalMutation to prevent unauthorized access
 */

import { internalMutation, query } from "../_generated/server";
import { v } from "convex/values";

export const diagnoseQuestion = query({
    args: {
        quizId: v.string(),
        searchText: v.string(),
    },
    handler: async (ctx, args) => {
        const questions = await ctx.db.query("questions")
            .filter((q) => q.eq(q.field("quiz_id"), args.quizId))
            .collect();

        const hashQ = questions.find(q => q.text && q.text.includes(args.searchText));
        if (!hashQ) return { error: "Not found", count: questions.length };

        const text = hashQ.text || "";
        const charCodes = [];
        for (let i = 0; i < Math.min(60, text.length); i++) {
            charCodes.push(text.charCodeAt(i));
        }

        return {
            id: hashQ._id,
            textPreview: text.substring(0, 80),
            charCodes,
            hasBackslash92: text.includes(String.fromCharCode(92)),
            hasNewline10: text.includes(String.fromCharCode(10)),
        };
    },
});

function fixNewlines(text: string | undefined): string | undefined {
    if (!text) return text;
    let result = text;

    // Pattern: backslash char (92) followed by actual newline char (10) -> just newline
    result = result.replace(/\\\n/g, '\n');

    // Pattern: literal backslash-n text -> actual newline  
    result = result.replace(/\\n/g, '\n');

    return result;
}

function needsFix(text: string | undefined): boolean {
    if (!text) return false;
    // Check for backslash followed by newline (char 92 + char 10)
    if (text.includes('\\\n')) return true;
    // Check for literal \n text
    if (text.includes('\\n')) return true;
    return false;
}

export const fixEscapedNewlines = internalMutation({
    args: {
        dryRun: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const dryRun = args.dryRun ?? true;

        // Get all questions
        const questions = await ctx.db.query("questions").collect();

        const fixes: { id: string; field: string; before: string; after: string }[] = [];

        for (const q of questions) {
            const updates: Partial<typeof q> = {};
            let hasChanges = false;

            if (needsFix(q.text)) {
                const fixed = fixNewlines(q.text);
                if (fixed !== q.text) {
                    fixes.push({
                        id: q._id,
                        field: 'text',
                        before: q.text!.substring(0, 50),
                        after: (fixed || '').substring(0, 50),
                    });
                    updates.text = fixed;
                    hasChanges = true;
                }
            }

            if (needsFix(q.starter_code)) {
                const fixed = fixNewlines(q.starter_code);
                if (fixed !== q.starter_code) {
                    fixes.push({
                        id: q._id,
                        field: 'starter_code',
                        before: q.starter_code!.substring(0, 50),
                        after: (fixed || '').substring(0, 50),
                    });
                    updates.starter_code = fixed;
                    hasChanges = true;
                }
            }

            if (needsFix(q.code)) {
                const fixed = fixNewlines(q.code);
                if (fixed !== q.code) {
                    fixes.push({
                        id: q._id,
                        field: 'code',
                        before: q.code!.substring(0, 50),
                        after: (fixed || '').substring(0, 50),
                    });
                    updates.code = fixed;
                    hasChanges = true;
                }
            }

            // Apply updates if not dry run
            if (hasChanges && !dryRun) {
                await ctx.db.patch(q._id, updates);
            }
        }

        return {
            dryRun,
            totalQuestions: questions.length,
            fixesFound: fixes.length,
            fixes: fixes.slice(0, 20), // Return first 20 for preview
            message: dryRun
                ? `Dry run complete. Found ${fixes.length} fields to fix. Run with dryRun=false to apply.`
                : `Applied ${fixes.length} fixes.`
        };
    },
});
