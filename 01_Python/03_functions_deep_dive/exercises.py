"""
Module 03: Functions Deep Dive — Exercises
===========================================

RULES: Predict → Type → Run → Understand surprises
"""

# ============================================================
# EXERCISE 1: Functions Are Objects
# ============================================================
print("--- Exercise 1: Functions Are Objects ---")

def greet(name):
    """Say hello."""
    return f"Hello, {name}!"

# Functions have attributes:
print(f"Name: {greet.__name__}")
print(f"Doc: {greet.__doc__}")
print(f"Type: {type(greet)}")

# Assign to a variable:
f = greet
print(f("Alice"))       # PREDICT:
print(f is greet)       # PREDICT:

# Store in a list:
funcs = [len, str.upper, greet]
print(funcs[2]("Bob"))  # PREDICT:


# ============================================================
# EXERCISE 2: *args and **kwargs
# ============================================================
print("\n--- Exercise 2: *args and **kwargs ---")

def show_args(*args, **kwargs):
    print(f"  args = {args}")
    print(f"  kwargs = {kwargs}")

show_args(1, 2, 3)
# PREDICT args and kwargs

show_args(1, name="Alice", age=30)
# PREDICT args and kwargs

show_args()
# PREDICT args and kwargs


# ============================================================
# EXERCISE 3: Argument Unpacking
# ============================================================
print("\n--- Exercise 3: Unpacking ---")

def add(a, b, c):
    return a + b + c

numbers = [10, 20, 30]
print(add(*numbers))         # PREDICT:

config = {"a": 1, "b": 2, "c": 3}
print(add(**config))         # PREDICT:

# Mix:
print(add(100, **{"b": 200, "c": 300}))  # PREDICT:


# ============================================================
# EXERCISE 4: Positional-Only and Keyword-Only
# ============================================================
print("\n--- Exercise 4: Positional/Keyword Only ---")

def func(a, b, /, c, *, d):
    print(f"  a={a}, b={b}, c={c}, d={d}")

func(1, 2, 3, d=4)       # Works
func(1, 2, c=3, d=4)     # Works

# Uncomment each to see what error you get:
# func(a=1, b=2, c=3, d=4)    # PREDICT the error:
# func(1, 2, 3, 4)             # PREDICT the error:


# ============================================================
# EXERCISE 5: LEGB Scope Resolution
# ============================================================
print("\n--- Exercise 5: LEGB ---")

x = "global"

def outer():
    x = "enclosing"
    
    def inner():
        print(f"  inner sees: {x}")  # PREDICT:
    
    inner()
    print(f"  outer sees: {x}")      # PREDICT:

outer()
print(f"global sees: {x}")          # PREDICT:


# ============================================================
# EXERCISE 6: global and nonlocal
# ============================================================
print("\n--- Exercise 6: global and nonlocal ---")

count = 0

def increment_global():
    global count
    count += 1

increment_global()
increment_global()
print(f"count = {count}")  # PREDICT:

def outer():
    value = 10
    
    def inner():
        nonlocal value
        value += 5
    
    inner()
    inner()
    return value

print(f"outer() = {outer()}")  # PREDICT:


# ============================================================
# EXERCISE 7: Closures
# ============================================================
print("\n--- Exercise 7: Closures ---")

def make_multiplier(factor):
    def multiply(x):
        return x * factor
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)

print(f"double(5) = {double(5)}")    # PREDICT:
print(f"triple(5) = {triple(5)}")    # PREDICT:

# Inspect the closure:
print(f"double's closure: {double.__closure__[0].cell_contents}")  # PREDICT:
print(f"triple's closure: {triple.__closure__[0].cell_contents}")  # PREDICT:


# ============================================================
# EXERCISE 8: The Late Binding Trap
# ============================================================
print("\n--- Exercise 8: Late Binding ---")

# The bug:
funcs = []
for i in range(4):
    funcs.append(lambda: i)

print(f"Buggy: {[f() for f in funcs]}")  # PREDICT:

# The fix:
funcs_fixed = []
for i in range(4):
    funcs_fixed.append(lambda i=i: i)

print(f"Fixed: {[f() for f in funcs_fixed]}")  # PREDICT:


# ============================================================
# EXERCISE 9: Basic Decorator
# ============================================================
print("\n--- Exercise 9: Decorator ---")

def shout(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.upper()
    return wrapper

@shout
def greet(name):
    return f"hello, {name}"

print(greet("Alice"))          # PREDICT:
print(greet.__name__)          # PREDICT: (is it 'greet' or 'wrapper'?)


# ============================================================
# EXERCISE 10: Decorator with functools.wraps
# ============================================================
print("\n--- Exercise 10: functools.wraps ---")

import functools

def shout_v2(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.upper()
    return wrapper

@shout_v2
def greet_v2(name):
    """Greet someone politely."""
    return f"hello, {name}"

print(greet_v2("Bob"))         # PREDICT:
print(greet_v2.__name__)       # PREDICT:
print(greet_v2.__doc__)        # PREDICT:


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("Review: closures, late binding, and decorator metadata")
    print("are the three most common interview topics here.")
    print("=" * 60)
