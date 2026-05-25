"""
Module 05: OOP Beyond Classes — Exercises
==========================================

RULES: Predict → Type → Run → Understand surprises
"""

# ============================================================
# EXERCISE 1: Classes Are Objects
# ============================================================
print("--- Exercise 1: Classes Are Objects ---")

class Dog:
    species = "Canis familiaris"

print(type(Dog))             # PREDICT:
print(type(int))             # PREDICT:
print(isinstance(Dog, type)) # PREDICT:

# Classes have attributes just like any object:
print(Dog.__name__)          # PREDICT:
print(Dog.__bases__)         # PREDICT:
print(Dog.__dict__.keys())   # Shows all class attributes


# ============================================================
# EXERCISE 2: __new__ vs __init__
# ============================================================
print("\n--- Exercise 2: __new__ vs __init__ ---")

class Tracked:
    def __new__(cls):
        print(f"  1. __new__ called for {cls.__name__}")
        instance = super().__new__(cls)
        print(f"  2. instance created: {instance}")
        return instance

    def __init__(self):
        print(f"  3. __init__ called on {self}")
        self.value = 42

t = Tracked()
# PREDICT the order of print statements


# ============================================================
# EXERCISE 3: Instance vs Class Attributes
# ============================================================
print("\n--- Exercise 3: Instance vs Class Attributes ---")

class Counter:
    count = 0  # Class attribute — shared by all instances

    def __init__(self):
        Counter.count += 1
        self.id = Counter.count

a = Counter()
b = Counter()
c = Counter()

print(f"Counter.count = {Counter.count}")  # PREDICT:
print(f"a.count = {a.count}")              # PREDICT:
print(f"a.id = {a.id}")                    # PREDICT:
print(f"c.id = {c.id}")                    # PREDICT:

# Now the tricky part:
a.count = 99  # What does this do? Creates INSTANCE attribute on a!
print(f"a.count = {a.count}")              # PREDICT:
print(f"b.count = {b.count}")              # PREDICT:
print(f"Counter.count = {Counter.count}")  # PREDICT:


# ============================================================
# EXERCISE 4: MRO
# ============================================================
print("\n--- Exercise 4: MRO ---")

class A:
    def who(self): return "A"

class B(A):
    def who(self): return "B"

class C(A):
    def who(self): return "C"

class D(B, C):
    pass

print(f"D().who() = {D().who()}")          # PREDICT:
print(f"MRO: {[c.__name__ for c in D.__mro__]}")  # PREDICT:


# ============================================================
# EXERCISE 5: super() Follows MRO
# ============================================================
print("\n--- Exercise 5: super() Follows MRO ---")

class A:
    def greet(self):
        print("  A.greet")

class B(A):
    def greet(self):
        print("  B.greet")
        super().greet()

class C(A):
    def greet(self):
        print("  C.greet")
        super().greet()

class D(B, C):
    def greet(self):
        print("  D.greet")
        super().greet()

# PREDICT the full output:
D().greet()


# ============================================================
# EXERCISE 6: Dunder Methods
# ============================================================
print("\n--- Exercise 6: Dunder Methods ---")

class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __len__(self):
        return int((self.x**2 + self.y**2)**0.5)

    def __bool__(self):
        return self.x != 0 or self.y != 0

v1 = Vector(3, 4)
v2 = Vector(1, 2)
v3 = v1 + v2

print(f"v3 = {v3}")           # PREDICT:
print(f"len(v1) = {len(v1)}") # PREDICT:
print(f"bool(Vector(0,0)) = {bool(Vector(0,0))}")  # PREDICT:


# ============================================================
# EXERCISE 7: @property
# ============================================================
print("\n--- Exercise 7: @property ---")

class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius  # This calls the setter!

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero!")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32

t = Temperature(100)
print(f"Celsius: {t.celsius}")       # PREDICT:
print(f"Fahrenheit: {t.fahrenheit}") # PREDICT:
t.celsius = 0
print(f"After change: {t.fahrenheit}") # PREDICT:


# ============================================================
# EXERCISE 8: __slots__
# ============================================================
print("\n--- Exercise 8: __slots__ ---")

class WithDict:
    def __init__(self, x):
        self.x = x

class WithSlots:
    __slots__ = ('x',)
    def __init__(self, x):
        self.x = x

wd = WithDict(1)
ws = WithSlots(1)

print(f"WithDict has __dict__: {hasattr(wd, '__dict__')}")  # PREDICT:
print(f"WithSlots has __dict__: {hasattr(ws, '__dict__')}")  # PREDICT:

wd.y = 2  # Works — dynamic attribute
try:
    ws.y = 2  # PREDICT what happens:
except AttributeError as e:
    print(f"Slots error: {e}")

import sys
print(f"WithDict size: {sys.getsizeof(wd) + sys.getsizeof(wd.__dict__)} bytes")
print(f"WithSlots size: {sys.getsizeof(ws)} bytes")


# ============================================================
# EXERCISE 9: @classmethod as Alternative Constructor
# ============================================================
print("\n--- Exercise 9: @classmethod ---")

class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day

    @classmethod
    def from_string(cls, date_str):
        year, month, day = map(int, date_str.split("-"))
        return cls(year, month, day)

    @classmethod
    def today(cls):
        import datetime
        d = datetime.date.today()
        return cls(d.year, d.month, d.day)

    def __repr__(self):
        return f"Date({self.year}, {self.month}, {self.day})"

d1 = Date(2024, 1, 15)
d2 = Date.from_string("2024-06-25")
d3 = Date.today()

print(d1)  # PREDICT:
print(d2)  # PREDICT:
print(type(d3))


# ============================================================
# EXERCISE 10: __eq__ and __hash__
# ============================================================
print("\n--- Exercise 10: __eq__ and __hash__ ---")

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p1 = Point(1, 2)
p2 = Point(1, 2)
print(f"p1 == p2 (no __eq__): {p1 == p2}")  # PREDICT:
# Default __eq__ checks identity (is), not value!

class PointV2:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if not isinstance(other, PointV2):
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def __hash__(self):
        return hash((self.x, self.y))

p3 = PointV2(1, 2)
p4 = PointV2(1, 2)
print(f"p3 == p4 (with __eq__): {p3 == p4}")  # PREDICT:

# Can we use them in a set?
s = {p3, p4}
print(f"Set size: {len(s)}")  # PREDICT:


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("Key: MRO, super(), __eq__/__hash__, and @property")
    print("are the most commonly asked OOP interview topics.")
    print("=" * 60)
