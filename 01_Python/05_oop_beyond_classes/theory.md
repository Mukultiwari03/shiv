# Module 05: OOP — Beyond Classes

## The Big Question
Everyone knows `class Dog:` — but how does Python's OOP actually work under the hood? What are MRO, descriptors, and `__slots__`?

---

## 1. Classes Are Objects Too

In Python, a class is just an object — an instance of `type`.

```python
class Dog:
    pass

print(type(Dog))       # <class 'type'>
print(type(int))       # <class 'type'>
print(type(type))      # <class 'type'> — type is its own type!
```

When you write `class Dog:`, Python:
1. Executes the class body (top-level code inside the class)
2. Collects all names defined into a dictionary
3. Calls `type("Dog", (object,), {...})` to create the class object
4. Binds the name `Dog` to that class object

```python
# These are equivalent:
class Dog:
    species = "Canis familiaris"
    def bark(self):
        return "Woof!"

# Same thing, manually:
Dog = type("Dog", (object,), {
    "species": "Canis familiaris",
    "bark": lambda self: "Woof!"
})
```

---

## 2. Instance Creation: `__new__` vs `__init__`

Most people think `__init__` creates the object. It doesn't.

```python
class Foo:
    def __new__(cls):
        print(f"__new__ called — creating instance of {cls}")
        instance = super().__new__(cls)
        return instance
    
    def __init__(self):
        print(f"__init__ called — initializing {self}")

f = Foo()
# Output:
# __new__ called — creating instance of <class 'Foo'>
# __init__ called — initializing <__main__.Foo object ...>
```

### The difference:
- `__new__` **creates** the instance (allocates memory, returns the object)
- `__init__` **initializes** the instance (sets attributes on the already-created object)

### Why does this matter?
- `__new__` is how you implement singletons, custom immutable types, and factory patterns
- For immutable types (`int`, `str`, `tuple`), you MUST use `__new__` because by the time `__init__` runs, the object already exists and can't be changed

```python
class SingleDigit(int):
    def __new__(cls, value):
        if value < 0 or value > 9:
            raise ValueError("Must be 0-9")
        return super().__new__(cls, value)

x = SingleDigit(5)   # Works
# y = SingleDigit(10)  # ValueError
```

---

## 3. The Method Resolution Order (MRO)

When a class inherits from multiple parents, Python needs to know which order to search for methods. This order is the **MRO**.

```python
class A:
    def greet(self): return "A"

class B(A):
    def greet(self): return "B"

class C(A):
    def greet(self): return "C"

class D(B, C):
    pass

print(D().greet())       # "B" — but why not "C" or "A"?
print(D.__mro__)         # Shows the search order
```

### C3 Linearization
Python uses the **C3 linearization algorithm** to compute MRO. The rules are:
1. The class itself comes first
2. Then its parents, in the order listed
3. A parent class appears only AFTER all its children
4. The order respects the left-to-right declaration order

```python
# D.__mro__ = (D, B, C, A, object)
# Search order: D → B → C → A → object
```

### `super()` follows MRO, not parent
```python
class A:
    def greet(self):
        print("A.greet")

class B(A):
    def greet(self):
        print("B.greet")
        super().greet()      # Calls next in MRO, NOT necessarily A!

class C(A):
    def greet(self):
        print("C.greet")
        super().greet()

class D(B, C):
    def greet(self):
        print("D.greet")
        super().greet()

D().greet()
# D.greet → B.greet → C.greet → A.greet
# super() in B calls C (next in D's MRO), NOT A!
```

This is called **cooperative multiple inheritance**. Every class calls `super()`, and the MRO ensures every class's method is called exactly once, in the right order.

---

## 4. Dunder Methods (Magic Methods)

Dunder methods let your objects work with Python's built-in operations:

### Object Representation
```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __repr__(self):
        """For developers — unambiguous, ideally eval()-able"""
        return f"Point({self.x}, {self.y})"
    
    def __str__(self):
        """For users — readable"""
        return f"({self.x}, {self.y})"

p = Point(3, 4)
print(repr(p))  # Point(3, 4)   — used by debuggers, REPL
print(str(p))   # (3, 4)        — used by print()
print(p)        # (3, 4)        — print calls str()
```

### Comparison
```python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
    
    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return self.x == other.x and self.y == other.y
    
    def __lt__(self, other):
        # Compare by distance from origin
        return (self.x**2 + self.y**2) < (other.x**2 + other.y**2)
    
    def __hash__(self):
        return hash((self.x, self.y))
```

**Key rule**: If you define `__eq__`, Python sets `__hash__` to `None` (making instances unhashable). If you want your objects in sets or as dict keys, define `__hash__` too.

### Container Protocol
```python
class Deck:
    def __init__(self):
        self.cards = list(range(52))
    
    def __len__(self):          return len(self.cards)
    def __getitem__(self, idx): return self.cards[idx]
    def __contains__(self, card): return card in self.cards
    def __iter__(self):         return iter(self.cards)
```

### Context Manager Protocol
```python
class Timer:
    def __enter__(self):
        import time
        self.start = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        import time
        self.elapsed = time.time() - self.start
        print(f"Elapsed: {self.elapsed:.4f}s")
        return False  # Don't suppress exceptions
```

### Callable Objects
```python
class Adder:
    def __init__(self, n):
        self.n = n
    
    def __call__(self, x):
        return self.n + x

add5 = Adder(5)
print(add5(10))  # 15 — the OBJECT is callable!
```

---

## 5. Properties and Descriptors

### `@property` — Managed Attributes
```python
class Circle:
    def __init__(self, radius):
        self._radius = radius
    
    @property
    def radius(self):
        """Getter"""
        return self._radius
    
    @radius.setter
    def radius(self, value):
        """Setter with validation"""
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value
    
    @property
    def area(self):
        """Computed property — read only"""
        import math
        return math.pi * self._radius ** 2

c = Circle(5)
print(c.radius)     # 5 — looks like attribute access, but calls getter
print(c.area)       # 78.54 — computed on access
c.radius = 10       # Calls setter
# c.radius = -1     # ValueError!
```

### The Descriptor Protocol (How `@property` Works)
```python
class Validator:
    """A descriptor that validates assigned values."""
    def __init__(self, min_val, max_val):
        self.min_val = min_val
        self.max_val = max_val
    
    def __set_name__(self, owner, name):
        self.name = name
    
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, f"_{self.name}", None)
    
    def __set__(self, obj, value):
        if not self.min_val <= value <= self.max_val:
            raise ValueError(f"{self.name} must be between {self.min_val} and {self.max_val}")
        setattr(obj, f"_{self.name}", value)

class Student:
    grade = Validator(0, 100)  # Descriptor instance as CLASS attribute
    age = Validator(0, 150)
    
    def __init__(self, name, grade, age):
        self.name = name
        self.grade = grade   # Calls Validator.__set__
        self.age = age

s = Student("Alice", 95, 20)
# s.grade = 150  # ValueError!
```

**Key insight**: A descriptor is any object that defines `__get__`, `__set__`, or `__delete__`. When that object is a CLASS attribute, Python calls those methods instead of doing normal attribute access. This is how `@property`, `@classmethod`, `@staticmethod`, and even regular methods work.

---

## 6. `__slots__` — Memory Optimization

By default, Python stores instance attributes in a `__dict__`:
```python
class Normal:
    def __init__(self, x, y):
        self.x = x
        self.y = y

n = Normal(1, 2)
print(n.__dict__)  # {'x': 1, 'y': 2}
```

`__slots__` replaces the dict with a fixed set of attribute slots:
```python
class Slotted:
    __slots__ = ('x', 'y')
    
    def __init__(self, x, y):
        self.x = x
        self.y = y

s = Slotted(1, 2)
# s.__dict__  # AttributeError — no dict!
# s.z = 3     # AttributeError — can't add new attributes!
```

### Why use `__slots__`?
- **Memory**: ~40% less memory per instance (no `__dict__`)
- **Speed**: Slightly faster attribute access
- **Safety**: Prevents accidental attribute creation

### When to use:
- Many instances of the same class (thousands+)
- You know all attributes at design time
- NOT when you need dynamic attribute creation

---

## 7. Class Methods, Static Methods, Instance Methods

```python
class Pizza:
    base_price = 10
    
    def __init__(self, toppings):
        self.toppings = toppings
    
    def price(self):
        """Instance method — has access to self (the instance)"""
        return self.base_price + len(self.toppings) * 2
    
    @classmethod
    def margherita(cls):
        """Class method — has access to cls (the class), NOT a specific instance.
        Commonly used as alternative constructors."""
        return cls(["mozzarella", "tomato"])
    
    @staticmethod
    def is_valid_topping(topping):
        """Static method — has access to NEITHER self nor cls.
        Just a function that logically belongs to the class."""
        return topping.lower() not in ["pineapple"]

p = Pizza.margherita()     # Alternative constructor
print(p.price())           # 14
print(Pizza.is_valid_topping("mushroom"))  # True
```

---

## 8. Abstract Base Classes (ABCs)

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        """Subclasses MUST implement this."""
        pass
    
    @abstractmethod
    def perimeter(self):
        pass
    
    def describe(self):
        """Concrete method — subclasses inherit this."""
        return f"Shape with area {self.area():.2f}"

# shape = Shape()  # TypeError: Can't instantiate abstract class!

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        import math
        return math.pi * self.radius ** 2
    
    def perimeter(self):
        import math
        return 2 * math.pi * self.radius

c = Circle(5)
print(c.describe())  # "Shape with area 78.54"
```

---

## Summary

```
Classes are objects (instances of type)
__new__ creates, __init__ initializes
MRO determines method lookup order (C3 linearization)
super() follows MRO, not just the parent class
Dunder methods integrate with Python's built-in operations
@property = descriptor shortcut for managed attributes
__slots__ = memory optimization, fixed attributes
@classmethod = alternative constructors
@staticmethod = utility functions on the class
ABCs = enforce interface contracts
```

**Interview one-liner**: "Python's OOP is built on the idea that classes are objects too, created by the metaclass `type`. Method resolution uses C3 linearization, enabling cooperative multiple inheritance. The descriptor protocol (objects with `__get__`/`__set__`) is the mechanism behind `@property`, `@classmethod`, and even normal method binding. For memory-critical code, `__slots__` eliminates the per-instance `__dict__`."
