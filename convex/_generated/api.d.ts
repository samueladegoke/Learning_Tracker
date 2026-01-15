/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as convex__generated_api from "../convex/_generated/api.js";
import type * as convex__generated_server from "../convex/_generated/server.js";
import type * as convex_curriculum from "../convex/curriculum.js";
import type * as convex_lib_xp from "../convex/lib/xp.js";
import type * as convex_migrations_import_data from "../convex/migrations/import_data.js";
import type * as convex_quizzes from "../convex/quizzes.js";
import type * as convex_rpg from "../convex/rpg.js";
import type * as convex_srs from "../convex/srs.js";
import type * as convex_tasks from "../convex/tasks.js";
import type * as curriculum from "../curriculum.js";
import type * as gamification from "../gamification.js";
import type * as rpg from "../rpg.js";
import type * as tasks from "../tasks.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "convex/_generated/api": typeof convex__generated_api;
  "convex/_generated/server": typeof convex__generated_server;
  "convex/curriculum": typeof convex_curriculum;
  "convex/lib/xp": typeof convex_lib_xp;
  "convex/migrations/import_data": typeof convex_migrations_import_data;
  "convex/quizzes": typeof convex_quizzes;
  "convex/rpg": typeof convex_rpg;
  "convex/srs": typeof convex_srs;
  "convex/tasks": typeof convex_tasks;
  curriculum: typeof curriculum;
  gamification: typeof gamification;
  rpg: typeof rpg;
  tasks: typeof tasks;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
