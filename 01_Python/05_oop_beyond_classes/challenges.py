"""
Module 05: OOP Beyond Classes — Challenges
============================================

Build real things. These are actual interview-level problems.
"""

# ============================================================
# CHALLENGE 1: Build a Singleton
# ============================================================
"""
Implement a class where only ONE instance can ever exist.
Calling MyClass() multiple times returns the SAME object.
HINT: Override __new__.
"""
print("--- Challenge 1: Singleton ---")

class Singleton:
    # YOUR CODE HERE
    pass

# Uncomment to test:
# a = Singleton()
# b = Singleton()
# print(f"a is b: {a is b}")  # Should be True


# ============================================================
# CHALLENGE 2: Make a Custom Container
# ============================================================
"""
Build a SortedList that always keeps its elements sorted.
Must support: len(), iteration, indexing, `in`, and repr.
"""
print("\n--- Challenge 2: SortedList ---")

class SortedList:
    def __init__(self, items=None):
        self._data = sorted(items) if items else []

    def add(self, item):
        """Add item while maintaining sort order."""
        # YOUR CODE HERE
        # HINT: Use bisect module for efficiency
        pass

    def __len__(self):
        # YOUR CODE HERE
        pass

    def __getitem__(self, index):
        # YOUR CODE HERE
        pass

    def __contains__(self, item):
        # YOUR CODE HERE — use binary search!
        pass

    def __iter__(self):
        # YOUR CODE HERE
        pass

    def __repr__(self):
        return f"SortedList({self._data})"

# Uncomment to test:
# sl = SortedList([3, 1, 4, 1, 5])
# sl.add(2)
# print(sl)           # SortedList([1, 1, 2, 3, 4, 5])
# print(len(sl))      # 6
# print(sl[0])        # 1
# print(3 in sl)      # True
# for x in sl: print(x, end=" ")  # 1 1 2 3 4 5


# ============================================================
# CHALLENGE 3: Context Manager Class
# ============================================================
"""
Build a FileWriter context manager that:
- Opens a temp file on __enter__
- Writes data to it during the with block
- On __exit__, either saves or discards based on exceptions
"""
print("\n--- Challenge 3: Context Manager ---")

import os
import tempfile

class SafeFileWriter:
    """Write to a temp file. Rename to final path only if no exception."""
    def __init__(self, filepath):
        self.filepath = filepath
        self.temp_path = None
        self.file = None

    def __enter__(self):
        # YOUR CODE HERE
        # Create temp file, open it, return the file handle
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        # YOUR CODE HERE
        # If no exception: close and rename temp → final
        # If exception: close and delete temp
        # Return False (don't suppress exceptions)
        pass

# Uncomment to test:
# with SafeFileWriter("/tmp/test_safe.txt") as f:
#     f.write("Hello, safe world!\n")
# print(open("/tmp/test_safe.txt").read())


# ============================================================
# CHALLENGE 4: The Diamond Problem
# ============================================================
"""
Predict the EXACT output. Then verify.
This tests your understanding of MRO and cooperative super().
"""
print("\n--- Challenge 4: Diamond Problem ---")

class Base:
    def __init__(self):
        print("  Base.__init__")

class Left(Base):
    def __init__(self):
        print("  Left.__init__")
        super().__init__()

class Right(Base):
    def __init__(self):
        print("  Right.__init__")
        super().__init__()

class Child(Left, Right):
    def __init__(self):
        print("  Child.__init__")
        super().__init__()

print("Creating Child:")
c = Child()  # PREDICT the exact order of all print statements
print(f"MRO: {[c.__name__ for c in Child.__mro__]}")


# ============================================================
# CHALLENGE 5: Implement @staticmethod and @classmethod
# ============================================================
"""
Build your own versions of these decorators.
This tests descriptor protocol understanding.
"""
print("\n--- Challenge 5: Custom Decorators ---")

class MyStaticMethod:
    """Descriptor that makes a function static (no self/cls)."""
    def __init__(self, func):
        self.func = func

    def __get__(self, obj, objtype=None):
        # YOUR CODE HERE
        # Should return the raw function (no binding)
        pass

class MyClassMethod:
    """Descriptor that binds the function to the class."""
    def __init__(self, func):
        self.func = func

    def __get__(self, obj, objtype=None):
        # YOUR CODE HERE
        # Should return a callable that passes cls as first arg
        pass

# Uncomment to test:
# class Demo:
#     @MyStaticMethod
#     def static_hi():
#         return "static hello"
#
#     @MyClassMethod
#     def class_hi(cls):
#         return f"class hello from {cls.__name__}"
#
# print(Demo.static_hi())       # "static hello"
# print(Demo.class_hi())        # "class hello from Demo"
# print(Demo().class_hi())      # "class hello from Demo"


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("Singleton, custom containers, and the diamond problem")
    print("are all very common interview questions.")
    print("=" * 60)
