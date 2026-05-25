// ============================================================================
//  TYPESCRIPT — SHEET 5: UTILITY TYPES
//  Goal: Master all built-in utility types and learn to BUILD your own.
//        These show up in every TypeScript interview and codebase.
// ============================================================================
//
//  HOW TO RUN:
//    ts-node ts_05_utility_types.ts
// ============================================================================


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: OBJECT TRANSFORMATION UTILITIES
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: These transform the properties of an object type.
//
//  Partial<T>        — all properties become optional
//  Required<T>       — all properties become required (removes ?)
//  Readonly<T>       — all properties become readonly (prevents mutation)
//  Mutable<T>        — (NOT built-in) removes readonly — must write yourself
//
//  REAL-WORLD USE:
//    Partial   → form state (not all fields filled yet), PATCH request bodies
//    Required  → validated data that MUST have all fields
//    Readonly  → config objects, frozen state, component props
//
//  INTERVIEW TIP: Be ready to IMPLEMENT Partial from scratch:
//    type MyPartial<T> = { [K in keyof T]?: T[K] }
//  (Mapped type — covered in Sheet 7)

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  bio?: string;
}

// EXERCISE 1.1 — Partial for updates.
// A PATCH endpoint receives partial user data — not all fields required.
function updateUser(id: string, updates: Partial<User>): User {
  const existing: User = { id, name: "Alice", email: "a@example.com", role: "user" };
  return { ...existing, ...updates };
}

const updated = updateUser("u1", { name: "Alice Updated", email: "new@example.com" });
console.log(updated);


// EXERCISE 1.2 — Required for validated forms.
// After validation, ALL fields must be present.
type ValidatedUser = Required<User>;
// bio is no longer optional — must be provided.

function processValidatedUser(user: ValidatedUser): void {
  console.log(`${user.name} (${user.bio})`);
}


// EXERCISE 1.3 — Readonly for immutable data.
type ReadonlyUser = Readonly<User>;

const frozenUser: ReadonlyUser = {
  id: "u1", name: "Alice", email: "a@e.com", role: "user"
};
// frozenUser.name = "Bob"; // Error! Cannot assign to 'name' because it is read-only.

// Readonly is SHALLOW — nested objects can still be mutated.
interface Config {
  db: { host: string; port: number };
}
const config: Readonly<Config> = { db: { host: "localhost", port: 5432 } };
config.db.port = 9999; // This works! `db` is readonly but the object it points to is not.
// config.db = { host: "other", port: 5432 }; // Error! `db` itself is readonly.


// EXERCISE 1.4 — Implement Mutable<T> (not built-in).
// Remove readonly from all properties.
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

type ImmutablePoint = { readonly x: number; readonly y: number };
type MutablePoint = Mutable<ImmutablePoint>;

const p: MutablePoint = { x: 1, y: 2 };
p.x = 10; // Now allowed
console.log(p); // { x: 10, y: 2 }

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: PROPERTY SELECTION UTILITIES
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY:
//
//  Pick<T, K>   — create a type with ONLY the keys K from T
//  Omit<T, K>   — create a type WITHOUT the keys K from T
//  Record<K, V> — create an object type mapping keys K to value type V
//
//  WHEN TO USE EACH:
//    Pick  → when you know WHICH fields you want (fewer fields is the norm)
//    Omit  → when you know WHICH fields to exclude (removing sensitive/internal fields)
//    Record → when you have a KNOWN set of keys mapping to a consistent value type
//
//  INTERVIEW TIP: Implement Pick from scratch:
//    type MyPick<T, K extends keyof T> = { [P in K]: T[P] }
//  Implement Omit:
//    type MyOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: Date;
  tags: string[];
  internalNotes: string;    // should not be exposed in API
  editSecret: string;       // should not be exposed in API
}


// EXERCISE 2.1 — Pick for data projection.
// Create a `PostSummary` type with only what a list view needs.
type PostSummary = Pick<BlogPost, "id" | "title" | "author" | "publishedAt" | "tags">;

function toSummary(post: BlogPost): PostSummary {
  const { id, title, author, publishedAt, tags } = post;
  return { id, title, author, publishedAt, tags };
}


// EXERCISE 2.2 — Omit for safe API types.
// Create a public-facing type that excludes internal fields.
type PublicPost = Omit<BlogPost, "internalNotes" | "editSecret">;

function toPublicPost(post: BlogPost): PublicPost {
  const { internalNotes, editSecret, ...publicData } = post;
  return publicData;
}


// EXERCISE 2.3 — Record for lookup tables.
type PostStatus = "draft" | "published" | "archived" | "deleted";
type StatusConfig = Record<PostStatus, { label: string; color: string }>;

const statusConfig: StatusConfig = {
  draft:     { label: "Draft",     color: "gray"   },
  published: { label: "Published", color: "green"  },
  archived:  { label: "Archived",  color: "yellow" },
  deleted:   { label: "Deleted",   color: "red"    },
};

function getStatusLabel(status: PostStatus): string {
  return statusConfig[status].label;
}

console.log(getStatusLabel("published")); // "Published"
// getStatusLabel("unknown");             // Error! Not a PostStatus


// EXERCISE 2.4 — Combining utilities.
// Create a type for creating a new post (no id, publishedAt, internalNotes, editSecret)
// but all fields are required.
type CreatePostInput = Required<Omit<BlogPost, "id" | "publishedAt" | "internalNotes" | "editSecret">>;

// Create a type for updating a post (all fields optional, except id which is required)
type UpdatePostInput = { id: string } & Partial<Omit<BlogPost, "id">>;

// YOUR CODE HERE: Create a `createPost` function that takes CreatePostInput
// and returns a full BlogPost (generating id and publishedAt).
function createPost(input: CreatePostInput): BlogPost {
  return {
    ...input,
    id: Math.random().toString(36).slice(2),
    publishedAt: new Date(),
    internalNotes: "",
    editSecret: Math.random().toString(36),
  };
}

const newPost = createPost({
  title: "TypeScript Tips",
  content: "...",
  author: "Swastik",
  tags: ["typescript", "tips"],
});
console.log("Created:", newPost.title, "ID:", newPost.id.slice(0, 8));

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: UNION MANIPULATION UTILITIES
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: These operate on union types (not object types).
//
//  Exclude<T, U>        — remove from union T all members assignable to U
//  Extract<T, U>        — keep from union T only members assignable to U
//  NonNullable<T>       — remove null and undefined from T
//
//  Examples:
//    type T = "a" | "b" | "c" | "d";
//    Exclude<T, "b" | "d">   → "a" | "c"
//    Extract<T, "a" | "z">   → "a"         (z not in T, so dropped)
//
//    NonNullable<string | null | undefined>  → string
//
//  INTERVIEW TIP: Implement Exclude from scratch:
//    type MyExclude<T, U> = T extends U ? never : T
//  (Distributed conditional type — TS applies the condition to each union member)

type AllRoles  = "admin" | "editor" | "viewer" | "guest";
type StaffRoles = "admin" | "editor";

// EXERCISE 3.1 — Exclude and Extract.
type NonStaffRoles = Exclude<AllRoles, StaffRoles>;  // "viewer" | "guest"
type StaffOnly     = Extract<AllRoles, StaffRoles>;  // "admin" | "editor"

// Practical: get non-null keys of an object
type User2 = { id: string; name: string; age: number; bio: string | null };
type NullableUserKeys = { [K in keyof User2]: null extends User2[K] ? K : never }[keyof User2];
// NullableUserKeys = "bio"

type RequiredUserKeys = Exclude<keyof User2, NullableUserKeys>;
// RequiredUserKeys = "id" | "name" | "age"


// EXERCISE 3.2 — NonNullable.
type MaybeString = string | null | undefined;
type SafeString  = NonNullable<MaybeString>;  // string

// Practical: make all object properties non-nullable
type StrictUser = {
  [K in keyof User2]: NonNullable<User2[K]>;
};
// StrictUser.bio is now `string`, not `string | null`


// EXERCISE 3.3 — Distribute over unions.
// Write `NullableProperties<T>` — a type that extracts the keys of T
// whose values could be null or undefined.
type NullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? K : undefined extends T[K] ? K : never;
}[keyof T];

type TestObj = {
  id: string;
  name: string;
  nickname: string | null;
  age?: number;
};

type NullableTestKeys = NullableKeys<TestObj>; // "nickname" | "age"

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: FUNCTION & CLASS UTILITIES
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY:
//
//  ReturnType<T>             — return type of function type T
//  Parameters<T>             — parameter types as a tuple
//  ConstructorParameters<T>  — constructor parameter types as a tuple
//  InstanceType<T>           — type of instances from constructor T
//  Awaited<T>                — unwrap Promise<T> recursively
//
//  These are essential when working with:
//    • Third-party libraries (you don't have source types)
//    • Higher-order functions that wrap other functions
//    • Dynamic class instantiation
//    • Async function result types

// EXERCISE 4.1 — Extract and reuse third-party function types.
// Imagine this is a function from an external library you can't modify:
declare function createDBConnection(
  host: string,
  port: number,
  options: { ssl: boolean; timeout: number }
): { query: (sql: string) => Promise<unknown[]>; close: () => void };

type ConnectionArgs = Parameters<typeof createDBConnection>;
type Connection     = ReturnType<typeof createDBConnection>;
type QueryResult    = Awaited<ReturnType<Connection["query"]>>;

// Now you can use these types in your own code:
function connectWithRetry(...args: ConnectionArgs): Connection {
  return createDBConnection(...args);
}


// EXERCISE 4.2 — InstanceType for abstract factory.
class EventEmitter2 {
  on(event: string, fn: () => void) { return this; }
  emit(event: string) { return this; }
}

class Database {
  constructor(public url: string) {}
  query(sql: string): string[] { return []; }
}

type EmitterInstance  = InstanceType<typeof EventEmitter2>;  // EventEmitter2
type DBInstance       = InstanceType<typeof Database>;       // Database

// Generic factory that can create any class instance:
function createService<T extends new (...args: any) => any>(
  Ctor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  return new Ctor(...args);
}

const db = createService(Database, "postgres://localhost/mydb");
console.log("DB created:", db.url);

console.log("=== Section 4 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: IMPLEMENT UTILITY TYPES FROM SCRATCH
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Interviewers often ask you to re-implement utility types.
//  This proves you understand mapped types, conditional types, and keyof.
//  Implement each using mapped types and conditional types.

// EXERCISE 5.1 — Implement MyPartial, MyRequired, MyReadonly.

type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

type MyRequired<T> = {
  [K in keyof T]-?: T[K];  // -? removes the optional modifier
};

type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};


// EXERCISE 5.2 — Implement MyPick and MyOmit.

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type MyOmit<T, K extends keyof T> = MyPick<T, Exclude<keyof T, K>>;


// EXERCISE 5.3 — Implement MyExclude and MyExtract.
// These work using distributed conditional types.
// When T is a union, `T extends U` distributes over each member.

type MyExclude<T, U> = T extends U ? never : T;
type MyExtract<T, U> = T extends U ? T : never;
type MyNonNullable<T> = T extends null | undefined ? never : T;

// Verify:
type TestExclude = MyExclude<"a" | "b" | "c", "b">;  // "a" | "c"
type TestExtract = MyExtract<"a" | "b" | "c", "b" | "d">; // "b"


// EXERCISE 5.4 — Implement MyReturnType and MyParameters.

type MyReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : never;

type MyParameters<T extends (...args: any) => any> =
  T extends (...args: infer P) => any ? P : never;


// EXERCISE 5.5 — Implement Record from scratch.
type MyRecord<K extends string | number | symbol, V> = {
  [P in K]: V;
};

// Verify:
type TestRecord = MyRecord<"a" | "b", number>;  // { a: number; b: number }

console.log("=== Section 5: Utility type implementations verified ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: MINI CHALLENGE
// ════════════════════════════════════════════════════════════════════════════

// CHALLENGE 6.1 — Build a type-safe object diff function.
// `diff<T>(oldObj: T, newObj: T): Partial<T>`
// Returns only the fields that CHANGED between oldObj and newObj.

function diff<T extends Record<string, unknown>>(oldObj: T, newObj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key in newObj) {
    if (oldObj[key] !== newObj[key]) {
      result[key] = newObj[key];
    }
  }
  return result;
}

const before = { name: "Alice", age: 30, email: "a@old.com", role: "user" as const };
const after  = { name: "Alice", age: 31, email: "a@new.com", role: "user" as const };

console.log("Diff:", diff(before, after));
// { age: 31, email: "a@new.com" }


// CHALLENGE 6.2 — Type-safe merge with deep partial updates.
// `deepMerge<T>(base: T, overrides: DeepPartial<T>): T`

type DeepPartial2<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial2<T[K]> : T[K];
};

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  overrides: DeepPartial2<T>
): T {
  const result = { ...base };
  for (const key in overrides) {
    const override = overrides[key as keyof T];
    const baseVal = base[key];
    if (
      override !== undefined &&
      typeof override === "object" &&
      !Array.isArray(override) &&
      typeof baseVal === "object" &&
      baseVal !== null
    ) {
      result[key] = deepMerge(
        baseVal as Record<string, unknown>,
        override as Record<string, unknown>
      ) as T[typeof key];
    } else if (override !== undefined) {
      result[key] = override as T[typeof key];
    }
  }
  return result;
}

const baseConfig = {
  server: { host: "localhost", port: 3000, ssl: false },
  db: { url: "postgres://localhost/dev", pool: { min: 2, max: 10 } },
};

const merged = deepMerge(baseConfig, {
  server: { port: 8080 },       // only override port
  db: { pool: { max: 20 } },   // only override pool.max
});

console.log("Merged host:", merged.server.host);  // "localhost" (unchanged)
console.log("Merged port:", merged.server.port);  // 8080 (overridden)
console.log("Merged pool:", merged.db.pool);      // { min: 2, max: 20 }

console.log("=== Sheet 5 complete! Move on to ts_06_classes.ts ===\n");

export {};
