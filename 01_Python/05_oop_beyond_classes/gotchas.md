# Module 05: Interview Gotchas — OOP

---

## Gotcha 1: "What's the difference between `__new__` and `__init__`?"

**Answer**: "`__new__` is the constructor — it creates and returns the instance. `__init__` is the initializer — it configures the already-created instance. `__new__` receives the class, `__init__` receives the instance. You override `__new__` for singletons, immutable subclasses, or factory patterns."

---

## Gotcha 2: "Explain MRO and the diamond problem."

**Answer**: "MRO (Method Resolution Order) is the order Python searches for methods in a class hierarchy. It uses C3 linearization, which ensures each class appears only once and respects the left-to-right order of bases. In a diamond inheritance (D inherits B and C, both inherit A), the MRO ensures A's method is called only once. `super()` follows the MRO, not the direct parent — so `super()` in B might call C's method, not A's."

---

## Gotcha 3: Instance vs class attribute shadowing

```python
class Foo:
    x = 10

a = Foo()
a.x = 20      # Creates an INSTANCE attribute, doesn't change class attribute
print(Foo.x)  # 10 — class attribute unchanged
print(a.x)    # 20 — instance attribute shadows class attribute
```

**Key**: Reading `a.x` checks instance dict first, then class dict. Writing `a.x = val` always creates/updates the instance attribute.

---

## Gotcha 4: "What are descriptors?"

**Answer**: "A descriptor is any object that defines `__get__`, `__set__`, or `__delete__`. When assigned as a class attribute, Python intercepts attribute access and calls these methods instead. `@property`, `@classmethod`, `@staticmethod`, and even regular bound methods all work through the descriptor protocol. It's the mechanism that turns `obj.method` into a bound method."

---

## Gotcha 5: `__eq__` breaks `__hash__`

```python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

p = Point(1, 2)
{p}  # TypeError: unhashable type: 'Point'
```

**Why**: Python sets `__hash__ = None` when you define `__eq__`, because if two objects are equal, they MUST have the same hash. Since you changed equality semantics, the default identity-based hash is no longer valid. Define `__hash__` alongside `__eq__`.

---

## Gotcha 6: "When should you use `__slots__`?"

**Answer**: "Use `__slots__` when you're creating many instances (thousands+) of a class with a fixed set of attributes. It eliminates the per-instance `__dict__`, saving ~40% memory and slightly speeding up attribute access. Don't use it for classes that need dynamic attributes or when subclassing — `__slots__` doesn't inherit the way you might expect."
