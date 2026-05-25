// ============================================================================
//  TYPESCRIPT — SHEET 3: OBJECTS, INTERFACES, TYPE ALIASES & UNIONS
//  Goal: Master how to model data with TypeScript's type system.
//        This is the core skill you'll use every day in Next.js/React work.
// ============================================================================
//
//  HOW TO RUN:
//    ts-node ts_03_objects_and_unions.ts
// ============================================================================


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: interface vs type — THE DEFINITIVE COMPARISON
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Both describe object shapes. Know when to use each.
//
//  interface                          | type alias
//  ─────────────────────────────────────────────────────────────────────
//  Can extend other interfaces        | Can extend via intersection (&)
//    interface B extends A {}         |   type B = A & { extra: string }
//                                     |
//  Declaration merging (re-open)      | NO merging — re-declaration is error
//    interface Window {                |
//      myLib: MyLib                   |
//    }                                |
//                                     |
//  Can ONLY describe objects/classes  | Can describe ANY type:
//                                     |   primitives, unions, tuples, functions
//                                     |   type ID = string | number
//                                     |   type Pair = [string, number]
//                                     |
//  Produces better error messages     | Can use complex type operations
//  for object shapes                  |   (conditional, mapped, template)
//
//  RULE OF THUMB:
//    • Use `interface` for: object shapes, class contracts, public APIs.
//    • Use `type` for: unions, intersections, tuples, primitives, utility types.
//    • For component props in React: both work — pick one and be consistent.
//
//  INTERVIEW TIP: Be ready to explain this table concisely:
//  "I use interface when I need extensibility (extends, declaration merging).
//   I use type when I need expressiveness (unions, tuples, conditional types)."

// EXERCISE 1.1 — Convert these types between interface and type alias.

// Convert to type alias:
interface Point {
  x: number;
  y: number;
}
// YOUR CODE: type Point2 = ...

// Convert to interface:
type Rectangle2 = {
  topLeft: Point;
  bottomRight: Point;
  label?: string;
};
// YOUR CODE: interface IRectangle { ... }


// EXERCISE 1.2 — Declaration merging (interface-only feature).
// This is how library authors add types to existing interfaces.

interface Window {
  analytics?: { track: (event: string) => void };
}
// Now `window.analytics` is known to TypeScript everywhere!
// (We won't actually use it in Node, but you'd use this in browser projects)


// EXERCISE 1.3 — Extending interfaces vs intersecting types.

interface Animal {
  name: string;
  sound(): string;
}

interface Domesticated {
  owner: string;
  isVaccinated: boolean;
}

// Via interface extends:
interface Pet extends Animal, Domesticated {
  breed: string;
}

// Via type intersection:
type PetType = Animal & Domesticated & { breed: string };

// Both are equivalent for object shapes — pick based on context.
const dog: Pet = {
  name: "Rex",
  breed: "Labrador",
  owner: "Alice",
  isVaccinated: true,
  sound() { return "Woof"; }
};

console.log(dog.sound()); // "Woof"
console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: UNION TYPES IN DEPTH
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: A union type `A | B` means "this value is EITHER A or B".
//  TypeScript only lets you use what is COMMON to all members unless you narrow.
//
//  Widening from union: TS requires you to handle all cases before using
//  type-specific properties.
//
//  Union of primitives:   string | number | boolean
//  Union of object types: Cat | Dog | Bird
//  Nullable types:        string | null | undefined
//
//  When you have `string | null`, the only shared operations are:
//    • == / === / !==
//    • toString (via Object.prototype, but risky)
//  To use string methods, you must narrow to `string` first.

// EXERCISE 2.1 — Union of object types.
interface Circle2  { kind: "circle";   radius: number; }
interface Square2  { kind: "square";   side: number; }
interface Triangle2 { kind: "triangle"; base: number; height: number; }

type Shape2 = Circle2 | Square2 | Triangle2;

// Write getArea using a switch on the `kind` property (discriminated union):
function getArea(shape: Shape2): number {
  switch (shape.kind) {
    case "circle":   return Math.PI * shape.radius ** 2;
    case "square":   return shape.side ** 2;
    case "triangle": return 0.5 * shape.base * shape.height;
    default:
      const _exhaustive: never = shape;
      throw new Error(`Unknown shape: ${JSON.stringify(_exhaustive)}`);
  }
}

console.log(getArea({ kind: "circle", radius: 5 }).toFixed(2));      // 78.54
console.log(getArea({ kind: "square", side: 4 }));                   // 16
console.log(getArea({ kind: "triangle", base: 6, height: 3 }));      // 9


// EXERCISE 2.2 — Nullable union patterns.
// `T | null | undefined` is so common, TypeScript has shorthand for it.
// strictNullChecks (on by default in modern TS) makes null and undefined
// their own types — they don't exist in other types unless explicitly unioned.

function findUser(id: string): { name: string; email: string } | null {
  if (id === "u1") return { name: "Alice", email: "alice@example.com" };
  return null;
}

// YOUR CODE HERE: Use the result of findUser safely.
// a) Optional chaining
const email = findUser("u1")?.email;

// b) Nullish coalescing
const displayName = findUser("unknown")?.name ?? "Guest";

// c) Type narrowing with if check
const user = findUser("u1");
if (user !== null) {
  console.log(user.name.toUpperCase()); // TS knows user is not null here
}


// EXERCISE 2.3 — Union with shared/different properties.
type AdminUser  = { role: "admin";  name: string; permissions: string[] };
type RegularUser = { role: "user";  name: string; lastLogin: Date };
type GuestUser  = { role: "guest";         sessionId: string };

type AppUser = AdminUser | RegularUser | GuestUser;

// Write `describeUser(user: AppUser): string` using narrowing.
function describeUser(user: AppUser): string {
  // YOUR CODE HERE
  // Note: `name` is on Admin and Regular but NOT Guest — handle carefully.
  if (user.role === "admin") return `Admin: ${user.name} (${user.permissions.length} perms)`;
  if (user.role === "user")  return `User: ${user.name}`;
  return `Guest session: ${user.sessionId}`;
}

console.log(describeUser({ role: "admin",  name: "Alice", permissions: ["read", "write"] }));
console.log(describeUser({ role: "user",   name: "Bob",   lastLogin: new Date() }));
console.log(describeUser({ role: "guest",  sessionId: "sess-xyz" }));

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: DISCRIMINATED UNIONS — THE MOST IMPORTANT PATTERN
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: A discriminated union is a union where every member has a
//  shared LITERAL property (the "discriminant") that uniquely identifies it.
//  TypeScript uses this property to narrow types in switch/if statements.
//
//  Characteristics of a good discriminant:
//    • Present on ALL members of the union
//    • Has a unique LITERAL type per member (not just `string`)
//    • Usually named: type, kind, status, tag, variant
//
//  This pattern is used EVERYWHERE in real applications:
//    • API response states: loading | success | error
//    • Redux actions: { type: "INCREMENT" } | { type: "DECREMENT", by: number }
//    • Routing: { path: "/home" } | { path: "/user", id: string }
//    • State machines: any finite state

// EXERCISE 3.1 — API response state machine.
type ApiState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T; timestamp: number }
  | { status: "error";   message: string; code: number };

// Write `renderState<T>` that returns a display string for each state.
function renderState<T>(state: ApiState<T>): string {
  // YOUR CODE HERE
  switch (state.status) {
    case "idle":    return "Waiting...";
    case "loading": return "Loading...";
    case "success": return `Data received at ${new Date(state.timestamp).toISOString()}`;
    case "error":   return `Error ${state.code}: ${state.message}`;
  }
}

const states: ApiState<{ name: string }>[] = [
  { status: "idle" },
  { status: "loading" },
  { status: "success", data: { name: "Alice" }, timestamp: Date.now() },
  { status: "error", message: "Not Found", code: 404 },
];
states.forEach(s => console.log(renderState(s)));


// EXERCISE 3.2 — Redux-style action types.
type Action =
  | { type: "USER_LOGIN";    payload: { userId: string; name: string } }
  | { type: "USER_LOGOUT" }
  | { type: "SET_LOADING";   payload: boolean }
  | { type: "ADD_ITEM";      payload: { id: string; name: string; qty: number } }
  | { type: "REMOVE_ITEM";   payload: { id: string } };

interface AppState {
  user: { userId: string; name: string } | null;
  loading: boolean;
  items: { id: string; name: string; qty: number }[];
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "USER_LOGIN":
      return { ...state, user: action.payload };
    case "USER_LOGOUT":
      return { ...state, user: null };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.payload] };
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
    default:
      const _: never = action;
      return state;
  }
}

const initialState: AppState = { user: null, loading: false, items: [] };
let appState = reducer(initialState, { type: "USER_LOGIN", payload: { userId: "u1", name: "Alice" } });
appState = reducer(appState, { type: "ADD_ITEM", payload: { id: "p1", name: "Laptop", qty: 1 } });
console.log("State:", appState);


// EXERCISE 3.3 — Build a result type.
// The Result pattern (common in Rust, also used in TS) is cleaner than throw/catch.
// Type: Result<T, E> = Ok<T> | Err<E>

type Ok<T>  = { ok: true;  value: T };
type Err<E> = { ok: false; error: E };
type Result<T, E = Error> = Ok<T> | Err<E>;

function ok<T>(value: T): Ok<T>   { return { ok: true, value }; }
function err<E>(error: E): Err<E>  { return { ok: false, error }; }

function safeDivide(a: number, b: number): Result<number, string> {
  if (b === 0) return err("Division by zero");
  return ok(a / b);
}

function safeParseJson<T>(json: string): Result<T, string> {
  try {
    return ok(JSON.parse(json) as T);
  } catch {
    return err(`Invalid JSON: ${json}`);
  }
}

// Usage — no try/catch needed, result is always checked:
const division = safeDivide(10, 2);
if (division.ok) console.log("Result:", division.value);   // Result: 5

const division2 = safeDivide(10, 0);
if (!division2.ok) console.log("Error:", division2.error); // Error: Division by zero

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: INTERSECTION TYPES & COMPOSITION
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Intersection type `A & B` means "this value must satisfy BOTH A and B".
//  Used to combine multiple type requirements.
//
//  Common uses:
//    1. Mixin types: type AdminUser = User & Permissions & Auditable
//    2. Augmenting existing types: type CachedResponse<T> = T & { _cache: CacheInfo }
//    3. Composing interfaces without using `extends`
//
//  GOTCHA: Intersecting conflicting types creates `never`.
//    type A = { id: string };
//    type B = { id: number };
//    type C = A & B;
//    // C.id has type `string & number` = `never`
//    // No value can satisfy both! This is usually a mistake.

// EXERCISE 4.1 — Composing with intersections.

type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

type SoftDelete = {
  deletedAt: Date | null;
  isDeleted: boolean;
};

type BaseEntity = {
  id: string;
};

// Compose a `UserEntity` type using intersections:
type UserEntity = BaseEntity & Timestamps & SoftDelete & {
  name: string;
  email: string;
  role: "admin" | "user";
};

// YOUR CODE HERE: Create a `createUserEntity` factory that fills in the fields.
function createUserEntity(
  name: string,
  email: string,
  role: "admin" | "user" = "user"
): UserEntity {
  return {
    id: Math.random().toString(36).slice(2),
    name,
    email,
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    isDeleted: false,
  };
}

const newUser = createUserEntity("Swastik", "s@example.com");
console.log("Created user:", newUser.name, "at", newUser.createdAt.toISOString());


// EXERCISE 4.2 — Augmenting third-party types.
// Simulate augmenting a response type from an API library.

type BaseRequest  = { url: string; method: string };
type AuthRequest  = BaseRequest & { authToken: string };
type LoggedRequest = BaseRequest & { requestId: string; timestamp: number };

type FullRequest = AuthRequest & LoggedRequest;

function sendRequest(req: FullRequest): void {
  console.log(`[${req.requestId}] ${req.method} ${req.url} (auth: ${req.authToken.slice(0, 8)}...)`);
}

sendRequest({
  url: "/api/users",
  method: "GET",
  authToken: "Bearer xyz-token-abc",
  requestId: "req-001",
  timestamp: Date.now(),
});

console.log("=== Section 4 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: INDEX SIGNATURES & MAPPED OBJECT TYPES (INTRO)
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Index signatures describe objects with dynamic keys.
//
//    interface StringMap { [key: string]: string; }
//    const headers: StringMap = { "Content-Type": "application/json" };
//
//  Constraints:
//    • The key type must be string, number, or symbol.
//    • All values must be compatible with the index signature's value type.
//    • Explicit properties must be assignable to the index signature value type.
//
//  Record<K, V> is cleaner for simple cases:
//    type StringMap = Record<string, string>
//
//  Use `Record<Keys, Type>` when keys are a union of known strings:
//    type StatusMap = Record<"pending" | "active" | "inactive", boolean>

// EXERCISE 5.1 — Index signatures.
interface Cache<T> {
  [key: string]: T | undefined;  // undefined because keys may not exist
  readonly _size?: number;       // named property must be compatible (T | undefined)
}

const userCache: Cache<{ name: string }> = {};
userCache["u1"] = { name: "Alice" };
const cached = userCache["u1"];    // type: { name: string } | undefined
if (cached) console.log(cached.name);  // "Alice"


// EXERCISE 5.2 — Record type.
type HttpStatusMap = Record<"200" | "400" | "401" | "404" | "500", string>;

const statusMessages: HttpStatusMap = {
  "200": "OK",
  "400": "Bad Request",
  "401": "Unauthorized",
  "404": "Not Found",
  "500": "Internal Server Error",
};

function getStatusMessage(code: keyof HttpStatusMap): string {
  return statusMessages[code];
}

console.log(getStatusMessage("404")); // "Not Found"


// EXERCISE 5.3 — Build a type-safe config system.
type EnvName = "development" | "staging" | "production";

interface EnvConfig {
  apiUrl: string;
  dbUrl: string;
  debug: boolean;
  logLevel: "verbose" | "info" | "warn" | "error";
}

const configs: Record<EnvName, EnvConfig> = {
  development: { apiUrl: "http://localhost:3000", dbUrl: "postgres://localhost/dev",   debug: true,  logLevel: "verbose" },
  staging:     { apiUrl: "https://staging.app",   dbUrl: "postgres://staging/db",     debug: false, logLevel: "info" },
  production:  { apiUrl: "https://app.com",       dbUrl: "postgres://prod/db",        debug: false, logLevel: "warn" },
};

function getConfig(env: EnvName): EnvConfig {
  return configs[env];
}

const devConfig = getConfig("development");
console.log("Dev API:", devConfig.apiUrl);

console.log("=== Section 5 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: MINI CHALLENGE
// ════════════════════════════════════════════════════════════════════════════

// CHALLENGE 6.1 — Model a real API response system.
// Write types and functions to handle paginated API responses.

interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

type PaginatedResponse<T> =
  | { status: "success"; data: T[]; meta: PaginationMeta }
  | { status: "error";   message: string; code: number }
  | { status: "loading" };

function createPaginatedSuccess<T>(
  data: T[],
  page: number,
  perPage: number,
  total: number
): PaginatedResponse<T> {
  return {
    status: "success",
    data,
    meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
  };
}

function extractData<T>(response: PaginatedResponse<T>): T[] {
  // YOUR CODE HERE: if success, return data; otherwise return []
  if (response.status === "success") return response.data;
  return [];
}

const response = createPaginatedSuccess(
  [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }],
  1, 10, 2
);
console.log("Data:", extractData(response));
console.log("Pages:", response.status === "success" ? response.meta.totalPages : 0);


// CHALLENGE 6.2 — Form validation types.
type ValidationRule<T> = {
  validate: (value: T) => boolean;
  message: string;
};

type FieldValidation<T extends object> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

interface SignupForm {
  username: string;
  email: string;
  age: number;
  password: string;
}

const signupRules: FieldValidation<SignupForm> = {
  username: [
    { validate: v => v.length >= 3,  message: "Username must be at least 3 characters" },
    { validate: v => /^\w+$/.test(v), message: "Username can only contain letters, numbers, underscores" },
  ],
  email: [
    { validate: v => v.includes("@"), message: "Must be a valid email" },
  ],
  age: [
    { validate: v => v >= 18, message: "Must be 18 or older" },
  ],
  password: [
    { validate: v => v.length >= 8, message: "Password must be at least 8 characters" },
  ],
};

function validateForm<T extends object>(
  data: T,
  rules: FieldValidation<T>
): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const field in rules) {
    const fieldRules = rules[field as keyof T];
    if (!fieldRules) continue;
    const value = data[field as keyof T];
    const fieldErrors = fieldRules
      .filter(rule => !rule.validate(value))
      .map(rule => rule.message);
    if (fieldErrors.length) errors[field] = fieldErrors;
  }
  return errors;
}

const formData: SignupForm = { username: "sw", email: "notanemail", age: 16, password: "short" };
const errors = validateForm(formData, signupRules);
console.log("Validation errors:", errors);

console.log("=== Sheet 3 complete! Move on to ts_04_generics.ts ===\n");

export {};
