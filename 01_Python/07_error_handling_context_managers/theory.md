# Module 07: Error Handling & Context Managers

## The Big Question
Why does `with` exist? How does Python's exception system actually work? And why is "ask forgiveness, not permission" the Python way?

---

## 1. Exceptions Are Objects

Every exception in Python is an object — an instance of a class that inherits from `BaseException`.

```
BaseException
├── SystemExit          # sys.exit() — NOT caught by 'except Exception'
├── KeyboardInterrupt   # Ctrl+C — NOT caught by 'except Exception'
├── GeneratorExit       # Generator cleanup
└── Exception           # All "normal" errors inherit from this
    ├── ValueError
    ├── TypeError
    ├── KeyError
    ├── IndexError
    ├── AttributeError
    ├── FileNotFoundError (subclass of OSError)
    ├── RuntimeError
    └── ... many more
```

### Why this hierarchy matters:
```python
# NEVER do this:
try:
    something()
except:  # Catches EVERYTHING including SystemExit and KeyboardInterrupt!
    pass

# This is bad too:
try:
    something()
except BaseException:  # Same problem
    pass

# ALWAYS catch Exception or more specific:
try:
    something()
except Exception as e:  # Catches normal errors, lets SystemExit/KeyboardInterrupt through
    print(f"Error: {e}")
```

---

## 2. The try/except/else/finally Block

```python
try:
    result = risky_operation()
except ValueError as e:
    # Runs ONLY if ValueError was raised
    print(f"Bad value: {e}")
except (TypeError, KeyError) as e:
    # Can catch multiple types
    print(f"Type or Key error: {e}")
except Exception as e:
    # Catches everything else (except SystemExit, KeyboardInterrupt)
    print(f"Unexpected: {e}")
else:
    # Runs ONLY if NO exception was raised
    # This is the "happy path" — code that should run only on success
    print(f"Success: {result}")
finally:
    # Runs ALWAYS — whether exception occurred or not
    # Use for cleanup: closing files, releasing locks, etc.
    print("Cleanup complete")
```

### Why `else` exists:
Without `else`, you'd put success code in the `try` block, but then exceptions from that code would be caught too:

```python
# BAD: process() errors are caught by the ValueError handler
try:
    value = get_value()
    process(value)        # If THIS raises ValueError, it's caught!
except ValueError:
    print("get_value failed")

# GOOD: only get_value() errors are caught
try:
    value = get_value()
except ValueError:
    print("get_value failed")
else:
    process(value)  # Exceptions here propagate normally
```

---

## 3. Raising Exceptions

```python
# Raise a new exception:
raise ValueError("Invalid input")

# Re-raise the current exception (in an except block):
try:
    something()
except ValueError:
    log_error()
    raise  # Re-raises the SAME exception with original traceback

# Chain exceptions (Python 3):
try:
    value = int(user_input)
except ValueError as e:
    raise RuntimeError("Failed to parse config") from e
    # The original ValueError is attached as __cause__
```

### Exception chaining:
```python
try:
    int("abc")
except ValueError as original:
    raise RuntimeError("Config parse failed") from original

# Traceback shows:
# ValueError: invalid literal for int() with base 10: 'abc'
# The above exception was the direct cause of:
# RuntimeError: Config parse failed
```

---

## 4. Custom Exceptions

```python
class AppError(Exception):
    """Base exception for our application."""
    pass

class ValidationError(AppError):
    """Raised when input validation fails."""
    def __init__(self, field, message):
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")

class NotFoundError(AppError):
    """Raised when a resource is not found."""
    def __init__(self, resource_type, resource_id):
        self.resource_type = resource_type
        self.resource_id = resource_id
        super().__init__(f"{resource_type} '{resource_id}' not found")

# Usage:
try:
    raise ValidationError("email", "must contain @")
except ValidationError as e:
    print(f"Validation failed on '{e.field}': {e.message}")
```

### Best practices:
1. Create a base exception for your app/library
2. Subclass it for specific error types
3. Include useful attributes (not just a message string)
4. Always call `super().__init__()`

---

## 5. EAFP vs LBYL

### LBYL — Look Before You Leap (non-Pythonic)
```python
# Check first, then act
if key in dictionary:
    value = dictionary[key]
else:
    value = default

if os.path.exists(filepath):
    with open(filepath) as f:
        data = f.read()
```

### EAFP — Easier to Ask Forgiveness than Permission (Pythonic)
```python
# Just try it, handle failure
try:
    value = dictionary[key]
except KeyError:
    value = default

try:
    with open(filepath) as f:
        data = f.read()
except FileNotFoundError:
    data = None
```

### Why EAFP is preferred:
1. **Race conditions**: With LBYL, the file could be deleted between the check and the read
2. **Performance**: In the common case (no error), EAFP is faster — no extra check
3. **Duck typing**: EAFP works with any object that supports the operation, not just specific types
4. **Simplicity**: One code path, not two

### But EAFP isn't always better:
```python
# If the error case is COMMON (not exceptional), use LBYL:
# Bad EAFP — exceptions for flow control:
try:
    value = my_list[index]
except IndexError:
    value = None  # If this happens 50% of the time, use a check instead
```

---

## 6. Context Managers and `with`

### The Problem `with` Solves:
```python
# Without with — easy to forget cleanup:
f = open("file.txt")
try:
    data = f.read()
finally:
    f.close()  # Must close even if read() fails

# With 'with' — cleanup is guaranteed:
with open("file.txt") as f:
    data = f.read()
# f.close() is called automatically, even if an exception occurs
```

### How it Works — The Context Manager Protocol:
```python
class ManagedResource:
    def __enter__(self):
        """Set up the resource. Return value is bound to 'as' variable."""
        print("  Acquiring resource")
        return self  # or return some resource

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Clean up the resource. Called ALWAYS (even on exception)."""
        print("  Releasing resource")
        # exc_type, exc_val, exc_tb are None if no exception
        # Return True to suppress the exception, False to propagate it
        return False

with ManagedResource() as r:
    print("  Using resource")
    # __exit__ called here, even if this block raises
```

### The `__exit__` parameters:
```python
def __exit__(self, exc_type, exc_val, exc_tb):
    """
    exc_type: The exception class (e.g., ValueError), or None
    exc_val:  The exception instance, or None
    exc_tb:   The traceback object, or None

    Return True to SUPPRESS the exception (swallow it)
    Return False to let it PROPAGATE
    """
```

---

## 7. `contextlib` — Context Managers Made Easy

### `@contextmanager` — Write context managers as generators:
```python
from contextlib import contextmanager

@contextmanager
def timer(label):
    import time
    start = time.time()
    try:
        yield  # Everything before yield = __enter__, after = __exit__
    finally:
        elapsed = time.time() - start
        print(f"{label}: {elapsed:.4f}s")

with timer("Processing"):
    sum(range(1_000_000))
# Output: Processing: 0.0234s
```

The pattern:
```python
@contextmanager
def managed_resource():
    # Setup (__enter__)
    resource = acquire_resource()
    try:
        yield resource  # This is where the 'with' block runs
    finally:
        # Cleanup (__exit__)
        release_resource(resource)
```

### `suppress` — Selectively ignore exceptions:
```python
from contextlib import suppress

# Instead of:
try:
    os.remove("temp.txt")
except FileNotFoundError:
    pass

# Use:
with suppress(FileNotFoundError):
    os.remove("temp.txt")
```

### `redirect_stdout` — Capture print output:
```python
from contextlib import redirect_stdout
import io

f = io.StringIO()
with redirect_stdout(f):
    print("This goes to the string buffer")

output = f.getvalue()  # "This goes to the string buffer\n"
```

---

## 8. Nesting and Combining Context Managers

```python
# Nested:
with open("input.txt") as infile:
    with open("output.txt", "w") as outfile:
        outfile.write(infile.read())

# Same thing, more compact:
with open("input.txt") as infile, open("output.txt", "w") as outfile:
    outfile.write(infile.read())

# Dynamic number of context managers:
from contextlib import ExitStack

files = ["a.txt", "b.txt", "c.txt"]
with ExitStack() as stack:
    handles = [stack.enter_context(open(f)) for f in files]
    # All files are open here, all will be closed on exit
```

---

## 9. Exception Groups (Python 3.11+)

```python
# When multiple errors happen (e.g., concurrent tasks):
errors = [ValueError("bad value"), TypeError("wrong type")]
raise ExceptionGroup("multiple errors", errors)

# Catch with except*:
try:
    raise ExceptionGroup("errors", [ValueError("v"), TypeError("t")])
except* ValueError as eg:
    print(f"ValueErrors: {eg.exceptions}")
except* TypeError as eg:
    print(f"TypeErrors: {eg.exceptions}")
```

---

## Summary

```
Exceptions are objects in a class hierarchy
try/except/else/finally — else for success path, finally for cleanup
EAFP > LBYL in Python (try first, handle errors)
Context managers (__enter__/__exit__) guarantee cleanup
@contextmanager turns generators into context managers
Custom exceptions: inherit from Exception, add useful attributes
Exception chaining: raise X from Y preserves context
```

**Interview one-liner**: "Python's `with` statement implements the context manager protocol — `__enter__` sets up a resource and `__exit__` guarantees cleanup, even if exceptions occur. Python favors EAFP (try/except) over LBYL (check first) because it's race-condition-free, works with duck typing, and is faster in the common case. Custom exceptions should form a hierarchy with a base exception and carry structured data, not just strings."
