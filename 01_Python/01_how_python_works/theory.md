# Module 01: How Python Actually Works

## The Big Question
When you type `python script.py` and hit enter — what actually happens?

Most people say "Python runs my code." That's like saying "a car drives." Let's pop the hood.

---

## 1. Python is NOT an Interpreter (Not Exactly)

**Common misconception**: "Python reads your code line by line and executes it."

**Reality**: Python has TWO phases:

### Phase 1: Compilation (yes, compilation!)
Your `.py` source code is compiled into **bytecode** — a lower-level set of instructions.
This bytecode is stored in `.pyc` files (inside `__pycache__/`).

### Phase 2: Execution
The **Python Virtual Machine (PVM)** — a software-based CPU — reads and executes the bytecode.

```
Source Code (.py)
       │
       ▼
   [Compiler]  ──→  Bytecode (.pyc)
                          │
                          ▼
                   [Python VM (PVM)]
                          │
                          ▼
                      Output
```

### Why does this matter?
- **SyntaxErrors** happen in Phase 1 (compilation), BEFORE any code runs
- **NameErrors, TypeErrors** happen in Phase 2 (runtime)
- This is why a SyntaxError on line 50 stops line 1 from executing

---

## 2. What is Bytecode?

Bytecode is an intermediate representation. It's not machine code (your CPU can't run it directly), but it's not your source code either.

You can actually SEE the bytecode:

```python
import dis

def add(a, b):
    return a + b

dis.dis(add)
```

This will output something like:
```
  2           0 LOAD_FAST                0 (a)
              2 LOAD_FAST                1 (b)
              4 BINARY_ADD
              6 RETURN_VALUE
```

### Breaking it down:
- `LOAD_FAST 0` — Push the first local variable (a) onto the stack
- `LOAD_FAST 1` — Push the second local variable (b) onto the stack
- `BINARY_ADD` — Pop two values, add them, push result
- `RETURN_VALUE` — Return the top of the stack

**Key insight**: Python uses a **stack-based virtual machine**. Operations push and pop values from an internal stack.

---

## 3. CPython vs Python

"Python" is a **language specification** — a set of rules.
"CPython" is the **most common implementation** of those rules — written in C.

Other implementations exist:
| Implementation | Written In | Why It Exists |
|----------------|-----------|---------------|
| CPython | C | The "default" Python. Reference implementation. |
| PyPy | Python (RPython) | JIT compilation → much faster for loops |
| Jython | Java | Runs on JVM, interop with Java |
| MicroPython | C | Runs on microcontrollers (IoT) |
| GraalPy | Java | Part of GraalVM polyglot platform |

### Why does this matter for interviews?
When someone asks about the GIL, memory management, or performance — the answer depends on the **implementation**. The GIL is a CPython thing. PyPy has a GIL too, but its JIT makes it faster despite that.

---

## 4. Everything is an Object

This is THE fundamental truth of Python. Everything. Is. An. Object.

```python
x = 42
```

What happened here?
1. Python created an **integer object** in memory with value 42
2. Python created a **name** `x` that **points to** (references) that object

`x` is NOT a box containing 42. `x` is a **label stuck on** the object 42.

```python
x = 42
y = x      # y now also points to the SAME object 42
```

You can verify:
```python
x = 42
y = x
print(id(x))  # memory address of the object
print(id(y))  # SAME memory address!
print(x is y) # True — they're the same object
```

### The `id()` function
- Returns the memory address (identity) of an object
- `is` checks if two names point to the same object (same `id`)
- `==` checks if two objects have the same **value**

```python
a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)  # True — same value
print(a is b)  # False — different objects in memory
```

---

## 5. Dynamic Typing — What It Really Means

In C/Java: variables have types. `int x = 5;` means "x is an integer box."
In Python: **names don't have types. Objects do.**

```python
x = 42        # x points to an int object
x = "hello"   # now x points to a str object
x = [1, 2]    # now x points to a list object
```

The name `x` didn't "change type." It just started pointing at a different object.

### Type checking happens at RUNTIME
```python
def add(a, b):
    return a + b

add(1, 2)       # Works: 3
add("hi", " ")  # Works: "hi "
add(1, "hi")    # TypeError — but only when this line actually RUNS
```

Python doesn't check types until it has to execute the operation. This is called **duck typing**: "If it walks like a duck and quacks like a duck, it's a duck."

---

## 6. The Execution Model: Namespaces and Scopes

When Python executes code, it organizes names into **namespaces** — dictionaries mapping names to objects.

### Four Namespaces (LEGB Rule):
```
Local      → Inside the current function
Enclosing  → Inside enclosing functions (closures)  
Global     → Module-level names
Built-in   → Python's built-in names (print, len, etc.)
```

When you use a name, Python searches in this order: L → E → G → B

```python
x = "global"

def outer():
    x = "enclosing"
    
    def inner():
        x = "local"
        print(x)  # "local" — found in Local
    
    inner()

outer()
```

### You can inspect namespaces:
```python
print(dir())          # Names in current scope
print(globals())      # Global namespace (dict)
print(locals())       # Local namespace (dict)
```

---

## 7. What Happens on Import?

```python
import math
```

This is NOT just "loading a library." Here's what actually happens:

1. Python searches for `math` in `sys.modules` (cache of already-imported modules)
2. If not found, it searches `sys.path` (list of directories)
3. It finds the module file
4. It **compiles** the module to bytecode (if not cached)
5. It **executes** the module's bytecode (top-level code runs!)
6. It creates a **module object** and stores it in `sys.modules`
7. It binds the name `math` to that module object in your namespace

### Key insight: importing EXECUTES the module
```python
# mymodule.py
print("I'm being imported!")  # This WILL print when someone imports this module

def foo():
    return 42
```

This is why `if __name__ == "__main__":` exists — to separate "code that defines things" from "code that should only run when this file is the main script."

```python
# mymodule.py
def foo():
    return 42

if __name__ == "__main__":
    # This only runs if you do: python mymodule.py
    # It does NOT run if someone does: import mymodule
    print(foo())
```

### `__name__` explained:
- When you run `python mymodule.py`: `__name__` is set to `"__main__"`
- When someone does `import mymodule`: `__name__` is set to `"mymodule"`

---

## 8. Memory Management: Reference Counting + Garbage Collection

### Reference Counting
Every object has a **reference count** — how many names/containers point to it.

```python
import sys

a = [1, 2, 3]       # refcount = 1
b = a                # refcount = 2
c = [a, a]           # refcount = 4 (list holds 2 refs)

print(sys.getrefcount(a))  # Shows refcount (+1 for the getrefcount argument itself)

del b                # refcount drops by 1
c.pop()              # refcount drops by 1
```

When refcount hits 0 → object is **immediately** deallocated.

### The Problem: Circular References
```python
a = []
b = []
a.append(b)  # a → b
b.append(a)  # b → a

del a
del b
# Both objects have refcount 1 (they reference each other)
# Reference counting alone can't free them!
```

### The Solution: Garbage Collector
Python has a **generational garbage collector** that periodically finds and cleans up circular references.

```python
import gc
gc.collect()  # Manually trigger garbage collection
```

---

## Summary: Mental Model

```
You write .py code
       ↓
Compiler turns it into bytecode (.pyc)
       ↓
PVM executes bytecode
       ↓
Everything is an object in memory
       ↓
Names are labels pointing to objects
       ↓
Namespaces organize names (LEGB)
       ↓
Reference counting + GC manage memory
```

**The single most important takeaway**: In Python, variables are NOT boxes. They are **name tags attached to objects**. This mental model will save you from 90% of Python confusion.
