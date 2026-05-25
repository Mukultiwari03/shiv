// ============================================================================
//  TYPESCRIPT — SHEET 6: CLASSES IN TYPESCRIPT
//  Goal: Master TypeScript's class features — access modifiers, parameter
//        properties, abstract classes, implements, and design patterns.
// ============================================================================
//
//  HOW TO RUN:
//    ts-node ts_06_classes.ts
// ============================================================================


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: ACCESS MODIFIERS & PARAMETER PROPERTIES
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: TypeScript adds access control to classes.
//
//  public    — accessible from ANYWHERE (default if no modifier)
//  private   — accessible only WITHIN the class body
//              (compiled away at runtime — just a compile-time check)
//  protected — accessible within the class AND its SUBCLASSES
//  readonly  — can be set once (in declaration or constructor), never changed
//  #field    — true private (runtime enforcement, ES2022)
//
//  PARAMETER PROPERTIES SHORTHAND:
//  Instead of:
//    class User {
//      name: string;
//      private age: number;
//      constructor(name: string, age: number) {
//        this.name = name;
//        this.age = age;
//      }
//    }
//
//  Write:
//    class User {
//      constructor(public name: string, private age: number) {}
//    }
//
//  The modifier in the constructor parameter automatically:
//    1. Declares the property on the class
//    2. Assigns the argument to `this.property`
//  This is extremely common in NestJS, Angular, and well-typed TS code.
//
//  INTERVIEW TIP: "Difference between private and #?"
//  `private` is TypeScript-only — compiled to nothing in JS output.
//    It's enforced ONLY by the TS compiler, not at runtime.
//  `#` is JavaScript private fields — enforced at runtime.
//    Accessing `obj.#field` outside the class is a SyntaxError, not just a TS error.

// EXERCISE 1.1 — Parameter properties.
// Rewrite this verbose class using parameter properties.

// BEFORE (verbose):
class VerboseUser {
  public id: string;
  public name: string;
  private password: string;
  readonly createdAt: Date;

  constructor(id: string, name: string, password: string) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.createdAt = new Date();
  }
}

// AFTER (concise with parameter properties):
class User {
  readonly createdAt: Date = new Date();

  constructor(
    public readonly id: string,
    public name: string,
    private password: string,
  ) {}

  checkPassword(attempt: string): boolean {
    return this.password === attempt;
  }

  toString(): string {
    return `User(${this.id}, ${this.name})`;
  }
}

const u = new User("u1", "Swastik", "secret123");
console.log(u.toString());
console.log(u.checkPassword("secret123")); // true
// u.password;      // Error! private
// u.id = "u2";     // Error! readonly
// u.createdAt = new Date(); // Error! readonly


// EXERCISE 1.2 — Protected for inheritance.
class BaseRepository {
  constructor(protected readonly tableName: string) {}

  protected buildQuery(where: string): string {
    return `SELECT * FROM ${this.tableName} WHERE ${where}`;
  }

  // private helper — not accessible in subclasses
  private log(msg: string): void {
    console.log(`[${this.tableName}] ${msg}`);
  }

  findAll(): string {
    return `SELECT * FROM ${this.tableName}`;
  }
}

class UserRepository extends BaseRepository {
  constructor() {
    super("users");
  }

  findByEmail(email: string): string {
    return this.buildQuery(`email = '${email}'`); // protected — accessible here
    // this.log("...");  // Error! private — not accessible
  }

  findAdmins(): string {
    return this.buildQuery("role = 'admin'");
  }
}

const repo = new UserRepository();
console.log(repo.findAll());
console.log(repo.findByEmail("alice@example.com"));
// repo.buildQuery("...");  // Error! protected — not accessible outside class hierarchy

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: GETTERS, SETTERS & STATIC MEMBERS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Getters and setters.
//  Accessed like properties but execute code. Great for:
//    • Computed properties (area, fullName)
//    • Validation on write (reject invalid ages)
//    • Lazy computation (compute and cache on first access)
//
//  Static members belong to the CLASS, not instances.
//    • Static properties: shared across all instances (e.g. counter, config)
//    • Static methods: utility/factory functions that don't need `this`
//    • Static blocks (ES2022): initialize static properties with complex logic

// EXERCISE 2.1 — Getters, setters with validation.
class Circle {
  private _radius: number;

  constructor(radius: number) {
    this._radius = this.validate(radius);
  }

  private validate(r: number): number {
    if (r < 0) throw new RangeError("Radius cannot be negative");
    return r;
  }

  get radius(): number { return this._radius; }
  set radius(value: number) { this._radius = this.validate(value); }

  get area(): number { return Math.PI * this._radius ** 2; }
  get circumference(): number { return 2 * Math.PI * this._radius; }

  toString(): string {
    return `Circle(r=${this._radius}, area=${this.area.toFixed(2)})`;
  }
}

const c = new Circle(5);
console.log(c.area.toFixed(2));          // 78.54
c.radius = 10;
console.log(c.circumference.toFixed(2)); // 62.83
try { c.radius = -1; } catch (e) { console.log("Caught:", (e as Error).message); }


// EXERCISE 2.2 — Static factory methods and singleton.
class Config {
  private static instance: Config | null = null;
  private readonly settings: Map<string, string> = new Map();

  private constructor() {
    this.settings.set("env", "development");
    this.settings.set("version", "1.0.0");
  }

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  get(key: string): string | undefined {
    return this.settings.get(key);
  }

  set(key: string, value: string): void {
    this.settings.set(key, value);
  }
}

const config1 = Config.getInstance();
const config2 = Config.getInstance();
config1.set("debug", "true");
console.log("Same instance:", config1 === config2);        // true
console.log("debug from config2:", config2.get("debug")); // "true"


// EXERCISE 2.3 — Static counter.
class IdGenerator {
  private static nextId = 1;
  private static readonly prefix: string = "ID";

  static generate(): string {
    return `${IdGenerator.prefix}-${String(IdGenerator.nextId++).padStart(6, "0")}`;
  }

  static reset(): void {
    IdGenerator.nextId = 1;
  }
}

console.log(IdGenerator.generate()); // "ID-000001"
console.log(IdGenerator.generate()); // "ID-000002"
console.log(IdGenerator.generate()); // "ID-000003"

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: ABSTRACT CLASSES & INTERFACES WITH CLASSES
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Abstract classes.
//  • Cannot be instantiated directly — only subclasses can.
//  • Can have a mix of: implemented methods (with body) AND abstract methods (no body).
//  • Abstract methods MUST be implemented by concrete subclasses.
//  • Use when you have SHARED LOGIC but need to enforce a contract on subclasses.
//
//  interface vs abstract class:
//    Interface: pure type contract. Zero runtime footprint. Can be implemented by anything.
//    Abstract: can contain real logic. Has runtime footprint (it's a real JS class).
//
//  implements keyword:
//  A class can implement MULTIPLE interfaces.
//    class Duck implements Animal, Swimmer, Flyable { ... }
//  This ensures the class has all required methods/properties.
//
//  INTERVIEW TIP: "When do you use interface vs abstract class?"
//  Use `interface` when the contract is purely structural and you want multiple
//  implementations (different classes from different hierarchies).
//  Use `abstract` when you have shared implementation code to reuse.

// EXERCISE 3.1 — Abstract base class for payment processors.
abstract class PaymentProcessor {
  constructor(
    protected readonly name: string,
    protected readonly currency: string = "USD"
  ) {}

  // Shared logic — all processors use this:
  processPayment(amount: number): string {
    if (amount <= 0) throw new RangeError("Amount must be positive");
    const result = this.chargeCard(amount);
    return `[${this.name}] ${result}`;
  }

  // Subclasses must implement this differently:
  protected abstract chargeCard(amount: number): string;
  abstract refund(transactionId: string): boolean;

  // Template method using abstract method:
  getReceipt(amount: number): string {
    const result = this.processPayment(amount);
    return `Receipt: ${result} (${this.currency})`;
  }
}

class StripeProcessor extends PaymentProcessor {
  constructor() { super("Stripe"); }

  protected chargeCard(amount: number): string {
    return `Charged $${amount} via Stripe API`;
  }

  refund(transactionId: string): boolean {
    console.log(`Stripe: refunding ${transactionId}`);
    return true;
  }
}

class PayPalProcessor extends PaymentProcessor {
  constructor() { super("PayPal"); }

  protected chargeCard(amount: number): string {
    return `Charged $${amount} via PayPal SDK`;
  }

  refund(transactionId: string): boolean {
    console.log(`PayPal: refunding ${transactionId}`);
    return true;
  }
}

const processors: PaymentProcessor[] = [new StripeProcessor(), new PayPalProcessor()];
processors.forEach(p => console.log(p.getReceipt(99.99)));

// new PaymentProcessor("test"); // Error! Cannot create instance of abstract class


// EXERCISE 3.2 — Multiple interface implementation.
interface Serializable {
  serialize(): string;
  deserialize(data: string): void;
}

interface Validatable {
  validate(): { valid: boolean; errors: string[] };
}

interface Auditable {
  readonly createdAt: Date;
  readonly updatedAt: Date;
  touch(): void;
}

class OrderItem implements Serializable, Validatable, Auditable {
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(
    public productId: string,
    public quantity: number,
    public price: number
  ) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  serialize(): string {
    return JSON.stringify({ productId: this.productId, quantity: this.quantity, price: this.price });
  }

  deserialize(data: string): void {
    const parsed = JSON.parse(data);
    this.productId = parsed.productId;
    this.quantity  = parsed.quantity;
    this.price     = parsed.price;
    this.touch();
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!this.productId) errors.push("Product ID required");
    if (this.quantity <= 0) errors.push("Quantity must be positive");
    if (this.price < 0) errors.push("Price cannot be negative");
    return { valid: errors.length === 0, errors };
  }

  touch(): void {
    (this as { updatedAt: Date }).updatedAt = new Date();
  }
}

const item = new OrderItem("prod-001", 2, 49.99);
console.log("Valid:", item.validate().valid);
console.log("Serialized:", item.serialize());

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: DESIGN PATTERNS WITH TYPESCRIPT CLASSES
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 4.1 — Builder Pattern.
// The builder pattern constructs complex objects step-by-step with a fluent API.

class RequestBuilder {
  private url: string = "";
  private method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET";
  private headers: Record<string, string> = {};
  private body?: unknown;
  private timeout: number = 30000;

  setUrl(url: string): this {
    this.url = url;
    return this;
  }

  setMethod(method: typeof this.method): this {
    this.method = method;
    return this;
  }

  setHeader(key: string, value: string): this {
    this.headers[key] = value;
    return this;
  }

  setBody(body: unknown): this {
    this.body = body;
    return this;
  }

  setTimeout(ms: number): this {
    this.timeout = ms;
    return this;
  }

  build(): { url: string; method: string; headers: Record<string, string>; body?: unknown; timeout: number } {
    if (!this.url) throw new Error("URL is required");
    return { url: this.url, method: this.method, headers: this.headers, body: this.body, timeout: this.timeout };
  }
}

const request = new RequestBuilder()
  .setUrl("/api/users")
  .setMethod("POST")
  .setHeader("Content-Type", "application/json")
  .setHeader("Authorization", "Bearer token-123")
  .setBody({ name: "Alice", email: "alice@example.com" })
  .setTimeout(5000)
  .build();

console.log("Built request:", request.method, request.url);


// EXERCISE 4.2 — Observer Pattern.
interface Observer<T> {
  update(data: T): void;
}

abstract class Subject<T> {
  private observers: Observer<T>[] = [];

  subscribe(observer: Observer<T>): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers = this.observers.filter(o => o !== observer);
  }

  protected notify(data: T): void {
    this.observers.forEach(o => o.update(data));
  }
}

interface StockUpdate { symbol: string; price: number; change: number; }

class StockTicker extends Subject<StockUpdate> {
  private prices: Map<string, number> = new Map();

  updatePrice(symbol: string, newPrice: number): void {
    const oldPrice = this.prices.get(symbol) ?? newPrice;
    const change = ((newPrice - oldPrice) / oldPrice) * 100;
    this.prices.set(symbol, newPrice);
    this.notify({ symbol, price: newPrice, change });
  }
}

class PriceAlertObserver implements Observer<StockUpdate> {
  constructor(private readonly threshold: number) {}

  update({ symbol, price, change }: StockUpdate): void {
    if (Math.abs(change) >= this.threshold) {
      console.log(`ALERT: ${symbol} moved ${change.toFixed(2)}% to $${price}`);
    }
  }
}

class LogObserver implements Observer<StockUpdate> {
  update({ symbol, price }: StockUpdate): void {
    console.log(`LOG: ${symbol} = $${price}`);
  }
}

const ticker = new StockTicker();
const alertObserver = new PriceAlertObserver(5);
const logObserver   = new LogObserver();

ticker.subscribe(alertObserver);
ticker.subscribe(logObserver);

ticker.updatePrice("AAPL", 150);
ticker.updatePrice("AAPL", 165); // 10% change — triggers alert

ticker.unsubscribe(logObserver);
ticker.updatePrice("AAPL", 160); // alert still fires, log doesn't

console.log("=== Section 4 done ===\n");
console.log("=== Sheet 6 complete! Move on to ts_07_advanced_types.ts ===\n");

export {};
