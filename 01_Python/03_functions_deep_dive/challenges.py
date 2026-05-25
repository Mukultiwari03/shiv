"""
Module 03: Functions Deep Dive — Challenges
=============================================

Try without looking at theory. These test real understanding.
"""
import functools

# ============================================================
# CHALLENGE 1: Build a Memoize Decorator
# ============================================================
"""
Write a decorator that caches function results.
If the function is called again with the same arguments, return the cached result.
"""
print("--- Challenge 1: Memoize ---")

def memoize(func):
    """Cache results of function calls."""
    # YOUR CODE HERE
    # HINT: Where do you store the cache?
    # HINT: args can be used as dict keys (they're tuples)
    pass

# Uncomment to test when implemented:
# @memoize
# def fibonacci(n):
#     if n < 2:
#         return n
#     return fibonacci(n-1) + fibonacci(n-2)
#
# print(fibonacci(10))  # 55
# print(fibonacci(10))  # 55 (from cache)

# BONUS: Python has this built in. What is it?
# ANSWER: functools.lru_cache


# ============================================================
# CHALLENGE 2: Build a Timer Decorator
# ============================================================
"""
Write a decorator that prints how long a function took to execute.
"""
print("\n--- Challenge 2: Timer ---")

import time

def timer(func):
    """Print execution time of function."""
    # YOUR CODE HERE
    pass


# ============================================================
# CHALLENGE 3: Decorator with Arguments
# ============================================================
"""
Write a decorator that retries a function up to N times if it raises an exception.
"""
print("\n--- Challenge 3: Retry Decorator ---")

def retry(max_attempts=3):
    """Retry a function up to max_attempts times on exception."""
    # YOUR CODE HERE
    # Remember: 3 levels of nesting!
    # retry(3) returns a decorator
    # the decorator takes func, returns wrapper
    # wrapper does the retry logic
    pass

# Uncomment to test:
# attempt_count = 0
# @retry(max_attempts=3)
# def flaky_function():
#     global attempt_count
#     attempt_count += 1
#     if attempt_count < 3:
#         raise ValueError(f"Attempt {attempt_count} failed!")
#     return "Success!"
#
# print(flaky_function())


# ============================================================
# CHALLENGE 4: Closure Counter
# ============================================================
"""
Create a function that returns two functions: increment and get_count.
They should share state through a closure.
"""
print("\n--- Challenge 4: Closure Counter ---")

def make_counter(start=0):
    """Return (increment, get_count) functions sharing a counter."""
    # YOUR CODE HERE
    pass

# Uncomment to test:
# inc, get = make_counter(10)
# inc()
# inc()
# inc()
# print(get())  # Should print 13


# ============================================================
# CHALLENGE 5: What Does This Print?
# ============================================================
"""
Predict the output. This combines closures, late binding, and scope.
"""
print("\n--- Challenge 5: The Mind Bender ---")

def create_functions():
    result = []
    for i in range(3):
        def func(x, i=i):    # Note the default argument
            return x + i
        result.append(func)
    return result

funcs = create_functions()
print([f(10) for f in funcs])  # PREDICT:

# Now without the default argument trick:
def create_functions_v2():
    result = []
    for i in range(3):
        def func(x):          # No default argument
            return x + i
        result.append(func)
    return result

funcs2 = create_functions_v2()
print([f(10) for f in funcs2])  # PREDICT:


# ============================================================
# CHALLENGE 6: Stacking Decorators
# ============================================================
"""
Predict the order of execution.
"""
print("\n--- Challenge 6: Stacking ---")

def bold(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return f"<b>{func(*args, **kwargs)}</b>"
    return wrapper

def italic(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return f"<i>{func(*args, **kwargs)}</i>"
    return wrapper

@bold
@italic
def greet(name):
    return f"Hello, {name}"

print(greet("Alice"))  # PREDICT:

# The order: @bold(@italic(greet))
# italic wraps greet first, then bold wraps the result
# So: bold(italic(greet))("Alice")


# ============================================================
# CHALLENGE 7: Build Your Own @property
# ============================================================
"""
Without using the built-in property(), implement a simple version.
This tests your understanding of decorators and descriptors.
"""
print("\n--- Challenge 7: Custom Property ---")

# Don't worry if this is hard — it bridges into Module 05 (OOP).
# The key insight: @property is just a decorator that returns a descriptor.

# Hint for implementation:
# class MyProperty:
#     def __init__(self, fget):
#         self.fget = fget
#     def __get__(self, obj, objtype=None):
#         if obj is None:
#             return self
#         return self.fget(obj)


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("Key challenges: memoize, retry decorator, closure counter")
    print("These are REAL interview questions. Practice them!")
    print("=" * 60)
