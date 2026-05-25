# Module 03: Functions Deep Dive

## The Big Question
Functions are "just objects" in Python — what does that actually mean, and why does it matter?

---

## 1. Functions Are First-Class Objects

In Python, a function is an object of type `function`. This means you can:

```python
def greet(name):
    return f"Hello, {name}!"

# 1. Assign to a variable
say_hi = greet
print(say_hi("Alice"))    # "Hello, Alice!"

# 2. Store in a data structure
funcs = [greet, len, print]
funcs[0]("Bob")           # "Hello, Bob!"

# 3. Pass as an argument
def apply(func, value):
    return func(value)

apply(greet, "Charlie")   # "Hello, Charlie!"

# 4. Return from another function
def make_greeter(greeting):
    def greeter(name):
        return f"{greeting}, {name}!"
    return greeter

hi = make_greeter("Hi")
hi("Dave")                # "Hi, Dave!"
```

### Why does this matter?
This is the foundation of:
- **Decorators** — functions that take and return functions
- **Callbacks** — passing functions to be called later
- **Strategy pattern** — swapping behavior by swapping functions
- **Functional programming** — map, filter, reduce

---

## 2. Function Internals: What's Inside a Function Object?

Every function object has attributes you can inspect:

```python
def add(a, b=10):
    """Add two numbers."""
    return a + b

print(add.__name__)         # 'add'
print(add.__doc__)          # 'Add two numbers.'
print(add.__defaults__)     # (10,) — default argument values
print(add.__code__)         # The code object
print(add.__code__.co_varnames)  # ('a', 'b') — local variable names
print(add.__code__.co_consts)    # (None, 'Add two numbers.')
```

The `__code__` object contains the compiled bytecode. The function object is a wrapper around it that adds:
- The name
- Default arguments
- The global namespace it was defined in (`__globals__`)
- Closure variables (`__closure__`)

---

## 3. Arguments: The Complete Picture

### Positional and Keyword Arguments

```python
def func(a, b, c):
    print(a, b, c)

func(1, 2, 3)          # All positional
func(a=1, b=2, c=3)    # All keyword
func(1, c=3, b=2)      # Mix (positional must come first)
```

### Default Arguments

```python
def func(a, b=10, c=20):
    print(a, b, c)

func(1)            # 1 10 20
func(1, 2)         # 1 2 20
func(1, c=30)      # 1 10 30
```

**Critical rule**: Default values are evaluated ONCE at function definition time.

### `*args` — Variable Positional Arguments

```python
def func(*args):
    print(type(args))   # <class 'tuple'>
    print(args)

func(1, 2, 3)          # (1, 2, 3)
func()                  # ()
```

`*args` collects extra positional arguments into a **tuple**.

### `**kwargs` — Variable Keyword Arguments

```python
def func(**kwargs):
    print(type(kwargs))  # <class 'dict'>
    print(kwargs)

func(name="Alice", age=30)  # {'name': 'Alice', 'age': 30}
```

`**kwargs` collects extra keyword arguments into a **dict**.

### The Full Signature Order

```python
def func(pos_only, /, normal, *, kw_only, **kwargs):
    pass
```

Order: `positional-only` → `/` → `normal` → `*args` → `keyword-only` → `**kwargs`

```python
def example(a, b, /, c, d, *args, e, f, **kwargs):
    """
    a, b     — positional only (before /)
    c, d     — normal (positional or keyword)
    *args    — extra positional
    e, f     — keyword only (after *)
    **kwargs — extra keyword
    """
    pass

example(1, 2, 3, 4, 5, 6, e=7, f=8, g=9)
# a=1, b=2 (positional only)
# c=3, d=4 (normal)
# args=(5, 6) (extra positional)
# e=7, f=8 (keyword only)
# kwargs={'g': 9} (extra keyword)
```

### Unpacking Arguments

```python
def add(a, b, c):
    return a + b + c

args = [1, 2, 3]
add(*args)          # Unpacks list into positional args: add(1, 2, 3)

kwargs = {"a": 1, "b": 2, "c": 3}
add(**kwargs)       # Unpacks dict into keyword args: add(a=1, b=2, c=3)
```

---

## 4. Scope and the LEGB Rule (Deeper)

We introduced LEGB in Module 01. Now let's go deeper.

### The `global` keyword
```python
x = 10

def change_global():
    global x    # Tells Python: x refers to the global, not a local
    x = 20

change_global()
print(x)        # 20
```

Without `global`, the assignment `x = 20` would create a LOCAL variable.

### The `nonlocal` keyword
```python
def outer():
    x = 10
    
    def inner():
        nonlocal x  # Refers to x in the enclosing scope
        x = 20
    
    inner()
    print(x)    # 20

outer()
```

Without `nonlocal`, `x = 20` in inner() would create a new local variable.

### The UnboundLocalError Trap
```python
x = 10

def broken():
    print(x)    # Tries to read x
    x = 20      # But this makes x local for the ENTIRE function!

# broken()  # UnboundLocalError: local variable 'x' referenced before assignment
```

**Why?** Python's compiler scans the entire function body. If it sees ANY assignment to `x` in the function, `x` is treated as local for the entire function — even lines before the assignment.

---

## 5. Closures

A closure is a function that "remembers" variables from its enclosing scope, even after that scope has finished executing.

```python
def make_counter():
    count = 0
    
    def increment():
        nonlocal count
        count += 1
        return count
    
    return increment

counter = make_counter()
print(counter())  # 1
print(counter())  # 2
print(counter())  # 3
```

`make_counter()` has finished executing. Its local variable `count` should be dead. But the inner function `increment` holds a reference to it through a **closure**.

### How closures work internally:
```python
counter = make_counter()
print(counter.__closure__)              # Tuple of cell objects
print(counter.__closure__[0].cell_contents)  # Current value of count
```

### The Late Binding Trap:
```python
funcs = []
for i in range(3):
    funcs.append(lambda: i)

print(funcs[0]())  # 2 — NOT 0!
print(funcs[1]())  # 2 — NOT 1!
print(funcs[2]())  # 2

# WHY: The lambda captures the VARIABLE i, not its VALUE.
# By the time funcs[0]() is called, the loop is done and i = 2.
```

### The Fix:
```python
funcs = []
for i in range(3):
    funcs.append(lambda i=i: i)  # Default arg captures current value

print(funcs[0]())  # 0
print(funcs[1]())  # 1
print(funcs[2]())  # 2
```

---

## 6. Decorators

A decorator is a function that takes a function and returns a modified version of it.

### The basic pattern:
```python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        result = func(*args, **kwargs)
        print(f"Done calling {func.__name__}")
        return result
    return wrapper

@my_decorator
def say_hello(name):
    print(f"Hello, {name}!")

say_hello("Alice")
# Output:
# Calling say_hello
# Hello, Alice!
# Done calling say_hello
```

`@my_decorator` is syntactic sugar for: `say_hello = my_decorator(say_hello)`

### The `functools.wraps` Problem

```python
@my_decorator
def say_hello(name):
    """Greet someone."""
    print(f"Hello, {name}!")

print(say_hello.__name__)  # 'wrapper' — WRONG! Should be 'say_hello'
print(say_hello.__doc__)   # None — WRONG! Should be 'Greet someone.'
```

Fix with `functools.wraps`:
```python
import functools

def my_decorator(func):
    @functools.wraps(func)  # Preserves the original function's metadata
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result
    return wrapper
```

### Decorators with Arguments:
```python
def repeat(n):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(n):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def say_hi():
    print("Hi!")

say_hi()  # Prints "Hi!" three times
```

This is three levels of nesting:
1. `repeat(3)` — returns the decorator
2. The decorator — takes the function, returns wrapper
3. `wrapper` — the actual replacement function

### Class-based Decorators:
```python
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.count = 0
    
    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"Call #{self.count}")
        return self.func(*args, **kwargs)

@CountCalls
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")  # Call #1 \n Hello, Alice!
greet("Bob")    # Call #2 \n Hello, Bob!
```

---

## 7. Lambda Functions

Lambdas are anonymous, single-expression functions:

```python
square = lambda x: x ** 2
add = lambda a, b: a + b

# Equivalent to:
def square(x):
    return x ** 2
```

### When to use lambdas:
- Short, throwaway functions (especially with `map`, `filter`, `sorted`)
- When a full `def` would be overkill

```python
pairs = [(1, 'b'), (2, 'a'), (3, 'c')]
sorted(pairs, key=lambda pair: pair[1])  # Sort by second element
```

### When NOT to use lambdas:
- Complex logic (use `def`)
- When you need a docstring
- When the lambda needs a name (just use `def`!)

---

## 8. Higher-Order Functions

Functions that take or return other functions.

### Built-in higher-order functions:

```python
# map — apply function to every element
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))  # [1, 4, 9, 16, 25]

# filter — keep elements where function returns True
evens = list(filter(lambda x: x % 2 == 0, numbers))  # [2, 4]

# sorted — custom sort key
words = ["banana", "apple", "cherry"]
sorted(words, key=len)  # ['apple', 'banana', 'cherry']
```

### Pythonic alternative: Use comprehensions instead of map/filter
```python
# Instead of map:
squared = [x**2 for x in numbers]

# Instead of filter:
evens = [x for x in numbers if x % 2 == 0]
```

Comprehensions are generally preferred in Python — more readable, often faster.

---

## Summary: Mental Model

```
Functions are objects → can be passed around, returned, stored
Arguments: positional → *args → keyword-only → **kwargs
LEGB: Local → Enclosing → Global → Built-in
Closures: inner functions that capture enclosing variables
Decorators: functions that wrap other functions
Lambda: anonymous single-expression functions
Higher-order: functions that take/return functions
```

**Interview one-liner**: "In Python, functions are first-class objects. This enables closures (functions that capture their enclosing scope), decorators (functions that transform other functions), and higher-order programming. The key subtleties are late binding in closures, the LEGB scope resolution, and always using `functools.wraps` in decorators to preserve metadata."
