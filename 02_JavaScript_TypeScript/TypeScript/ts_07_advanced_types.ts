// ============================================================================
//  TYPESCRIPT — SHEET 7: ADVANCED TYPE MANIPULATION
//  Goal: Master mapped types, template literal types, conditional types,
//        and the `infer` keyword. This is where TypeScript gets truly powerful.
// ============================================================================
//
//  HOW TO RUN:
//    ts-node ts_07_advanced_types.ts
// ============================================================================


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: MAPPED TYPES
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Mapped types transform every property of a type.
//  Syntax: { [K in keyof T]: TransformedType }
//
//  You can:
//    • Change value types:       { [K in keyof T]: boolean }
//    • Add/remove modifiers:     { [K in keyof T]+?: T[K] }  (add optional)
//                                { [K in keyof T]-?: T[K] }  (remove optional)
//                                { +readonly [K in keyof T]: T[K] }
//                                { -readonly [K in keyof T]: T[K] }
//    • Remap keys (TS 4.1+):    { [K in keyof T as NewKey]: T[K] }
//    • Filter properties:       { [K in keyof T as T[K] extends Filter ? K : never]: T[K] }
//
//  ALL built-in utility types (Partial, Required, Pick, Omit, Readonly, Record)
//  are implemented using mapped types under the hood.

// EXERCISE 1.1 — Basic mapped types.

interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

// a) Create Nullable<T> — all properties become T[K] | null
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullableProduct = Nullable<Product>;
const nullableP: NullableProduct = { id: null, name: "Laptop", price: null, inStock: true };


// b) Create Getters<T> — transforms { name: string } → { getName: () => string }
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type ProductGetters = Getters<Product>;
// ProductGetters = { getId: () => string; getName: () => string; ... }


// c) Create EventMap<T> — transforms { click: MouseEvent } → { onClick: (e: MouseEvent) => void }
type EventMap<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (event: T[K]) => void;
};

interface DOMEvents { click: MouseEvent; focus: FocusEvent; }
type Handlers = EventMap<DOMEvents>;
// Handlers = { onClick: (e: MouseEvent) => void; onFocus: (e: FocusEvent) => void }


// EXERCISE 1.2 — Filter properties with mapped types.

// Keep only properties of a specific type:
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

type StringProps  = PickByValue<Product, string>;   // { id: string; name: string }
type BooleanProps = PickByValue<Product, boolean>;  // { inStock: boolean }
type NumberProps  = PickByValue<Product, number>;   // { price: number }


// EXERCISE 1.3 — Deep mapped types.

// Deep Readonly:
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

interface AppConfig {
  server: { host: string; port: number; };
  database: { url: string; pool: { min: number; max: number; } };
}

const config: DeepReadonly<AppConfig> = {
  server: { host: "localhost", port: 3000 },
  database: { url: "postgres://localhost/dev", pool: { min: 2, max: 10 } },
};
// config.server.host = "other"; // Error! Deep readonly


// Verify by printing (no errors here):
console.log("Config host:", config.server.host);
console.log("Pool max:", config.database.pool.max);

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: TEMPLATE LITERAL TYPES
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Template literal types construct new string types at the type level.
//  Syntax: `` `prefix_${T}` `` where T is a string union.
//
//  When T is a union, the template literal DISTRIBUTES over each member:
//    type T = "a" | "b";
//    type R = `x_${T}`;  // "x_a" | "x_b"
//
//  Built-in string manipulation types:
//    Uppercase<S>     — "hello" → "HELLO"
//    Lowercase<S>     — "HELLO" → "hello"
//    Capitalize<S>    — "hello" → "Hello"
//    Uncapitalize<S>  — "Hello" → "hello"
//
//  REAL-WORLD USES:
//    • CSS class names:  `text-${Color}-${Shade}`
//    • Event names:      `on${Capitalize<EventName>}`
//    • API routes:       `/${Resource}/:id`
//    • Redux actions:    `${Slice}/${Action}`

// EXERCISE 2.1 — Build CSS class type.
type Color   = "red" | "green" | "blue" | "gray";
type Shade   = "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
type Size    = "sm" | "md" | "lg" | "xl";
type Side    = "top" | "right" | "bottom" | "left";

type ColorClass   = `text-${Color}-${Shade}` | `bg-${Color}-${Shade}`;
type PaddingClass = `p${Side extends "top" ? "t" : Side extends "right" ? "r" : Side extends "bottom" ? "b" : "l"}-${Size}`;

// Direct template literal:
type SpacingClass = `${"p" | "m"}${"t" | "r" | "b" | "l" | "x" | "y" | ""}-${Size}`;

const className: ColorClass = "bg-blue-500";
const padding: SpacingClass = "pt-md";


// EXERCISE 2.2 — Event handler naming convention.
type EventName = "click" | "focus" | "blur" | "change" | "submit" | "keydown";
type HandlerName = `on${Capitalize<EventName>}`;
// HandlerName = "onClick" | "onFocus" | "onBlur" | "onChange" | "onSubmit" | "onKeydown"

type EventHandlers = {
  [K in EventName as `on${Capitalize<K>}`]?: (event: Event) => void;
};

const handlers: EventHandlers = {
  onClick: (e) => console.log("clicked"),
  onSubmit: (e) => console.log("submitted"),
};


// EXERCISE 2.3 — API route builder.
type Resource = "users" | "products" | "orders";
type ApiRoute =
  | `/${Resource}`           // collection: /users
  | `/${Resource}/${string}` // item: /users/:id
  | `/${Resource}/search`;   // search: /users/search

const routes: ApiRoute[] = ["/users", "/products/p-123", "/orders/search"];
console.log("Routes:", routes);


// EXERCISE 2.4 — Extract type from template literal string using infer.
// Parse a CSS class name like "text-blue-500" back to its parts.

type ExtractColor<T extends string> =
  T extends `text-${infer C}-${string}` ? C :
  T extends `bg-${infer C}-${string}` ? C :
  never;

type BlueFromText = ExtractColor<"text-blue-500">;  // "blue"
type RedFromBg    = ExtractColor<"bg-red-100">;     // "red"
type NoColor      = ExtractColor<"font-bold">;      // never

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: CONDITIONAL TYPES IN DEPTH
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Conditional types add branching logic to the type system.
//  Syntax: `T extends U ? TrueType : FalseType`
//
//  DISTRIBUTIVE conditional types:
//  When T is a NAKED type parameter (not wrapped), conditional types distribute
//  over each member of a union:
//    type IsString<T> = T extends string ? "yes" : "no";
//    IsString<string | number>  →  "yes" | "no"   (applied to each member)
//
//  To PREVENT distribution, wrap T in a tuple:
//    type IsStringExact<T> = [T] extends [string] ? "yes" : "no";
//    IsStringExact<string | number>  →  "no"  (treats union as a whole)
//
//  `infer` keyword:
//  Declare a type variable within the conditional type.
//  TS infers its value from the matched structure.
//    type ElementOf<T> = T extends Array<infer E> ? E : never;
//    type N = ElementOf<number[]>;  // number
//
//    type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

// EXERCISE 3.1 — Conditional type utility library.

// a) IsNever<T> — true if T is never
type IsNever<T> = [T] extends [never] ? true : false;
type T1 = IsNever<never>;   // true
type T2 = IsNever<string>;  // false

// b) IsUnion<T> — true if T is a union of multiple types
type IsUnion<T, U = T> = T extends U ? ([U] extends [T] ? false : true) : never;
type U1 = IsUnion<"a" | "b">;  // true
type U2 = IsUnion<string>;     // false

// c) Head<T> — first element of a tuple
type Head<T extends readonly unknown[]> = T extends readonly [infer H, ...unknown[]] ? H : never;
type H = Head<[string, number, boolean]>;  // string

// d) Tail<T> — tuple without first element
type Tail<T extends readonly unknown[]> = T extends readonly [unknown, ...infer T] ? T : never;
type TailOfTuple = Tail<[string, number, boolean]>;  // [number, boolean]

// e) Last<T> — last element of a tuple
type Last<T extends readonly unknown[]> = T extends readonly [...unknown[], infer L] ? L : never;
type L = Last<[string, number, boolean]>;  // boolean


// EXERCISE 3.2 — UnionToIntersection (advanced).
// Convert a union to an intersection using conditional types.
// "A | B" → "A & B"
// This uses the covariant/contravariant position trick with function types.

type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type ABC = UnionToIntersection<{ a: 1 } | { b: 2 } | { c: 3 }>;
// ABC = { a: 1 } & { b: 2 } & { c: 3 }

const abc: ABC = { a: 1, b: 2, c: 3 };
console.log("UnionToIntersection:", abc);


// EXERCISE 3.3 — DeepReadonly with conditional types.
// Already written in Section 1, but re-examine:
type DeepReadonly2<T> = {
  readonly [K in keyof T]: T[K] extends (infer E)[]
    ? ReadonlyArray<DeepReadonly2<E>>
    : T[K] extends object
    ? DeepReadonly2<T[K]>
    : T[K];
};

// This version also handles arrays correctly.

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: ADVANCED infer PATTERNS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: `infer` is how TypeScript extracts type information from within
//  a complex type. It can appear in conditional type positions.
//
//  Common patterns:
//    Extract element type from array:
//      T extends Array<infer E> ? E : never
//    Extract return type:
//      T extends (...args: any) => infer R ? R : never
//    Extract promise inner type:
//      T extends Promise<infer U> ? U : T
//    Extract a specific tuple position:
//      T extends [infer A, infer B] ? [B, A] : never  (swap pair)

// EXERCISE 4.1 — Extract types from complex structures.

// a) PromiseValue<T> — fully unwrap nested promises
type PromiseValue<T> = T extends Promise<infer U> ? PromiseValue<U> : T;
type Unwrapped = PromiseValue<Promise<Promise<string>>>;  // string

// b) FunctionReturn<T> — return type of a function
type FunctionReturn<T> = T extends (...args: any[]) => infer R ? R : never;
type Ret = FunctionReturn<() => { name: string }>;  // { name: string }

// c) ObjectValues<T> — union of all value types in an object
type ObjectValues<T> = T[keyof T];
type V = ObjectValues<{ a: string; b: number; c: boolean }>;  // string | number | boolean

// d) Overwrite<T, U> — replace overlapping properties in T with those from U
type Overwrite<T, U> = Omit<T, keyof U> & U;
type A = { id: string; name: string; age: number };
type B = { age: string };  // age is now string instead of number
type C = Overwrite<A, B>;  // { id: string; name: string; age: string }


// EXERCISE 4.2 — Parse a route string type.
// Extract parameter names from a route pattern like "/users/:id/posts/:postId"

type ExtractRouteParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractRouteParams<`/${Rest}`>]: string }
    : T extends `${string}:${infer Param}`
    ? { [K in Param]: string }
    : {};

type UserPostParams = ExtractRouteParams<"/users/:userId/posts/:postId">;
// UserPostParams = { userId: string; postId: string }

function buildRoute<T extends string>(
  pattern: T,
  params: ExtractRouteParams<T>
): string {
  return Object.entries(params).reduce(
    (url, [key, val]) => url.replace(`:${key}`, val as string),
    pattern
  );
}

const url = buildRoute("/users/:userId/posts/:postId", {
  userId: "u-123",
  postId: "p-456",
});
console.log("Built URL:", url); // /users/u-123/posts/p-456

console.log("=== Section 4 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: MINI CHALLENGE
// ════════════════════════════════════════════════════════════════════════════

// CHALLENGE 5.1 — Type-safe form builder.
// Create a type that represents form state, tracking:
//   - value (the actual field value)
//   - error (validation error or null)
//   - touched (whether the user has interacted with it)

type FieldState<T> = {
  value: T;
  error: string | null;
  touched: boolean;
};

type FormState<T extends Record<string, unknown>> = {
  [K in keyof T]: FieldState<T[K]>;
};

interface LoginForm {
  username: string;
  password: string;
  rememberMe: boolean;
}

type LoginFormState = FormState<LoginForm>;
// LoginFormState = {
//   username: FieldState<string>;
//   password: FieldState<string>;
//   rememberMe: FieldState<boolean>;
// }

function createFormState<T extends Record<string, unknown>>(
  initial: T
): FormState<T> {
  return Object.fromEntries(
    Object.entries(initial).map(([key, value]) => [
      key,
      { value, error: null, touched: false },
    ])
  ) as FormState<T>;
}

const loginState = createFormState<LoginForm>({
  username: "",
  password: "",
  rememberMe: false,
});

// Fully typed access:
console.log("Username value:", loginState.username.value);
console.log("Password touched:", loginState.password.touched);


// CHALLENGE 5.2 — Recursive type: JSON type.
// Define a type that represents any valid JSON value.
type JSONPrimitive = string | number | boolean | null;
type JSONArray     = JSONValue[];
type JSONObject    = { [key: string]: JSONValue };
type JSONValue     = JSONPrimitive | JSONArray | JSONObject;

function parseJSON(raw: string): JSONValue {
  return JSON.parse(raw) as JSONValue;
}

const json = parseJSON('{"name":"Alice","scores":[1,2,3],"active":true}');
console.log("Parsed JSON type check:", typeof json === "object");


// CHALLENGE 5.3 — Schema-to-type inference.
// Define a schema object and derive its TypeScript type automatically.

const userSchema = {
  id:    { type: "string" as const,  required: true  },
  name:  { type: "string" as const,  required: true  },
  age:   { type: "number" as const,  required: false },
  email: { type: "string" as const,  required: true  },
} as const;

type TypeMap = { string: string; number: number; boolean: boolean };

type SchemaToType<S extends Record<string, { type: keyof TypeMap; required: boolean }>> = {
  [K in keyof S as S[K]["required"] extends true ? K : never]: TypeMap[S[K]["type"]];
} & {
  [K in keyof S as S[K]["required"] extends false ? K : never]?: TypeMap[S[K]["type"]];
};

type InferredUser = SchemaToType<typeof userSchema>;
// InferredUser = { id: string; name: string; email: string; age?: number }

const testUser: InferredUser = {
  id: "u1",
  name: "Swastik",
  email: "s@example.com",
  // age is optional
};
console.log("Schema-derived user:", testUser.name);

console.log("=== Sheet 7 complete! Move on to ts_08_interview_patterns.ts ===\n");

export {};
