# Module 01: Common Interview Gotchas

These are traps that interviewers love to set. Know them cold.

---

## Gotcha 1: "Is Python Interpreted or Compiled?"

**Wrong answer**: "It's interpreted."

**Right answer**: "Python is **both compiled and interpreted**. The source code is first compiled to bytecode (you can see the `.pyc` files in `__pycache__`), then the bytecode is interpreted by the Python Virtual Machine. This is similar to how Java works, but Python does it transparently — you don't need a separate compile step."

**Bonus points**: "The exact behavior depends on the implementation. CPython compiles to bytecode and interprets it. PyPy uses a JIT compiler that compiles hot bytecode paths to machine code at runtime."

---

## Gotcha 2: "What's the difference between `is` and `==`?"

**Incomplete answer**: "`is` checks identity, `==` checks equality."

**Complete answer**: "`==` checks if two objects have the same **value** by calling the `__eq__` method. `is` checks if two names refer to the **exact same object in memory** — same `id()`. You should almost always use `==`. The only common use of `is` is `x is None`, because there's exactly one `None` object."

**The trap**: The interviewer might ask "So `a = 256; b = 256; a is b` — what's the result?" Answer: `True` in CPython because it caches integers -5 to 256. But this is an implementation detail — never rely on it.

---

## Gotcha 3: "Are variables in Python like boxes that store values?"

**Wrong model**: "Yes, `x = 5` means x holds the value 5."

**Right model**: "No. In Python, names are references (labels) that point to objects. `x = 5` creates an integer object 5 and attaches the name `x` to it. Multiple names can point to the same object. This is why `a = [1,2,3]; b = a; b.append(4)` modifies what `a` sees — both names point to the same list object."

---

## Gotcha 4: "What does `del x` do?"

**Wrong answer**: "It deletes the object."

**Right answer**: "It removes the **name** `x` from the current namespace and decrements the reference count of the object it was pointing to. The object is only deallocated when its reference count drops to zero (or when the garbage collector finds it in a reference cycle)."

---

## Gotcha 5: "What is `if __name__ == '__main__'` for?"

**Shallow answer**: "It means the code only runs when you run the file directly."

**Deep answer**: "When Python imports a module, it executes all top-level code in that module. The `__name__` variable is set to the module name on import, but set to `'__main__'` when the file is run directly. The guard lets you separate reusable definitions from script-execution logic. Without it, importing a module would trigger its execution code as side effects."

---

## Gotcha 6: Mutable Default Arguments

```python
def add_item(item, lst=[]):
    lst.append(item)
    return lst
```

**The trap**: `add_item(1)` then `add_item(2)` — the default list is shared!

**Why**: Default arguments are evaluated **once** when the function is **defined**, not each time it's called. The `[]` creates a single list object that persists across calls.

**Fix**:
```python
def add_item(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst
```

**Interview answer**: "Default mutable arguments are a classic Python gotcha. The default value is created once at function definition time and reused across calls. The fix is to use `None` as the default and create a new mutable object inside the function body."

---

## Gotcha 7: "How does Python manage memory?"

**Shallow answer**: "Garbage collection."

**Deep answer**: "CPython primarily uses **reference counting** — every object tracks how many references point to it, and when the count drops to zero, the memory is immediately freed. Additionally, there's a **cyclic garbage collector** that handles reference cycles (when objects reference each other, keeping their counts above zero even when they're unreachable). The GC is generational — it checks younger objects more frequently since they're more likely to become garbage."

---

## Key Interview Principle

Never just answer "what." Always answer "why" and "how."

- **What**: Python uses reference counting → ❌ Shallow
- **Why + How**: Python uses reference counting because it gives deterministic, immediate cleanup. But it can't handle cycles, so there's also a generational GC. → ✅ Deep
