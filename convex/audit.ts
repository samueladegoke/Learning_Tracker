import { query } from "./_generated/server";

const STANDARD_RULES = { total: 20, mcq: 10, coding: 5, code_corr: 3 };
const PORTFOLIO_RULES = { total: 12, mcq: 6, coding: 4, code_corr: 0 };

export const getComplianceStats = query({
  args: {},
  handler: async (ctx) => {
    const questions = await ctx.db.query("questions").collect();
    const results = [];
    let passing = 0;
    let failing = 0;
    let noData = 0;

    for (let day = 1; day <= 100; day++) {
      const quizId = `day-${day}-practice`;
      const dayQuestions = questions.filter((q) => q.quiz_id === quizId);
      const isPortfolio = day >= 82;
      const rules = isPortfolio ? PORTFOLIO_RULES : STANDARD_RULES;

      if (dayQuestions.length === 0) {
        results.push({ day, status: "NO_DATA", issues: ["No questions found"] });
        noData++;
        continue;
      }

      const total = dayQuestions.length;
      const mcq = dayQuestions.filter((q) => q.question_type === "mcq").length;
      const coding = dayQuestions.filter((q) => q.question_type === "coding").length;
      const codeCorr = dayQuestions.filter((q) => q.question_type === "code-correction").length;
      const missingTag = dayQuestions.filter((q) => !q.topic_tag).length;
      const missingDiff = dayQuestions.filter((q) => !q.difficulty).length;

      const issues = [];
      if (total < rules.total) issues.push(`Total < ${rules.total} (${total})`);
      if (mcq < rules.mcq) issues.push(`MCQ < ${rules.mcq} (${mcq})`);
      if (coding < rules.coding) issues.push(`Coding < ${rules.coding} (${coding})`);
      if (!isPortfolio && codeCorr < rules.code_corr) issues.push(`CodeCorr < ${rules.code_corr} (${codeCorr})`);
      if (missingTag > 0) issues.push(`Missing topic_tag: ${missingTag}`);
      if (missingDiff > 0) issues.push(`Missing difficulty: ${missingDiff}`);

      const status = issues.length === 0 ? "PASS" : "FAIL";
      if (status === "PASS") passing++;
      else failing++;

      results.push({ day, total, mcq, coding, codeCorr, status, issues });
    }

    return { passing, failing, noData, results };
  },
});
