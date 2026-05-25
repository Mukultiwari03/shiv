"""
Module 02: Objects, Names, and Memory — Exercises
===================================================

RULES:
1. PREDICT the output BEFORE running each exercise
2. Type the code yourself
3. If your prediction was wrong — STOP and understand why

Run: python exercises.py
"""

# ============================================================
# EXERCISE 1: Rebinding vs Mutating
# ============================================================
print("--- Exercise 1: Rebinding vs Mutating ---")

# Part A: Rebinding
x = [1, 2, 3]
y = x
x = [4, 5, 6]  # Rebinding x to a new object

print(f"x = {x}")  # PREDICT:
print(f"y = {y}")  # PREDICT:
print(f"x is y: {x is y}")  # PREDICT:

print()

# Part B: Mutating
a = [1, 2, 3]
b = a
a.append(4)     # Mutating the object

print(f"a = {a}")  # PREDICT:
print(f"b = {b}")  # PREDICT:
print(f"a is b: {a is b}")  # PREDICT:


# ============================================================
# EXERCISE 2: Immutable "Changes"
# ============================================================
print("\n--- Exercise 2: Immutable 'Changes' ---")

s1 = "hello"
s1_id = id(s1)
s1 = s1 + " world"
s1_new_id = id(s1)

print(f"Same object? {s1_id == s1_new_id}")  # PREDICT:
# WHY: String concatenation creates a NEW string object

n = 42
n_id = id(n)
n += 1
n_new_id = id(n)

print(f"Same object? {n_id == n_new_id}")  # PREDICT:
# WHY: Integers are immutable too. n += 1 creates a new int 43.


# ============================================================
# EXERCISE 3: Shallow Copy Behavior
# ============================================================
print("\n--- Exercise 3: Shallow Copy ---")

original = [1, [2, 3], [4, 5]]
shallow = original.copy()

# Modify a top-level element
shallow[0] = 99
print(f"original[0] = {original[0]}")  # PREDICT:
print(f"shallow[0] = {shallow[0]}")    # PREDICT:

# Modify a nested element
shallow[1].append(999)
print(f"original[1] = {original[1]}")  # PREDICT:
print(f"shallow[1] = {shallow[1]}")    # PREDICT:

# WHY: shallow copy creates new outer list, but inner lists are shared


# ============================================================
# EXERCISE 4: Deep Copy Behavior
# ============================================================
print("\n--- Exercise 4: Deep Copy ---")

import copy

original = [1, [2, 3], {"key": "value"}]
deep = copy.deepcopy(original)

deep[1].append(999)
deep[2]["key"] = "changed"

print(f"original[1] = {original[1]}")     # PREDICT:
print(f"deep[1] = {deep[1]}")             # PREDICT:
print(f"original[2] = {original[2]}")     # PREDICT:
print(f"deep[2] = {deep[2]}")             # PREDICT:


# ============================================================
# EXERCISE 5: Function Arguments
# ============================================================
print("\n--- Exercise 5: Function Arguments ---")

def modify(lst, num):
    lst.append(4)     # Mutates the list
    num = num + 10     # Rebinds num locally
    print(f"  Inside function: lst={lst}, num={num}")

my_list = [1, 2, 3]
my_num = 5
modify(my_list, my_num)

print(f"After function: my_list={my_list}")  # PREDICT:
print(f"After function: my_num={my_num}")    # PREDICT:


# ============================================================
# EXERCISE 6: The += Difference
# ============================================================
print("\n--- Exercise 6: The += Trap ---")

# With lists (mutable)
a = [1, 2]
b = a
a += [3, 4]
print(f"a = {a}")          # PREDICT:
print(f"b = {b}")          # PREDICT:
print(f"a is b: {a is b}") # PREDICT:

print()

# With tuples (immutable)
c = (1, 2)
d = c
c += (3, 4)
print(f"c = {c}")          # PREDICT:
print(f"d = {d}")          # PREDICT:
print(f"c is d: {c is d}") # PREDICT:


# ============================================================
# EXERCISE 7: Dictionary Copies
# ============================================================
print("\n--- Exercise 7: Dict Copies ---")

original = {"name": "Alice", "scores": [90, 85, 95]}
shallow = original.copy()

shallow["name"] = "Bob"          # Rebinds a key
shallow["scores"].append(100)    # Mutates the shared list

print(f"original = {original}")  # PREDICT:
print(f"shallow = {shallow}")    # PREDICT:


# ============================================================
# EXERCISE 8: Tuple Immutability
# ============================================================
print("\n--- Exercise 8: Tuple Immutability ---")

t = ([1, 2], "hello", [3, 4])

# Try these one at a time:
t[0].append(99)
print(f"t = {t}")  # PREDICT:

# Now try this (uncomment to test):
# t[0] = [5, 6]    # PREDICT what happens:


# ============================================================
# EXERCISE 9: Checking Your Understanding
# ============================================================
print("\n--- Exercise 9: Identity Checks ---")

import sys

a = [1, 2, 3]
b = a
c = a[:]        # Slice creates a shallow copy
d = list(a)     # Constructor creates a shallow copy

print(f"a is b: {a is b}")   # PREDICT:
print(f"a is c: {a is c}")   # PREDICT:
print(f"a is d: {a is d}")   # PREDICT:
print(f"c is d: {c is d}")   # PREDICT:
print(f"a == c: {a == c}")   # PREDICT:
print(f"c == d: {c == d}")   # PREDICT:


# ============================================================
# EXERCISE 10: Tracing References
# ============================================================
print("\n--- Exercise 10: Tracing References ---")

x = [1, 2, 3]
y = x
z = y

print(f"All same object: {x is y is z}")  # PREDICT:

y = y + [4]  # What does this do? (+ creates a NEW list!)

print(f"x = {x}")          # PREDICT:
print(f"y = {y}")          # PREDICT:
print(f"z = {z}")          # PREDICT:
print(f"x is z: {x is z}") # PREDICT:
print(f"x is y: {x is y}") # PREDICT:


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("Done! How many predictions did you get right?")
    print("Go back to theory.md for any you got wrong.")
    print("=" * 60)
