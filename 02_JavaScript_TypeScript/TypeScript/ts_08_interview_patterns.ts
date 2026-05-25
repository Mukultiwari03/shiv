// ============================================================================
//  TYPESCRIPT — SHEET 8: INTERVIEW PATTERNS & REAL-WORLD USAGE
//  Goal: The most-asked TypeScript interview questions and patterns you'll
//        encounter in Next.js / React codebases. Read these, implement them,
//        and be able to explain your decisions.
// ============================================================================
//
//  HOW TO RUN:
//    ts-node ts_08_interview_patterns.ts
// ============================================================================


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: CLASSIC TYPESCRIPT INTERVIEW QUESTIONS
// ════════════════════════════════════════════════════════════════════════════

// Q1: "What is the difference between `interface` and `type`?"
// — See Sheet 3 Section 1 for the full answer.
// Key points to mention:
//   • interface can be extended with `extends`, supports declaration merging
//   • type can describe unions, intersections, tuples, primitives
//   • Both can describe object shapes — use interface for object contracts,
//     type for complex compositions

// Q2: "What is `unknown` and why use it over `any`?"
// — See Sheet 1 Section 2.
// Key: unknown is type-safe — you can't operate on it without narrowing first.
// any disables type checking entirely. Use unknown at system boundaries.

// Q3: "Explain structural typing."
// — See Sheet 1 Section 4.
// TypeScript checks SHAPE, not name. Two types with the same structure
// are compatible even if they have different names.

// Q4: "What are generics used for?"
// — Reusable, type-safe code that works with any type.
// The return type relates to the input type — no `any` needed.

// Q5: "What is a discriminated union?"
// — A union where each member has a shared literal property (discriminant).
// Used for state machines, API responses, Redux actions.
// Enables exhaustive switch-case checking.


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: REACT + NEXT.JS TYPE PATTERNS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: In React/Next.js, you'll type:
//    • Component props (with/without children)
//    • Event handlers
//    • useState / useRef / useReducer
//    • Server-side props (GetServerSideProps, GetStaticProps)
//    • API route handlers
//    • Form events

// --- SIMULATED REACT TYPES (since we're running in Node) ---
type ReactNode = unknown;

interface FC<P = {}> {
  (props: P): ReactNode;
}

// EXERCISE 2.1 — Component props patterns.

// a) Props with children:
interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

// b) Props that extend HTML element attributes (common pattern):
// In real React: interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>
// Here we simulate:
interface HTMLButtonAttributes {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (e: { target: unknown }) => void;
  className?: string;
}

interface ButtonProps extends HTMLButtonAttributes {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

// c) Polymorphic component (renders as different elements):
type As = "div" | "section" | "article" | "main" | "aside";
type BoxProps = {
  as?: As;
  children: ReactNode;
  className?: string;
};


// EXERCISE 2.2 — Strongly typed event handlers.
// In React, events are typed as React.ChangeEvent<HTMLInputElement>, etc.
// Simulated here:

interface ChangeEvent<T> { target: T & { value: string }; }
interface FocusEvent2    { target: { name: string }; }
interface FormEvent      { preventDefault(): void; }

type InputChangeHandler  = (e: ChangeEvent<{ name: string }>) => void;
type FormSubmitHandler   = (e: FormEvent) => void;

// Typed form state:
interface FormFields {
  username: string;
  email: string;
  age: string;  // HTML inputs always give strings
}

type FormChangeHandlers = {
  [K in keyof FormFields]: InputChangeHandler;
};


// EXERCISE 2.3 — Typed useReducer (this is EXACTLY how Redux Toolkit works).
type CounterAction =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "RESET" }
  | { type: "SET_VALUE"; payload: number };

interface CounterState {
  count: number;
  history: number[];
}

function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case "INCREMENT": return { ...state, count: state.count + 1, history: [...state.history, state.count + 1] };
    case "DECREMENT": return { ...state, count: state.count - 1, history: [...state.history, state.count - 1] };
    case "RESET":     return { count: 0, history: [] };
    case "SET_VALUE": return { ...state, count: action.payload, history: [...state.history, action.payload] };
    default:
      const _: never = action;
      return state;
  }
}

let state: CounterState = { count: 0, history: [] };
state = counterReducer(state, { type: "INCREMENT" });
state = counterReducer(state, { type: "INCREMENT" });
state = counterReducer(state, { type: "SET_VALUE", payload: 10 });
state = counterReducer(state, { type: "DECREMENT" });
console.log("Counter state:", state);


// EXERCISE 2.4 — Next.js API route typing (simulated).
// In Next.js: NextApiRequest, NextApiResponse

interface ApiRequest<Body = unknown> {
  method?: string;
  body: Body;
  query: Record<string, string | string[]>;
  headers: Record<string, string>;
}

interface ApiResponse<Data = unknown> {
  status(code: number): ApiResponse<Data>;
  json(data: Data): void;
}

interface UserCreateBody {
  name: string;
  email: string;
  role?: "admin" | "user";
}

interface UserDto {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
}

// Typed API handler:
function handleCreateUser(
  req: ApiRequest<UserCreateBody>,
  res: ApiResponse<UserDto | { error: string }>
): void {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, email, role = "user" } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: "name and email are required" });
    return;
  }

  res.status(201).json({
    id: Math.random().toString(36).slice(2),
    name,
    email,
    role,
    createdAt: new Date().toISOString(),
  });
}

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: ADVANCED INTERVIEW CHALLENGES
// ════════════════════════════════════════════════════════════════════════════

// CHALLENGE 3.1 — Type-safe event system with wildcards.
// Extend the event emitter to support wildcard listeners ("*" gets all events).

type WildcardEvents = { "*": { event: string; payload: unknown } };

class WildcardEmitter<Events extends Record<string, unknown>> {
  private handlers: Map<string, Array<(payload: unknown) => void>> = new Map();

  on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): void {
    const key = String(event);
    if (!this.handlers.has(key)) this.handlers.set(key, []);
    this.handlers.get(key)!.push(handler as (p: unknown) => void);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    const key = String(event);
    this.handlers.get(key)?.forEach(h => h(payload));
    this.handlers.get("*")?.forEach(h => h({ event: key, payload }));
  }

  onAll(handler: (info: { event: string; payload: unknown }) => void): void {
    if (!this.handlers.has("*")) this.handlers.set("*", []);
    this.handlers.get("*")!.push(handler as (p: unknown) => void);
  }
}

interface ShopEvents {
  "add_to_cart": { productId: string; qty: number };
  "checkout":    { total: number; items: string[] };
  "payment":     { amount: number; method: string };
}

const shop = new WildcardEmitter<ShopEvents>();
shop.onAll(({ event, payload }) => console.log(`[AUDIT] ${event}:`, payload));
shop.on("checkout", ({ total }) => console.log(`Checkout total: $${total}`));
shop.emit("add_to_cart", { productId: "p1", qty: 2 });
shop.emit("checkout", { total: 199.99, items: ["p1"] });


// CHALLENGE 3.2 — Type-safe configuration with dot-notation access.

type DotNotation<T extends object, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends object
    ? DotNotation<T[K], `${Prefix}${K}.`>
    : `${Prefix}${K}`;
}[keyof T & string];

interface AppSettings {
  server: { host: string; port: number };
  auth: { secret: string; expiry: number };
  features: { darkMode: boolean; beta: boolean };
}

type AppSettingKeys = DotNotation<AppSettings>;
// "server.host" | "server.port" | "auth.secret" | "auth.expiry" | "features.darkMode" | "features.beta"

function getSetting(settings: AppSettings, key: AppSettingKeys): unknown {
  const parts = key.split(".");
  return parts.reduce((obj, part) => (obj as Record<string, unknown>)[part], settings as unknown);
}

const settings: AppSettings = {
  server: { host: "localhost", port: 3000 },
  auth: { secret: "xyz", expiry: 3600 },
  features: { darkMode: true, beta: false },
};

console.log("Host:", getSetting(settings, "server.host")); // "localhost"
console.log("DarkMode:", getSetting(settings, "features.darkMode")); // true


// CHALLENGE 3.3 — Functional Option type with full type inference.
// A cleaner version of Maybe from Sheet 4.

type Option<T> = { some: true; value: T } | { some: false };

const Some = <T>(value: T): Option<T> => ({ some: true, value });
const None = <T>(): Option<T> => ({ some: false });

function mapOption<T, U>(opt: Option<T>, fn: (val: T) => U): Option<U> {
  return opt.some ? Some(fn(opt.value)) : None();
}

function flatMapOption<T, U>(opt: Option<T>, fn: (val: T) => Option<U>): Option<U> {
  return opt.some ? fn(opt.value) : None();
}

function getOrElse<T>(opt: Option<T>, fallback: T): T {
  return opt.some ? opt.value : fallback;
}

// Usage:
function parseNumber(s: string): Option<number> {
  const n = Number(s);
  return isNaN(n) ? None() : Some(n);
}

const doubled = mapOption(parseNumber("21"), n => n * 2);
const failed  = mapOption(parseNumber("abc"), n => n * 2);

console.log("Doubled:", getOrElse(doubled, 0));  // 42
console.log("Failed:", getOrElse(failed, -1));   // -1

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: GOTCHA QUESTIONS
// ════════════════════════════════════════════════════════════════════════════

// GOTCHA 1: `enum` vs `const enum`
// Regular enum generates JS code at runtime.
// const enum is fully erased — values are inlined at compile time.
// const enum can't be used with --isolatedModules (e.g. in Babel/swc).

enum Direction { Up = "UP", Down = "DOWN" }
const enum Axis { X = "X", Y = "Y" }  // inlined — Direction.Up becomes "UP" in output

const d: Direction = Direction.Up;
const a: Axis = Axis.X;  // compiled to just "X"
console.log(d, a);


// GOTCHA 2: Type predicates must be accurate — TypeScript trusts you.
function isUser(val: unknown): val is { name: string } {
  return typeof val === "object" && val !== null && "name" in val;
}

// If you lie in a predicate, TS trusts you and runtime crashes result:
// function badPredicate(val: unknown): val is string {
//   return true;  // lies! TS now thinks val is always a string
// }


// GOTCHA 3: `as const` vs explicit type annotation.
const colorsBad = ["red", "green", "blue"];     // type: string[]
const colorsGood = ["red", "green", "blue"] as const; // type: readonly ["red", "green", "blue"]

// For function parameters that need a literal type:
function paint(color: "red" | "green" | "blue"): void {
  console.log("Painting", color);
}
// paint(colorsBad[0]);   // Error! colorsBad[0] is `string`, not the literal union
paint(colorsGood[0]);     // OK! colorsGood[0] is "red"


// GOTCHA 4: Excess property checking only applies to OBJECT LITERALS.
interface Point { x: number; y: number; }
const pt = { x: 1, y: 2, z: 3 };
const p1: Point = pt;           // OK — assigned via variable (no excess check)
// const p2: Point = { x: 1, y: 2, z: 3 };  // Error — object literal triggers excess check


// GOTCHA 5: Optional vs undefined in function parameters.
function test1(x?: string) {}  // x is `string | undefined`, call: test1() or test1("a")
function test2(x: string | undefined) {}  // x is `string | undefined`, MUST call: test2(undefined)

test1();           // OK
test2(undefined);  // OK
// test2();        // Error! Argument required


// GOTCHA 6: Variance (brief).
// TypeScript uses structural typing which means:
// - Object types are COVARIANT in property types (can use a subtype)
// - Function parameter types are CONTRAVARIANT (for type safety)
// - Return types are COVARIANT

type Animal = { name: string };
type Dog = { name: string; breed: string };  // Dog is a subtype of Animal

type AnimalFn = (a: Animal) => void;
// A function accepting Animal can be used where Dog is expected:
const dogFn: (d: Dog) => void = (a: Animal) => console.log(a.name);  // OK (contravariant)

console.log("=== Section 4 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: FINAL PROJECT — TYPE A REAL API CLIENT
// ════════════════════════════════════════════════════════════════════════════
//
//  Build a fully typed REST API client that:
//    • Has typed endpoints (route + method → response shape)
//    • Returns typed responses
//    • Handles errors with typed error responses
//    • Supports middleware (logging, auth token injection)

interface UserAPI {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface PostAPI {
  id: string;
  title: string;
  content: string;
  authorId: string;
  publishedAt: string | null;
}

interface ApiEndpoints {
  "GET /users":              { response: UserAPI[] };
  "GET /users/:id":         { params: { id: string }; response: UserAPI };
  "POST /users":            { body: Omit<UserAPI, "id">; response: UserAPI };
  "PUT /users/:id":         { params: { id: string }; body: Partial<Omit<UserAPI, "id">>; response: UserAPI };
  "DELETE /users/:id":      { params: { id: string }; response: { success: boolean } };
  "GET /posts":             { response: PostAPI[] };
  "GET /posts/:id":        { params: { id: string }; response: PostAPI };
}

type RouteKey = keyof ApiEndpoints;
type RouteResponse<K extends RouteKey> = ApiEndpoints[K]["response"];
type RouteBody<K extends RouteKey> = "body" extends keyof ApiEndpoints[K]
  ? ApiEndpoints[K]["body"]
  : never;

// Simulated API client:
class TypedApiClient {
  private baseUrl: string;
  private authToken?: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setAuthToken(token: string): this {
    this.authToken = token;
    return this;
  }

  async get<K extends Extract<RouteKey, `GET ${string}`>>(
    route: K,
    params?: Record<string, string>
  ): Promise<RouteResponse<K>> {
    let url = `${this.baseUrl}${route.replace("GET ", "")}`;
    if (params) {
      for (const [key, val] of Object.entries(params)) {
        url = url.replace(`:${key}`, val);
      }
    }
    console.log(`[GET] ${url} (auth: ${this.authToken ? "yes" : "no"})`);
    // In real code: return fetch(url, { headers: { Authorization: `Bearer ${this.authToken}` } }).then(r => r.json())
    return {} as RouteResponse<K>;
  }

  async post<K extends Extract<RouteKey, `POST ${string}`>>(
    route: K,
    body: RouteBody<K>
  ): Promise<RouteResponse<K>> {
    const url = `${this.baseUrl}${route.replace("POST ", "")}`;
    console.log(`[POST] ${url}`, body);
    return {} as RouteResponse<K>;
  }
}

const client = new TypedApiClient("https://api.example.com");
client.setAuthToken("bearer-xyz");

// All calls are fully typed — wrong routes or bodies are errors:
client.get("GET /users");                           // Promise<UserAPI[]>
client.get("GET /users/:id", { id: "u-123" });     // Promise<UserAPI>
client.post("POST /users", { name: "Alice", email: "a@e.com", role: "user" });

console.log("\n🎉 ALL TYPESCRIPT SHEETS COMPLETE!");
console.log("You now have the TypeScript foundation to work confidently in Next.js.");
console.log("Go back and implement every 'YOUR CODE HERE' — that's where the learning happens.");

export {};
