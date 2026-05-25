# Module 02: Interview Gotchas — Objects, Names, and Memory

---

## Gotcha 1: "Is Python pass-by-value or pass-by-reference?"

**Wrong**: "Pass by value" or "Pass by reference"

**Right**: "Python uses **pass by object reference** (also called pass by assignment). When you call a function, the parameter name is bound to the same object as the argument. If you **mutate** the object (e.g., `.append()`), the caller sees the change. If you **rebind** the name (e.g., `x = new_value`), the caller doesn't see it — you just made the local name point somewhere else."

---

## Gotcha 2: "What's the difference between shallow and deep copy?"

**Shallow**: "A shallow copy creates a new container object but the elements inside still reference the same objects. So modifying a nested mutable object affects both the original and the copy."

**Deep**: "A deep copy recursively creates new objects for everything, so the original and copy are completely independent."

**Bonus**: "`copy.copy()` for shallow, `copy.deepcopy()` for deep. Lists also support `lst.copy()` and `lst[:]` for shallow copies."

---

## Gotcha 3: "Why can't lists be dictionary keys?"

**Answer**: "Dictionary keys must be hashable. Hashability requires immutability because the hash value must stay constant. If a list could be a key and you mutated it, its hash would change, and the dict wouldn't be able to find the value anymore. Tuples are hashable (as long as their contents are hashable) because they're immutable."

---

## Gotcha 4: `+=` on a list inside a tuple

```python
t = ([1, 2],)
t[0] += [3]  # Raises TypeError BUT also mutates t[0]!
```

**Answer**: "`+=` for lists calls `__iadd__` which mutates the list in place (succeeds), then tries to assign the result back to `t[0]` (fails because tuples don't support item assignment). So you get BOTH the mutation AND the error."

---

## Gotcha 5: "What are the implications of everything being an object?"

**Answer**: "It means functions, classes, and modules are all first-class objects. You can pass functions as arguments, store them in data structures, create them dynamically, and return them from other functions. This is the foundation for decorators, higher-order functions, and Python's flexibility."
