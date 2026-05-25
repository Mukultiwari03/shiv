"""
Module 04: Iteration Protocol & Generators — Exercises
=======================================================

RULES: Predict → Type → Run → Understand surprises
"""

# ============================================================
# EXERCISE 1: Manual Iteration
# ============================================================
print("--- Exercise 1: Manual Iteration ---")

my_list = [10, 20, 30]

# Get the iterator:
it = iter(my_list)
print(type(it))  # PREDICT:

# Manually get values:
print(next(it))  # PREDICT:
print(next(it))  # PREDICT:
print(next(it))  # PREDICT:

# What happens now?
try:
    print(next(it))
except StopIteration:
    print("Iterator exhausted!")


# ============================================================
# EXERCISE 2: Iterables vs Iterators
# ============================================================
print("\n--- Exercise 2: Iterable vs Iterator ---")

nums = [1, 2, 3]

# Iterable — has __iter__?
print(f"list has __iter__: {hasattr(nums, '__iter__')}")      # PREDICT:
print(f"list has __next__: {hasattr(nums, '__next__')}")      # PREDICT:

# Iterator — has both?
it = iter(nums)
print(f"iterator has __iter__: {hasattr(it, '__iter__')}")    # PREDICT:
print(f"iterator has __next__: {hasattr(it, '__next__')}")    # PREDICT:

# iter() on an iterator returns itself:
print(f"iter(it) is it: {iter(it) is it}")                    # PREDICT:


# ============================================================
# EXERCISE 3: Strings Are Iterable
# ============================================================
print("\n--- Exercise 3: Strings ---")

s = "hello"
it = iter(s)

for char in it:
    print(char, end=" ")  # PREDICT:
print()

# Can we iterate again with the same iterator?
for char in it:
    print(char, end=" ")  # PREDICT: (anything?)
print("(empty — iterator exhausted)")


# ============================================================
# EXERCISE 4: Dict Iteration
# ============================================================
print("\n--- Exercise 4: Dict Iteration ---")

d = {"a": 1, "b": 2, "c": 3}

# Default iteration — what do you get?
for x in d:
    print(x, end=" ")  # PREDICT: keys? values? both?
print()

# Explicit:
for k, v in d.items():
    print(f"{k}={v}", end=" ")
print()


# ============================================================
# EXERCISE 5: Generator Function Basics
# ============================================================
print("\n--- Exercise 5: Generator Basics ---")

def simple_gen():
    print("  Before first yield")
    yield 1
    print("  Before second yield")
    yield 2
    print("  Before third yield")
    yield 3
    print("  After last yield")

# What does calling the function return?
g = simple_gen()
print(f"Type: {type(g)}")  # PREDICT:

# Now step through it:
print(f"First: {next(g)}")   # PREDICT what prints (both the print AND the value):
print(f"Second: {next(g)}")  # PREDICT:
print(f"Third: {next(g)}")   # PREDICT:

# What happens on the next next()?
try:
    next(g)
except StopIteration:
    print("Generator exhausted!")
    # QUESTION: Did "After last yield" print? When?


# ============================================================
# EXERCISE 6: Generator Expression vs List Comprehension
# ============================================================
print("\n--- Exercise 6: Gen Expr vs List Comp ---")

import sys

list_comp = [x**2 for x in range(1000)]
gen_expr = (x**2 for x in range(1000))

print(f"List size: {sys.getsizeof(list_comp)} bytes")   # Large
print(f"Generator size: {sys.getsizeof(gen_expr)} bytes")  # Small

# Can you index a generator?
print(f"list_comp[5] = {list_comp[5]}")

try:
    print(gen_expr[5])
except TypeError as e:
    print(f"gen_expr[5] → {e}")  # PREDICT the error:


# ============================================================
# EXERCISE 7: Generators Are Single-Use
# ============================================================
print("\n--- Exercise 7: Single-Use ---")

gen = (x for x in range(5))

first_pass = list(gen)
second_pass = list(gen)

print(f"First pass: {first_pass}")    # PREDICT:
print(f"Second pass: {second_pass}")  # PREDICT:


# ============================================================
# EXERCISE 8: yield from
# ============================================================
print("\n--- Exercise 8: yield from ---")

def flat_range(n):
    """Yield 0 to n-1 from multiple sub-ranges."""
    for start in range(0, n, 3):
        yield from range(start, min(start + 3, n))

print(list(flat_range(8)))  # PREDICT:

# Without yield from, this would be:
def flat_range_verbose(n):
    for start in range(0, n, 3):
        for x in range(start, min(start + 3, n)):
            yield x

print(list(flat_range_verbose(8)))  # Same result


# ============================================================
# EXERCISE 9: Generator send()
# ============================================================
print("\n--- Exercise 9: send() ---")

def echo():
    while True:
        received = yield
        print(f"  Received: {received}")

g = echo()
next(g)         # Initialize — run to first yield
g.send("hello")  # PREDICT what prints:
g.send(42)       # PREDICT:
g.close()


# ============================================================
# EXERCISE 10: Real-World — enumerate() is a generator
# ============================================================
print("\n--- Exercise 10: enumerate ---")

# enumerate() returns an iterator:
e = enumerate(["a", "b", "c"])
print(type(e))  # PREDICT:

print(next(e))  # PREDICT:
print(next(e))  # PREDICT:

# This is why enumerate is memory-efficient — it doesn't
# create a list of tuples, it generates them one at a time.


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("Key insight: generators produce values LAZILY.")
    print("They compute one value at a time, maintaining state.")
    print("=" * 60)
