"""
Module 04: Iteration Protocol & Generators — Challenges
=========================================================

Build things. Don't look at theory until you're truly stuck.
"""

# ============================================================
# CHALLENGE 1: Build a Custom Range
# ============================================================
"""
Implement my_range(start, stop, step) that works like the built-in range().
It must be an ITERABLE (supports multiple iterations), not just an iterator.
"""
print("--- Challenge 1: Custom Range ---")

class MyRange:
    def __init__(self, start, stop=None, step=1):
        if stop is None:
            start, stop = 0, start
        self.start = start
        self.stop = stop
        self.step = step
    
    def __iter__(self):
        # YOUR CODE HERE
        # Return an iterator (can be a generator!)
        pass

# Test:
r = MyRange(1, 10, 2)
print(list(r))       # Should be: [1, 3, 5, 7, 9]
print(list(r))       # Should work again: [1, 3, 5, 7, 9]


# ============================================================
# CHALLENGE 2: Flatten Any Nested Structure
# ============================================================
"""
Write a generator that flattens arbitrarily nested lists.
"""
print("\n--- Challenge 2: Flatten ---")

def flatten(nested):
    """Yield all non-list items from a nested structure."""
    # YOUR CODE HERE
    # HINT: Use recursion with yield from
    pass

# Test:
data = [1, [2, [3, [4, 5]], 6], [7, 8], 9]
print(list(flatten(data)))  # [1, 2, 3, 4, 5, 6, 7, 8, 9]


# ============================================================
# CHALLENGE 3: Generator Pipeline
# ============================================================
"""
Build a data processing pipeline using generators.
Process a "CSV" without loading it all into memory.
"""
print("\n--- Challenge 3: Pipeline ---")

# Simulated CSV data:
csv_data = [
    "name,age,city",
    "Alice,30,NYC",
    "Bob,25,LA",
    "Charlie,35,Chicago",
    "Diana,28,NYC",
    "Eve,22,LA",
]

def parse_csv(lines):
    """Skip header, split each line by comma, yield as dict."""
    # YOUR CODE HERE
    pass

def filter_by_city(records, city):
    """Yield only records from the given city."""
    # YOUR CODE HERE
    pass

def extract_names(records):
    """Yield just the name from each record."""
    # YOUR CODE HERE
    pass

# Chain the pipeline:
# names_in_nyc = extract_names(filter_by_city(parse_csv(csv_data), "NYC"))
# print(list(names_in_nyc))  # Should be: ['Alice', 'Diana']


# ============================================================
# CHALLENGE 4: Fibonacci Generator
# ============================================================
"""
Write a generator for infinite Fibonacci sequence.
Then write a `take(n, iterable)` function to get the first N items.
"""
print("\n--- Challenge 4: Fibonacci ---")

def fibonacci():
    """Infinite Fibonacci generator."""
    # YOUR CODE HERE
    pass

def take(n, iterable):
    """Take first n items from any iterable."""
    # YOUR CODE HERE
    pass

# Test:
# print(list(take(10, fibonacci())))  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]


# ============================================================
# CHALLENGE 5: What Does This Print?
# ============================================================
"""
Predict the output carefully.
"""
print("\n--- Challenge 5: Prediction ---")

def gen():
    yield 1
    yield 2
    yield 3

g = gen()
print(1 in g)    # PREDICT:
print(2 in g)    # PREDICT: (think about what 'in' does to an iterator)
print(3 in g)    # PREDICT:
print(1 in g)    # PREDICT: (the generator is consumed!)

# WHY: 'in' iterates through the generator until it finds the value.
# After finding 1, the generator has advanced past it.
# When checking 2, it continues from where it left off.


# ============================================================
# CHALLENGE 6: Build itertools.chain
# ============================================================
"""
Implement your own version of itertools.chain.
"""
print("\n--- Challenge 6: Custom chain ---")

def my_chain(*iterables):
    """Yield items from each iterable in order."""
    # YOUR CODE HERE (use yield from!)
    pass

# Test:
# print(list(my_chain([1, 2], [3, 4], [5])))  # [1, 2, 3, 4, 5]
# print(list(my_chain("ab", "cd")))             # ['a', 'b', 'c', 'd']


# ============================================================
# CHALLENGE 7: Sliding Window Generator
# ============================================================
"""
Create a generator that yields sliding windows over a sequence.
This is a common interview question.
"""
print("\n--- Challenge 7: Sliding Window ---")

from collections import deque

def sliding_window(iterable, size):
    """Yield tuples of `size` consecutive elements."""
    # YOUR CODE HERE
    # HINT: Use a deque with maxlen=size
    pass

# Test:
# print(list(sliding_window([1,2,3,4,5], 3)))
# Should be: [(1,2,3), (2,3,4), (3,4,5)]

# print(list(sliding_window("hello", 2)))
# Should be: [('h','e'), ('e','l'), ('l','l'), ('l','o')]


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("The pipeline pattern (Challenge 3) and sliding window")
    print("(Challenge 7) are VERY common interview questions.")
    print("=" * 60)
