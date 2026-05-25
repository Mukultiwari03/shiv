"""
Module 01: How Python Actually Works — Challenges
===================================================

These are harder problems that test whether you truly understood the theory.
Try to solve them WITHOUT looking at the theory file.
If you get stuck, re-read the relevant section, then try again.

Run: python challenges.py
"""


# ============================================================
# CHALLENGE 1: The Bytecode Detective
# ============================================================
"""
WITHOUT running dis.dis(), predict the bytecode for this function.
Write your prediction as comments, then verify with dis.

Hint: Think about what operations are needed and what the stack looks like
at each step.
"""
import dis

def square_and_add(x, y):
    return x * x + y

# YOUR PREDICTION:
# (write the bytecode operations you expect here)
#
#
#
#

# Now verify:
print("--- Challenge 1: Bytecode ---")
dis.dis(square_and_add)


# ============================================================
# CHALLENGE 2: The Aliasing Trap
# ============================================================
"""
Predict the output of EACH print statement.
Write your predictions as comments BEFORE running.
"""

print("\n--- Challenge 2: Aliasing ---")

def append_to(element, target=[]):
    target.append(element)
    return target

result1 = append_to(1)
print(f"result1: {result1}")  # YOUR PREDICTION: ???

result2 = append_to(2)
print(f"result2: {result2}")  # YOUR PREDICTION: ???

result3 = append_to(3, [])
print(f"result3: {result3}")  # YOUR PREDICTION: ???

result4 = append_to(4)
print(f"result4: {result4}")  # YOUR PREDICTION: ???

# EXPLAIN: Why does this happen?
# HINT: When are default argument values created?
# HINT: How many list objects are the default [] here?


# ============================================================
# CHALLENGE 3: The Identity Crisis
# ============================================================
"""
Predict True or False for each.
"""

print("\n--- Challenge 3: Identity ---")

# Part A
a = "hello"
b = "hello"
print(f"a is b: {a is b}")  # PREDICTION: ???
# Why? (Think about string interning)

# Part B
a = "hello world!"
b = "hello world!"
print(f"a is b: {a is b}")  # PREDICTION: ???
# Why? (What's different about this string?)

# Part C
a = (1, 2, 3)
b = (1, 2, 3)
print(f"a is b: {a is b}")  # PREDICTION: ???

# Part D
a = 1000
b = 10 ** 3
print(f"a is b: {a is b}")  # PREDICTION: ???

# NOTE: These are ALL CPython implementation details.
# The lesson: NEVER use `is` for value comparison. Use `==`.


# ============================================================
# CHALLENGE 4: The Namespace Puzzle
# ============================================================
"""
Predict the output. This is a CLASSIC interview question.
"""

print("\n--- Challenge 4: Namespace Puzzle ---")

x = 10

def foo():
    print(x)  # What happens here?
    x = 20

# Uncomment the next line and predict what happens:
# foo()

# EXPLAIN: Why does this raise an error even though x = 10 exists globally?
# HINT: Python's compiler scans the entire function body before execution.
# If it sees an assignment to x anywhere in the function, x is local
# for the ENTIRE function, even before the assignment line.


# ============================================================
# CHALLENGE 5: The Circular Import
# ============================================================
"""
This challenge is conceptual. Don't run it — think through it.

Imagine you have two files:

--- module_a.py ---
import module_b
x = 10
def func_a():
    return module_b.y

--- module_b.py ---
import module_a
y = 20
def func_b():
    return module_a.x

QUESTION: If you run `python module_a.py`, what happens?
Walk through the import process step by step:

1. Python starts executing module_a.py
2. It hits `import module_b` — what happens next?
3. It starts executing module_b.py
4. module_b.py hits `import module_a` — but module_a is already in
   sys.modules (partially loaded). What does it get?
5. Does module_b.py see `x = 10` from module_a? Why or why not?

This is why circular imports are dangerous and how they can cause
AttributeError at runtime.
"""


# ============================================================
# CHALLENGE 6: Build Your Own type()
# ============================================================
"""
Using ONLY id() and __class__, write a function that behaves like type().
This tests your understanding that type info is stored ON the object.
"""

print("\n--- Challenge 6: Custom type() ---")

def my_type(obj):
    """Return the type of obj without using type() or isinstance()."""
    # YOUR CODE HERE
    # HINT: Every object has a __class__ attribute
    pass

# Test it:
print(my_type(42))          # Should show: <class 'int'>
print(my_type("hello"))     # Should show: <class 'str'>
print(my_type([1, 2]))      # Should show: <class 'list'>
print(my_type(my_type))     # Should show: <class 'function'>


# ============================================================
# CHALLENGE 7: Memory Detective
# ============================================================
"""
Without running the code, determine: at the end, how many list objects
exist in memory? (Ignore Python internals, only count OUR lists)
"""

print("\n--- Challenge 7: Memory Detective ---")

import sys

a = [1, 2, 3]          # List 1 created
b = a                   # b points to List 1
c = [1, 2, 3]          # List 2 created
d = list(a)            # List 3 created (list() always creates a new list)
a = [4, 5, 6]          # List 4 created, a now points to List 4
del b                   # Name b removed — but List 1?

# QUESTION: How many list objects exist right now?
# For each list, who points to it?
# Is List 1 still alive? Why or why not?

# YOUR ANSWER:
#
#
#

# Verify by checking ids:
# (After writing your answer, uncomment and modify this to check)
# print(f"id(a) = {id(a)}")
# print(f"id(c) = {id(c)}")
# print(f"id(d) = {id(d)}")


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("Challenges complete! Review your predictions vs actual output.")
    print("Any surprises? Go back to theory.md for that topic.")
    print("=" * 60)
