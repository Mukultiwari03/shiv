// ============================================================================
//  JAVASCRIPT — SHEET 5: CLASSES & OBJECT-ORIENTED PROGRAMMING
//  Goal: Understand ES6 classes, inheritance, encapsulation, and how they
//        map to JavaScript's prototype-based system under the hood.
// ============================================================================
//
//  HOW TO RUN:
//    node js_05_classes.js
// ============================================================================

const assert = (actual, expected, label) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) console.log("  Expected:", expected, "| Got:", actual);
};


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: CLASS BASICS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: ES6 class syntax is "syntactic sugar" over JavaScript's prototype
//  system. Under the hood, it still works with prototypes — the class keyword
//  just makes it cleaner to write.
//
//  Anatomy of a class:
//
//    class Animal {
//      // Constructor: called when you do `new Animal(...)`
//      constructor(name, sound) {
//        this.name = name;          // instance property
//        this.sound = sound;
//      }
//
//      // Instance method (lives on the prototype, shared by all instances)
//      speak() {
//        return `${this.name} says ${this.sound}`;
//      }
//
//      // Static method (belongs to the CLASS, not instances)
//      static create(name, sound) {
//        return new Animal(name, sound);
//      }
//    }
//
//    const cat = new Animal("Cat", "meow");
//    cat.speak();           // "Cat says meow"
//    Animal.create(...)     // static — call on the class, not the instance
//    cat.constructor === Animal  // true
//
//  INTERVIEW TIP: "What is the difference between instance and static methods?"
//  Instance methods operate on a specific object (they use `this`).
//  Static methods belong to the class itself — they can't access instance data.
//  Use static for utilities, factories, or logic not tied to any specific instance.

// EXERCISE 1.1 — Create a `Rectangle` class.
// Properties: width, height
// Methods:
//   area()         → width * height
//   perimeter()    → 2 * (width + height)
//   isSquare()     → true if width === height
//   toString()     → "Rectangle(4 x 6)"
// Static:
//   fromArray([w, h])  → creates a Rectangle from an array
//   square(side)       → creates a square Rectangle (both sides equal)

class Rectangle {
  constructor(width, height){
    this.width = width;
    this.height = height;
  }

  area(){
    return this.width*this.height
  }
  perimeter(){
    return 2*(this.width+this.height);
  }
  isSquare(){
    return this.width===this.height
  }
  toString(){
    return `Rectangle(${this.width} x ${this.height})`
  }

  static fromArray([w,h]){
    return new Rectangle(w,h)
  }

  static square(side){
    return new Rectangle(side, side)
  }
}

const r = new Rectangle(4, 6);
assert(r.area(), 24, "Rectangle area");
assert(r.perimeter(), 20, "Rectangle perimeter");
assert(r.isSquare(), false, "Rectangle isSquare false");
assert(r.toString(), "Rectangle(4 x 6)", "Rectangle toString");

const sq = Rectangle.square(5);
assert(sq.area(), 25, "Rectangle.square area");
assert(sq.isSquare(), true, "Rectangle.square isSquare true");

const r2 = Rectangle.fromArray([3, 7]);
assert(r2.area(), 21, "Rectangle.fromArray area");


// EXERCISE 1.2 — Getters and Setters.
// Getters and setters let you define computed properties and validation logic.
//
//  class Circle {
//    constructor(radius) {
//      this._radius = radius;   // _ convention = "private by convention"
//    }
//    get radius() { return this._radius; }
//    set radius(value) {
//      if (value < 0) throw new Error("Radius cannot be negative");
//      this._radius = value;
//    }
//    get area() { return Math.PI * this._radius ** 2; }
//  }
//  const c = new Circle(5);
//  c.radius = 10;  // uses setter
//  c.area          // uses getter — called like a property, not a method!

class Temperature {
  constructor(celsius) {
    this.celsius = celsius
  }
  get celsius() { 
    /* YOUR CODE HERE */ 
    return this._celsius
  }
  set celsius(val) { 
    /* YOUR CODE HERE: validate val >= -273.15 */
    if(val>=-273.5){
      // throw new Error("Temperature is below the absolute zero")
      this._celsius = val
    }
  
  }
  get fahrenheit() { 
    /* YOUR CODE HERE: C * 9/5 + 32 */ 
    return (this._celsius * 9/5 ) + 32
  
  }
  set fahrenheit(val) { 
    /* YOUR CODE HERE: convert and store as celsius */
    this._celsius = (val-32)*5/9

    return this._celsius
  }
  get kelvin() { 
    /* YOUR CODE HERE: C + 273.15 */ 
    return this._celsius + 273.15
  }
}

const temp = new Temperature(0);
assert(Math.round(temp.fahrenheit), 32, "0°C in Fahrenheit");
assert(Math.round(temp.kelvin * 100) / 100, 273.15, "0°C in Kelvin");

temp.fahrenheit = 212;
assert(temp.celsius, 100, "212°F to Celsius");

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: INHERITANCE
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Inheritance with `extends` and `super`.
//
//  class Dog extends Animal {
//    constructor(name, breed) {
//      super(name, "woof");   // MUST call super() before using `this`
//      this.breed = breed;
//    }
//    fetch() { return `${this.name} fetches the ball!`; }
//    speak() {
//      return super.speak() + " loudly!";  // call parent method
//    }
//  }
//
//  Key rules:
//    • `extends` sets up the prototype chain.
//    • `super()` in the constructor calls the parent constructor.
//    • Must call super() BEFORE any `this.xxx` assignment in child constructor.
//    • `super.method()` calls the parent's method from an override.
//    • `instanceof` checks the chain: `new Dog() instanceof Animal` → true.
//
//  INTERVIEW TIP: "What is the prototype chain?"
//  Every object has an internal [[Prototype]] link. When you access a property,
//  JS looks at the object first, then walks UP the chain until it finds it or
//  reaches null. Classes set this chain via `extends`. This is how instance
//  methods are shared without copying them onto every object.

// EXERCISE 2.1 — Build an inheritance chain.
// Base class: `Shape`
//   - constructor(color = "black")
//   - method: describe() → "A black shape"
//   - abstract-ish: area() → throw new Error("Not implemented") (no true abstract in JS)

//  ABSTRACT CLASS - An abstract class is a class that "CANNOT BE CREATED" directly and is meant to inherted
// It may contain methods that must be implemented by child classes.

// Child class: `Circle` extends Shape
//   - constructor(radius, color)
//   - override area() → Math.PI * r^2  (round to 2 decimal places)
//   - override describe() → "A red circle with radius 5"
//
// Child class: `Triangle` extends Shape
//   - constructor(base, height, color)
//   - override area() → 0.5 * base * height
//   - override describe() → "A blue triangle (base: 3, height: 4)"

class Shape {
  // YOUR CODE HERE
  constructor(color="black"){
    this.color = color
  }

  describe(){
    return `A ${this.color} shape`
  }
  area(){
    throw new Error("Not Implemented");
  }
}

class Circle extends Shape {
  constructor(radius,color){
    super(color);
    this.radius = radius
  }
  area(){
    return Number((Math.PI * this.radius**2).toFixed(2));
  }

  describe(){
    return `A ${this.color} circle with radius ${this.radius}`;
  }

}

class Triangle extends Shape {
  // YOUR CODE HERE
  constructor(base,height,color){
    super(color)
    this.base = base;
    this.height = height;
  }

  area(){
    return 0.5 * this.base * this.height;
  }

  describe(){
    return `A ${this.color} triangle (base: ${this.base}, height: ${this.height})`
  }

}

const c = new Circle(5, "red");
assert(c.area(), 78.54, "Circle area");
assert(c.describe(), "A red circle with radius 5", "Circle describe");
assert(c instanceof Shape, true, "Circle instanceof Shape");
assert(c instanceof Circle, true, "Circle instanceof Circle");

const t = new Triangle(3, 4, "blue");
assert(t.area(), 6, "Triangle area");
assert(t.describe(), "A blue triangle (base: 3, height: 4)", "Triangle describe");


// EXERCISE 2.2 — Method overriding and super.
// Create class `LoggedArray` that extends the built-in Array.
// Override push() to log "Adding: <item>" before actually pushing.
// Use super.push() to delegate to the real push.

class LoggedArray extends Array {
  // YOUR CODE HERE
  constructor(item){
    super(item);
    this.item = item;
  }
  push(item){
    console.log(`Adding: ${this.item}`);
   return super.push(this.item);
  }
}

const la = new LoggedArray();
la.push("apple");   // logs "Adding: apple"
la.push("banana");  // logs "Adding: banana"
assert(la.length, 2, "LoggedArray length");
assert(la[0], "apple", "LoggedArray first item");

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: PRIVATE FIELDS & ENCAPSULATION
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: True private class fields (ES2022).
//  Fields prefixed with # are genuinely private — not accessible outside the class.
//  This is a real language enforcement, unlike the old _ convention.
//
//    class Wallet {
//      #balance = 0;        // private field (must be declared at class level)
//      get balance() { return this.#balance; }
//      deposit(n) { this.#balance += n; }
//    }
//    const w = new Wallet();
//    w.balance        // OK (through getter)
//    w.#balance       // SyntaxError! Truly private.
//
//  INTERVIEW TIP: Know the difference:
//    _balance   — convention only, still publicly accessible
//    #balance   — truly private, enforced by the language (ES2022+)

// EXERCISE 3.1 — Build a `SecureVault` class using private fields.
// Private:
//   #pin (number, set in constructor)
//   #locked (boolean, starts true)
//   #contents (array, starts empty)
//
// Public methods:
//   unlock(pin)       — if pin matches #pin, set #locked = false, return true. Else return false.
//   lock()            — set #locked = true
//   addItem(item)     — if locked, throw Error("Vault is locked"). Otherwise push to #contents.
//   getContents()     — if locked, throw. Otherwise return copy of #contents.

class SecureVault {
  // YOUR CODE HERE
  
}

const vault = new SecureVault(1234);
assert(vault.unlock(9999), false, "Wrong PIN");
assert(vault.unlock(1234), true, "Correct PIN");
vault.addItem("diamond");
vault.addItem("gold");
assert(vault.getContents(), ["diamond", "gold"], "Vault contents");
vault.lock();
try {
  vault.addItem("silver");
  console.log("✗ Should have thrown");
} catch (e) {
  console.log("✓ Vault locked correctly:", e.message);
}

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: MIXINS — COMPOSITION OVER INHERITANCE
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: JavaScript only supports SINGLE inheritance (one parent class).
//  Mixins are a pattern to add reusable behaviour from multiple sources WITHOUT
//  deep inheritance chains.
//
//  A mixin is a plain object or function that adds methods to a class's prototype.
//
//    const Serializable = (Base) => class extends Base {
//      serialize() { return JSON.stringify(this); }
//    };
//
//    const Validatable = (Base) => class extends Base {
//      validate() { return Object.keys(this).length > 0; }
//    };
//
//    class User extends Serializable(Validatable(BaseModel)) { ... }
//
//  INTERVIEW TIP: "Why favour composition over inheritance?"
//  Deep inheritance chains become brittle — a change at the top cascades down.
//  Mixins let you build classes by composing specific, focused capabilities,
//  which is easier to test and maintain. This is the "has-a" vs "is-a" principle.

// EXERCISE 4.1 — Implement two mixin functions:
// `Timestamped(Base)` — adds `createdAt` property (set to Date.now() in constructor)
// `Activatable(Base)` — adds `isActive` property (starts true) and:
//     activate() / deactivate() methods

const Timestamped = (Base) => class extends Base {
  // YOUR CODE HERE
};

const Activatable = (Base) => class extends Base {
  // YOUR CODE HERE
};

class BaseModel {
  constructor(data) {
    Object.assign(this, data);
  }
}

class UserModel extends Timestamped(Activatable(BaseModel)) {}

const u = new UserModel({ name: "Swastik", role: "admin" });
console.log("has createdAt:", typeof u.createdAt === "number"); // true
assert(u.isActive, true, "starts active");
u.deactivate();
assert(u.isActive, false, "deactivated");
u.activate();
assert(u.isActive, true, "re-activated");
assert(u.name, "Swastik", "name preserved");

console.log("=== Section 4 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: MINI CHALLENGE — DESIGN A CLASS SYSTEM
// ════════════════════════════════════════════════════════════════════════════

// CHALLENGE: Build an event emitter (pub/sub system) — a classic interview question.
//
// Build a class `EventEmitter` with:
//   on(event, listener)      — register a listener for an event
//   off(event, listener)     — remove a specific listener
//   emit(event, ...args)     — call all listeners for that event with args
//   once(event, listener)    — register a listener that fires ONLY ONCE then removes itself

class EventEmitter {
  // YOUR CODE HERE
}

const emitter = new EventEmitter();

const handler = (msg) => console.log("Received:", msg);
emitter.on("message", handler);

let onceCount = 0;
emitter.once("connect", () => {
  onceCount++;
  console.log("Connected! (should only fire once)");
});

emitter.emit("message", "Hello");      // "Received: Hello"
emitter.emit("message", "World");      // "Received: World"
emitter.emit("connect");               // "Connected!"
emitter.emit("connect");               // should NOT fire again

assert(onceCount, 1, "once fires exactly once");

emitter.off("message", handler);
emitter.emit("message", "Nobody");    // should NOT log (listener removed)
console.log("✓ Listener removed");

console.log("=== Sheet 5 complete! Move on to js_06_async.js ===\n");
