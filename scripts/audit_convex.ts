import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import * as dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL || "");

async function runAudit() {
  console.log("Running Compliance Audit on Convex...");
  try {
    const stats = await client.query(api.audit.getComplianceStats);
    
    console.log("\n" + "=".repeat(60));
    console.log("CONTENT COMPLIANCE AUDIT REPORT (CONVEX)");
    console.log("=".repeat(60));
    console.log(`Days Audited: 100`);
    console.log(`✅ Passing: ${stats.passing}`);
    console.log(`❌ Failing: ${stats.failing}`);
    console.log(`⚠️  No Data: ${stats.noData}`);
    console.log("=".repeat(60));

    if (stats.failing > 0) {
      console.log("\n--- FAILING DAYS ---");
      stats.results.forEach((r: any) => {
        if (r.status === "FAIL") {
          console.log(`Day ${r.day}: ${r.issues.join(", ")}`);
        }
      });
    }

    if (stats.noData > 0) {
      console.log("\n--- NO DATA DAYS ---");
      const noDataDays = stats.results.filter((r: any) => r.status === "NO_DATA").map((r: any) => r.day);
      console.log(`Days: ${noDataDays.join(", ")}`);
    }

  } catch (error) {
    console.error("Audit failed:", error);
  }
}

runAudit();
