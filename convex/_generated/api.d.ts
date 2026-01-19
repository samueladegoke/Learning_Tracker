/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as curriculum from "../curriculum.js";
import type * as gamification from "../gamification.js";
import type * as importData from "../importData.js";
import type * as lib_utils from "../lib/utils.js";
import type * as lib_xp from "../lib/xp.js";
import type * as migrations_import_data from "../migrations/import_data.js";
import type * as quizzes from "../quizzes.js";
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
  curriculum: typeof curriculum;
  gamification: typeof gamification;
  importData: typeof importData;
  "lib/utils": typeof lib_utils;
  "lib/xp": typeof lib_xp;
  "migrations/import_data": typeof migrations_import_data;
  quizzes: typeof quizzes;
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
