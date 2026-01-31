/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as achievements from "../achievements.js";
import type * as audit from "../audit.js";
import type * as badges from "../badges.js";
import type * as curriculum from "../curriculum.js";
import type * as gamification from "../gamification.js";
import type * as importData from "../importData.js";
import type * as lib_utils from "../lib/utils.js";
import type * as lib_xp from "../lib/xp.js";
import type * as migrations_fixNewlines from "../migrations/fixNewlines.js";
import type * as migrations_import_data from "../migrations/import_data.js";
import type * as progress from "../progress.js";
import type * as quizzes from "../quizzes.js";
import type * as reflections from "../reflections.js";
import type * as rpg from "../rpg.js";
import type * as srs from "../srs.js";
import type * as tasks from "../tasks.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  achievements: typeof achievements;
  audit: typeof audit;
  badges: typeof badges;
  curriculum: typeof curriculum;
  gamification: typeof gamification;
  importData: typeof importData;
  "lib/utils": typeof lib_utils;
  "lib/xp": typeof lib_xp;
  "migrations/fixNewlines": typeof migrations_fixNewlines;
  "migrations/import_data": typeof migrations_import_data;
  progress: typeof progress;
  quizzes: typeof quizzes;
  reflections: typeof reflections;
  rpg: typeof rpg;
  srs: typeof srs;
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
