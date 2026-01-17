import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "./schema";

test("schema is valid", async () => {
    const t = convexTest(schema);
    expect(t).toBeDefined();
});
