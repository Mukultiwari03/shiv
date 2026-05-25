"""
Module 01: How Python Actually Works — Exercises
=================================================

RULES:
1. Read each exercise carefully
2. PREDICT the output BEFORE running
3. Type the code yourself (no copy-paste)
4. If your prediction was wrong — STOP and understand why

Run this file: python exercises.py
Or run individual sections by commenting/uncommenting.
"""

# ============================================================
# EXERCISE 1: Compilation vs Execution
# ============================================================
# PREDICT: Will line "Hello" print? Why or why not?

print("Hello")
# print("World"          # <- Uncomment this line and predict what happens

# ANSWER (think first!):
# The SyntaxError on the uncommented line would prevent "Hello" from printing.
# Why? Because compilation (Phase 1) happens BEFORE execution (Phase 2).
# The entire file is compiled first. A SyntaxError stops compilation entirely.


# ============================================================
# EXERCISE 2: Seeing Bytecode
# ============================================================
import dis

def multiply(a, b):
    return a * b

print("\n--- Bytecode for multiply() ---")
dis.dis(multiply)

# QUESTION: How many LOAD_FAST operations do you see? Why?
# QUESTION: What does BINARY_MULTIPLY do with the stack?


# ============================================================
# EXERCISE 3: Everything is an Object
# ============================================================
print("\n--- Everything is an Object ---")

# Numbers are objects
print(type(42))          # <class 'int'>
print(type(3.14))        # <class 'float'>

# Strings are objects
print(type("hello"))     # <class 'str'>

# Functions are objects!
print(type(multiply))    # <class 'function'>

# Even types are objects!
print(type(int))         # <class 'type'>
print(type(type))        # <class 'type'> — type is an instance of itself!

# QUESTION: What does it mean for functions to be objects?
# HINT: It means you can pass them around, store them in lists, etc.
my_func = multiply       # Assigning a function to a name
print(my_func(3, 4))     # 12 — calling it through the new name


# ============================================================
# EXERCISE 4: Names are Labels, Not Boxes
# ============================================================
print("\n--- Names are Labels ---")

a = [1, 2, 3]
b = a

b.append(4)
print(a)  # PREDICT: What does this print?

# Now try this:
x = 10
y = x
y = 20
print(x)  # PREDICT: What does this print?

# QUESTION: Why does modifying b affect a, but modifying y does NOT affect x?
# HINT: Think about what .append() does vs what = does.
# .append() MUTATES the object that b points to (same object a points to)
# y = 20 makes y point to a NEW object. It doesn't change the object 10.


# ============================================================
# EXERCISE 5: id() and `is` vs `==`
# ============================================================
print("\n--- Identity vs Equality ---")

a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(f"a == b: {a == b}")   # PREDICT
print(f"a is b: {a is b}")   # PREDICT
print(f"a is c: {a is c}")   # PREDICT

print(f"id(a): {id(a)}")
print(f"id(b): {id(b)}")
print(f"id(c): {id(c)}")

# Now try with small integers (CPython caches -5 to 256):
x = 256
y = 256
print(f"\nx is y (256): {x is y}")   # PREDICT

x = 257
y = 257
print(f"x is y (257): {x is y}")     # PREDICT — this might surprise you!

# NOTE: Small integer caching is a CPython implementation detail.
# NEVER rely on `is` for value comparison. Always use `==`.


# ============================================================
# EXERCISE 6: Namespaces and LEGB
# ============================================================
print("\n--- LEGB Rule ---")

x = "I am global"

def outer():
    x = "I am enclosing"
    
    def inner():
        x = "I am local"  # <- Try uncommenting this
        print(x)
    
    inner()

outer()
print(x)  # PREDICT: What does this print?

# EXERCISE: Uncomment the local x. What changes? Why?

# Now examine namespaces:
print(f"\n'print' in dir(__builtins__): {'print' in dir(__builtins__)}")


# ============================================================
# EXERCISE 7: Import Mechanics
# ============================================================
print("\n--- Import Mechanics ---")

import sys

# See where Python searches for modules:
print("sys.path:")
for p in sys.path[:5]:  # First 5 entries
    print(f"  {p}")

# See cached modules:
print(f"\nNumber of cached modules: {len(sys.modules)}")
print(f"'os' in sys.modules: {'os' in sys.modules}")  # Before importing os

import os
print(f"'os' in sys.modules after import: {'os' in sys.modules}")

# Import the same module again — does it re-execute?
# No! Python checks sys.modules first (it's cached).


# ============================================================
# EXERCISE 8: Reference Counting
# ============================================================
print("\n--- Reference Counting ---")

a = [1, 2, 3]
print(f"refcount after creation: {sys.getrefcount(a)}")
# NOTE: getrefcount returns count + 1 (the argument itself is a reference)

b = a
print(f"refcount after b = a: {sys.getrefcount(a)}")

c = [a, a, a]
print(f"refcount after c = [a, a, a]: {sys.getrefcount(a)}")

del b
print(f"refcount after del b: {sys.getrefcount(a)}")

# QUESTION: What would the refcount be if we did del c? 
# (Don't just guess — think about what del c does to the list and its contents)


# ============================================================
# EXERCISE 9: __name__ and __main__
# ============================================================
print(f"\n--- __name__ = '{__name__}' ---")

# When you run this file directly: __name__ == "__main__"
# If someone imported this file: __name__ == "exercises"

if __name__ == "__main__":
    print("This file is being run directly!")
    print("All exercises completed. Review any predictions you got wrong.")
