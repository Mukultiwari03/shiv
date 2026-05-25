# Module 03: Interview Gotchas — Functions

---

## Gotcha 1: "What is a closure?"

**Shallow**: "A function inside a function."

**Deep**: "A closure is a function that captures and retains access to variables from its enclosing scope, even after the outer function has returned. The captured variables are stored in `__closure__` as cell objects. This is how Python implements stateful functions without classes — the closure 'closes over' the free variables from the enclosing scope."

---

## Gotcha 2: "Explain decorators."

**Shallow**: "They modify functions."

**Deep**: "A decorator is a function that takes a function as input and returns a new function (usually a wrapper). `@decorator` syntax is sugar for `func = decorator(func)`. The wrapper typically adds behavior before/after calling the original. Always use `@functools.wraps` to preserve the original function's `__name__`, `__doc__`, and other metadata, otherwise introspection and debugging break."

---

## Gotcha 3: Late binding in closures

```python
funcs = [lambda: i for i in range(3)]
[f() for f in funcs]  # [2, 2, 2] — NOT [0, 1, 2]
```

**Why**: Lambdas capture the variable `i`, not its value. By the time they execute, the loop is done and `i = 2`.

**Fix**: Use a default argument `lambda i=i: i` to capture the value at definition time.

---

## Gotcha 4: "What's the difference between `*args` and `**kwargs`?"

**Answer**: "`*args` collects extra **positional** arguments into a tuple. `**kwargs` collects extra **keyword** arguments into a dict. Together they let a function accept any combination of arguments, which is essential for writing decorators and wrapper functions."

---

## Gotcha 5: UnboundLocalError

```python
x = 10
def f():
    print(x)
    x = 20
```

**Answer**: "Python's compiler determines variable scope at compile time, not runtime. Since `x = 20` exists in the function, `x` is marked as local for the entire function. The `print(x)` on the previous line fails because the local `x` hasn't been assigned yet. Use `global x` to explicitly reference the global."

---

## Gotcha 6: "What's `functools.lru_cache`?"

**Answer**: "It's a built-in memoization decorator. It caches function results based on arguments. `@lru_cache(maxsize=128)` keeps the 128 most recent calls. `maxsize=None` for unlimited cache. It requires hashable arguments (so it won't work with list arguments). It's the standard way to add memoization in Python."
