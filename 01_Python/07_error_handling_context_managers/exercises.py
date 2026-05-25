"""
Module 07: Error Handling & Context Managers — Exercises
=========================================================

RULES: Predict → Type → Run → Understand surprises
"""

# ============================================================
# EXERCISE 1: Exception Hierarchy
# ============================================================
print("--- Exercise 1: Exception Hierarchy ---")

# Check the inheritance:
print(f"ValueError bases: {ValueError.__bases__}")       # PREDICT:
print(f"Exception bases: {Exception.__bases__}")          # PREDICT:
print(f"KeyError bases: {KeyError.__bases__}")            # PREDICT:

# isinstance checks:
e = FileNotFoundError("test")
print(f"FileNotFoundError is OSError: {isinstance(e, OSError)}")        # PREDICT:
print(f"FileNotFoundError is Exception: {isinstance(e, Exception)}")    # PREDICT:

# This is why catching OSError also catches FileNotFoundError


# ============================================================
# EXERCISE 2: try/except/else/finally
# ============================================================
print("\n--- Exercise 2: Full try block ---")

def divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("  except: division by zero")
        return None
    except TypeError:
        print("  except: wrong types")
        return None
    else:
        print(f"  else: success, result = {result}")
        return result
    finally:
        print("  finally: always runs")

print(f"Result: {divide(10, 2)}")   # PREDICT all print statements
print()
print(f"Result: {divide(10, 0)}")   # PREDICT all print statements
print()
print(f"Result: {divide(10, 'a')}") # PREDICT all print statements


# ============================================================
# EXERCISE 3: finally and return
# ============================================================
print("\n--- Exercise 3: finally vs return ---")

def tricky():
    try:
        return "from try"
    finally:
        print("  finally runs!")
        # Note: if we had 'return' here, it would OVERRIDE try's return

result = tricky()
print(f"Result: {result}")  # PREDICT: Which return wins?


# ============================================================
# EXERCISE 4: Exception Chaining
# ============================================================
print("\n--- Exercise 4: Exception Chaining ---")

def parse_config(text):
    try:
        return int(text)
    except ValueError as e:
        raise RuntimeError(f"Config parse failed for: {text}") from e

try:
    parse_config("abc")
except RuntimeError as e:
    print(f"Caught: {e}")
    print(f"Original cause: {e.__cause__}")
    print(f"Cause type: {type(e.__cause__).__name__}")


# ============================================================
# EXERCISE 5: Custom Exceptions
# ============================================================
print("\n--- Exercise 5: Custom Exceptions ---")

class AppError(Exception):
    """Base error for our app."""
    pass

class ValidationError(AppError):
    def __init__(self, field, message):
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")

try:
    raise ValidationError("age", "must be positive")
except AppError as e:  # Catches ValidationError too!
    print(f"Caught as AppError: {e}")
    print(f"Is ValidationError: {isinstance(e, ValidationError)}")
    if isinstance(e, ValidationError):
        print(f"Field: {e.field}")


# ============================================================
# EXERCISE 6: EAFP vs LBYL
# ============================================================
print("\n--- Exercise 6: EAFP vs LBYL ---")

data = {"name": "Alice", "scores": [90, 85, 95]}

# LBYL style:
if "scores" in data and len(data["scores"]) > 0:
    avg = sum(data["scores"]) / len(data["scores"])
    print(f"LBYL avg: {avg}")

# EAFP style:
try:
    avg = sum(data["scores"]) / len(data["scores"])
    print(f"EAFP avg: {avg}")
except (KeyError, ZeroDivisionError, TypeError):
    print("EAFP: couldn't calculate average")


# ============================================================
# EXERCISE 7: Context Manager Protocol
# ============================================================
print("\n--- Exercise 7: Context Manager ---")

class Verbose:
    def __init__(self, name):
        self.name = name
        print(f"  __init__: {name}")

    def __enter__(self):
        print(f"  __enter__: {self.name}")
        return self  # This is what 'as' binds to

    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"  __exit__: {self.name}")
        if exc_type:
            print(f"  Exception: {exc_type.__name__}: {exc_val}")
        return False  # Don't suppress exceptions

print("Before with:")
with Verbose("resource") as v:
    print(f"  Inside with: {v.name}")
print("After with:")

# PREDICT the exact order of all print statements


# ============================================================
# EXERCISE 8: __exit__ Exception Handling
# ============================================================
print("\n--- Exercise 8: __exit__ with Exception ---")

class Suppressor:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is ValueError:
            print(f"  Suppressing ValueError: {exc_val}")
            return True  # Suppress ValueError
        return False      # Let other exceptions propagate

with Suppressor():
    print("  Before raise")
    raise ValueError("suppressed!")
    print("  After raise")  # PREDICT: Does this run?

print("After with block")  # PREDICT: Does this run?


# ============================================================
# EXERCISE 9: contextlib.contextmanager
# ============================================================
print("\n--- Exercise 9: @contextmanager ---")

from contextlib import contextmanager

@contextmanager
def tag(name):
    print(f"<{name}>")
    yield name
    print(f"</{name}>")

with tag("div") as t:
    print(f"  content (tag={t})")

# PREDICT the output order


# ============================================================
# EXERCISE 10: Nested Context Managers
# ============================================================
print("\n--- Exercise 10: Nested ---")

@contextmanager
def level(n):
    print(f"  {'  ' * n}Entering level {n}")
    yield n
    print(f"  {'  ' * n}Exiting level {n}")

with level(0) as a:
    with level(1) as b:
        with level(2) as c:
            print(f"  {'  ' * 3}Deepest: {a},{b},{c}")

# PREDICT: What order do exits happen?


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("Key: try/else, EAFP, context managers, and")
    print("custom exceptions are all common interview topics.")
    print("=" * 60)
