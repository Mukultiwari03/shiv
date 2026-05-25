# Module 02: Objects, Names, and Memory

## The Big Question
Why does `a = b` sometimes copy a value and sometimes not?

This is the #1 source of Python bugs for intermediate developers, and one of the most common interview topics.

---

## 1. The Two Kinds of "Change"

There are two fundamentally different things you can do with a name in Python:

### Rebinding: Making a name point to a different object
```python
x = 10
x = 20  # x now points to a NEW object. The object 10 is unaffected.
```

### Mutating: Changing the object itself
```python
lst = [1, 2, 3]
lst.append(4)  # The SAME object is modified. lst still points to it.
```

**This distinction is everything.** If you understand this, you understand 90% of Python's "weird" behavior.

---

## 2. Mutable vs Immutable Objects

### Immutable: Cannot be changed after creation
| Type | Example |
|------|---------|
| `int` | `42` |
| `float` | `3.14` |
| `str` | `"hello"` |
| `tuple` | `(1, 2, 3)` |
| `frozenset` | `frozenset({1, 2})` |
| `bool` | `True` |
| `bytes` | `b"hello"` |

When you "change" an immutable object, you're actually creating a NEW object:
```python
s = "hello"
s = s + " world"  # Creates a brand new string object "hello world"
                   # s now points to the new object
                   # "hello" still exists (until garbage collected)
```

### Mutable: CAN be changed after creation
| Type | Example |
|------|---------|
| `list` | `[1, 2, 3]` |
| `dict` | `{"a": 1}` |
| `set` | `{1, 2, 3}` |
| `bytearray` | `bytearray(b"hello")` |
| Custom objects | Instances of your classes |

When you mutate a mutable object, ALL names pointing to it see the change:
```python
a = [1, 2, 3]
b = a           # b points to the SAME list
a.append(4)
print(b)        # [1, 2, 3, 4] — b sees the change!
```

---

## 3. Why Does Immutability Exist?

It's not arbitrary. Immutability serves critical purposes:

### a) Hashability
Only immutable objects can be dictionary keys or set members (by default).
```python
d = {}
d[[1, 2]] = "nope"     # TypeError: unhashable type: 'list'
d[(1, 2)] = "works!"   # Tuples are immutable → hashable
```

**Why?** A dict uses the hash of the key to find where to store the value. If the key could change after insertion, the hash would change, and the dict couldn't find the value anymore.

### b) Thread Safety
Immutable objects are inherently thread-safe — no one can change them.

### c) Performance
Python can cache and reuse immutable objects (like small integers -5 to 256, and interned strings).

---

## 4. Assignment Never Copies

This is the golden rule. Memorize it.

> **Assignment in Python NEVER copies data. It always creates a new reference (name) pointing to the same object.**

```python
a = [1, 2, 3]
b = a            # b is NOT a copy. b IS a.
```

This diagram shows what's in memory:
```
    a ──┐
        ├──→ [1, 2, 3]   (one list object in memory)
    b ──┘
```

NOT this (which is what most people think):
```
    a ──→ [1, 2, 3]   (copy 1)
    b ──→ [1, 2, 3]   (copy 2)   ← WRONG MENTAL MODEL
```

---

## 5. How to Actually Copy

### Shallow Copy
Creates a NEW container, but the elements inside still point to the same objects.

```python
import copy

# Method 1: list() constructor
a = [1, [2, 3], 4]
b = list(a)

# Method 2: slice
b = a[:]

# Method 3: .copy()
b = a.copy()

# Method 4: copy.copy()
b = copy.copy(a)
```

All four create this:
```
a ──→ [  •,     •,    •  ]     (list object A)
         |      |     |
         v      v     v
         1   [2,3]    4
         ^      ^     ^
         |      |     |
b ──→ [  •,     •,    •  ]     (list object B — different object!)
```

The outer lists are different objects. But the INNER list `[2, 3]` is shared!

```python
a = [1, [2, 3], 4]
b = a.copy()       # shallow copy

b[0] = 99          # Changes b's first element. a is unaffected.
print(a)           # [1, [2, 3], 4]

b[1].append(999)   # Mutates the SHARED inner list!
print(a)           # [1, [2, 3, 999], 4] — a sees the change!
```

### Deep Copy
Creates a NEW container AND recursively copies all nested objects.

```python
import copy

a = [1, [2, 3], 4]
b = copy.deepcopy(a)

b[1].append(999)
print(a)  # [1, [2, 3], 4] — a is completely independent
```

```
a ──→ [  •,     •,    •  ]
         |      |     |
         v      v     v
         1   [2,3]    4

b ──→ [  •,     •,    •  ]
         |      |     |
         v      v     v
         1   [2,3]    4       ← completely separate copy
```

### When to Use Which?
| Scenario | Method |
|----------|--------|
| Flat list of numbers/strings | Shallow copy is fine |
| Nested structures (lists of lists, dicts of dicts) | Deep copy |
| You want to share data intentionally | Assignment (no copy) |

---

## 6. Function Arguments: Pass by Object Reference

Python is NOT "pass by value" or "pass by reference." It's **pass by object reference** (sometimes called "pass by assignment").

When you call a function, the parameter name is **assigned** to the argument object. Same as `param = argument`.

### With immutable objects:
```python
def change_number(x):
    x = x + 1    # Rebinds x to a NEW int object
    return x

n = 10
change_number(n)
print(n)          # 10 — n is unchanged
```

Why? `x = x + 1` creates a new int object and rebinds `x` to it. `n` still points to 10.

### With mutable objects:
```python
def change_list(lst):
    lst.append(4)  # Mutates the object lst points to

my_list = [1, 2, 3]
change_list(my_list)
print(my_list)     # [1, 2, 3, 4] — mutated!
```

Why? `lst.append(4)` mutates the object. `my_list` and `lst` point to the same object.

### The confusing case:
```python
def replace_list(lst):
    lst = [4, 5, 6]  # Rebinds lst to a NEW list. Does NOT affect caller.

my_list = [1, 2, 3]
replace_list(my_list)
print(my_list)        # [1, 2, 3] — unchanged!
```

Why? `lst = [4, 5, 6]` is rebinding, not mutating. It makes the local name `lst` point to a new object. `my_list` still points to the original.

### The rule:
- **Mutating** the object (`.append()`, `[0] = x`, `.update()`) → caller sees the change
- **Rebinding** the name (`=`) → caller does NOT see the change

---

## 7. Interning and Caching

CPython optimizes memory by reusing certain immutable objects.

### Integer Caching
Integers -5 to 256 are pre-created and cached:
```python
a = 256
b = 256
print(a is b)  # True — same cached object

a = 257
b = 257
print(a is b)  # False (usually) — different objects
```

### String Interning
Strings that look like identifiers are automatically interned:
```python
a = "hello"
b = "hello"
print(a is b)  # True — interned

a = "hello world!"
b = "hello world!"
print(a is b)  # False (usually) — has spaces/punctuation, not interned
```

### Why does this matter?
1. **Never use `is` for value comparison** — use `==`
2. The only safe `is` comparisons are: `x is None`, `x is True`, `x is False`
3. Understanding this helps you understand Python's memory model

---

## 8. Tuple Immutability — It's Subtle

A tuple is immutable, meaning you can't change WHICH objects it contains. But if those objects are mutable, THEY can still change:

```python
t = ([1, 2], [3, 4])
# t[0] = [5, 6]      # TypeError — can't reassign tuple elements
t[0].append(3)        # Works! The list inside is mutable.
print(t)              # ([1, 2, 3], [3, 4])
```

The tuple itself hasn't changed — it still contains the same two list objects. But the list objects have been mutated.

Think of it as: the tuple's "pointers" are frozen, but what they point to can change.

---

## 9. The `+=` Trap

```python
# With a list (mutable):
a = [1, 2]
b = a
a += [3]        # This calls a.__iadd__([3]) — mutates in place!
print(b)        # [1, 2, 3] — b sees the change

# With a tuple (immutable):
a = (1, 2)
b = a
a += (3,)       # This creates a NEW tuple! a is rebound.
print(b)        # (1, 2) — b still points to original
```

`+=` does different things depending on whether the object is mutable or immutable:
- Mutable: calls `__iadd__` (in-place add) → mutates
- Immutable: falls back to `__add__` (creates new) → rebinds

---

## Summary: The Mental Model

```
1. Assignment (=) never copies — it creates a new reference
2. Mutable objects can be changed in place
3. Immutable objects cannot — "changing" them creates new objects
4. Shallow copy: new container, shared contents
5. Deep copy: new everything
6. Function args work like assignment: param = argument
7. Mutating ≠ Rebinding — this is the key distinction
```

**Interview one-liner**: "In Python, variables are names that reference objects. Assignment binds a name to an object, it never copies. Mutation changes an object in place, rebinding makes a name point to a different object. Understanding this distinction explains why lists seem to behave differently from integers when passed to functions."
