# Module 07: Interview Gotchas — Error Handling & Context Managers

---

## Gotcha 1: "What's the purpose of `else` in try/except/else?"

**Answer**: "The `else` block runs only when no exception was raised in the `try` block. It separates the 'risky' code from the 'success path' code, so exceptions from the success code aren't accidentally caught by the `except` handler. It makes the scope of error handling precise."

---

## Gotcha 2: "What's the difference between `except Exception` and bare `except`?"

**Answer**: "Bare `except:` catches everything including `SystemExit` and `KeyboardInterrupt`, which makes your program impossible to kill with Ctrl+C. `except Exception:` only catches normal errors, letting system-level exceptions propagate. Never use bare `except` — and even `except Exception` should be rare. Catch specific exceptions whenever possible."

---

## Gotcha 3: "Explain EAFP vs LBYL."

**Answer**: "LBYL (Look Before You Leap) checks preconditions before acting. EAFP (Easier to Ask Forgiveness than Permission) tries the operation and handles exceptions. Python prefers EAFP because: (1) it eliminates race conditions (the condition could change between the check and the action), (2) it's faster when errors are rare (no overhead from the check), and (3) it works with duck typing (any object supporting the operation works, regardless of type)."

---

## Gotcha 4: `finally` always runs — even with `return`

```python
def f():
    try:
        return "try"
    finally:
        print("finally runs!")  # This ALWAYS runs

f()  # Prints "finally runs!", returns "try"
```

**But if `finally` has a return, it OVERRIDES the try's return:**
```python
def f():
    try:
        return "try"
    finally:
        return "finally"  # This wins!

f()  # Returns "finally" — the try's return is lost
```

**Key**: Never put `return` in `finally`. It suppresses exceptions and overrides returns.

---

## Gotcha 5: "What is a context manager?"

**Answer**: "A context manager is any object that implements `__enter__` and `__exit__`. The `with` statement calls `__enter__` to set up a resource, executes the body, then always calls `__exit__` for cleanup — even if an exception occurs. `__exit__` can suppress exceptions by returning True. The `contextlib.contextmanager` decorator lets you write context managers as generator functions, where code before `yield` is `__enter__` and code after is `__exit__`."

---

## Gotcha 6: "When should you create custom exceptions?"

**Answer**: "Create custom exceptions when you need to: (1) distinguish your application's errors from Python built-in errors, (2) carry structured data (not just a string message), or (3) allow callers to catch at different granularity (catch the base `AppError` for broad handling or specific subclasses for precise handling). Always inherit from `Exception`, create a hierarchy, and include useful attributes like error codes, field names, or context data."
