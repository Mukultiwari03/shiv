"""
Module 07: Error Handling & Context Managers — Challenges
==========================================================
"""
from contextlib import contextmanager
import time

# ============================================================
# CHALLENGE 1: Build a Retry Context Manager
# ============================================================
"""
Build a context manager that retries the block up to N times
if an exception occurs.
"""
print("--- Challenge 1: Retry Context Manager ---")

class Retry:
    def __init__(self, max_retries=3, exceptions=(Exception,)):
        self.max_retries = max_retries
        self.exceptions = exceptions
        self.attempts = 0

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # YOUR CODE HERE
        # If the exception is in self.exceptions and we haven't
        # exhausted retries, suppress it and increment attempts
        # HINT: This is tricky — a context manager can't re-run
        # the with block. You might need a different approach.
        # Consider using a generator-based approach instead.
        pass

# Alternative approach — retry as a decorator is more natural:
def retry_call(func, max_retries=3, exceptions=(Exception,)):
    """Call func, retrying up to max_retries times on exception."""
    # YOUR CODE HERE
    pass

# Uncomment to test:
# attempt = 0
# def flaky():
#     global attempt
#     attempt += 1
#     if attempt < 3:
#         raise ConnectionError(f"Attempt {attempt} failed")
#     return "success!"
#
# result = retry_call(flaky, max_retries=5, exceptions=(ConnectionError,))
# print(f"Result: {result} after {attempt} attempts")


# ============================================================
# CHALLENGE 2: Transaction Context Manager
# ============================================================
"""
Build a context manager that collects operations and either
commits them all or rolls them all back on error.
"""
print("\n--- Challenge 2: Transaction ---")

class Transaction:
    def __init__(self):
        self.operations = []
        self.committed = False

    def add(self, operation, rollback):
        """Add an operation and its rollback function."""
        self.operations.append((operation, rollback))
        operation()  # Execute immediately

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # YOUR CODE HERE
        # If no exception: mark committed
        # If exception: rollback all operations in REVERSE order
        pass

# Uncomment to test:
# state = {"balance": 100}
#
# with Transaction() as txn:
#     txn.add(
#         lambda: state.update(balance=state["balance"] - 50),
#         lambda: state.update(balance=state["balance"] + 50),
#     )
#     print(f"  During txn: {state}")
#     # raise ValueError("Simulated error")  # Uncomment to test rollback
#
# print(f"  After txn: {state}")


# ============================================================
# CHALLENGE 3: Build a Logger Context Manager
# ============================================================
"""
Build a @contextmanager that logs entry, exit, duration,
and any exceptions that occurred.
"""
print("\n--- Challenge 3: Logger ---")

@contextmanager
def logged(operation_name):
    """Log entry, exit, duration, and exceptions."""
    # YOUR CODE HERE
    pass

# Uncomment to test:
# with logged("data processing"):
#     time.sleep(0.1)
#     print("  Processing...")
#
# try:
#     with logged("failing operation"):
#         raise ValueError("something broke")
# except ValueError:
#     pass


# ============================================================
# CHALLENGE 4: Exception Hierarchy Design
# ============================================================
"""
Design an exception hierarchy for a web API framework.
Must handle: validation errors, auth errors, not found,
rate limiting, and internal errors. Each should carry
relevant data (not just a message string).
"""
print("\n--- Challenge 4: Exception Hierarchy ---")

# YOUR CODE HERE — Define the hierarchy:
# class APIError(Exception): ...
# class ValidationError(APIError): ...
# etc.

# Then write a function that demonstrates catching at different levels:
# def handle_request():
#     try:
#         ...
#     except ValidationError as e:
#         return {"status": 422, "error": str(e), "field": e.field}
#     except AuthError as e:
#         return {"status": 401, "error": str(e)}
#     except APIError as e:
#         return {"status": 500, "error": str(e)}


# ============================================================
# CHALLENGE 5: Predict the Output
# ============================================================
print("\n--- Challenge 5: Prediction ---")

def puzzle():
    try:
        try:
            raise ValueError("inner")
        except ValueError:
            print("  caught inner ValueError")
            raise TypeError("converted")
        finally:
            print("  inner finally")
    except TypeError:
        print("  caught outer TypeError")
    finally:
        print("  outer finally")
    return "done"

result = puzzle()
print(f"Result: {result}")
# PREDICT the exact output, including order of all print statements


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("Transaction/retry patterns and exception hierarchy design")
    print("are common in system design interviews.")
    print("=" * 60)
