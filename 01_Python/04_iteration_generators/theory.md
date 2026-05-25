# Module 04: Iteration Protocol & Generators

## The Big Question
What actually happens when you write `for x in something`? And why are generators so powerful?

---

## 1. The Iteration Protocol

When you write `for x in [1, 2, 3]`, Python doesn't just "loop through the list." Here's what actually happens:

### Step-by-step:
```python
my_list = [1, 2, 3]

# Step 1: Python calls iter() on the object to get an ITERATOR
iterator = iter(my_list)   # Calls my_list.__iter__()

# Step 2: Python calls next() repeatedly on the iterator
print(next(iterator))  # 1   — Calls iterator.__next__()
print(next(iterator))  # 2
print(next(iterator))  # 3
print(next(iterator))  # StopIteration exception!
```

### The protocol:
- **Iterable**: An object that has an `__iter__()` method (returns an iterator)
- **Iterator**: An object that has a `__next__()` method (returns next value, raises `StopIteration` when done)

```
for x in something:
    ...

# Is equivalent to:
_iter = iter(something)      # Get iterator
while True:
    try:
        x = next(_iter)       # Get next value
    except StopIteration:
        break                 # Stop when exhausted
    ...                       # Execute loop body
```

---

## 2. Iterable vs Iterator — The Key Distinction

### Iterable
- Has `__iter__()` that returns an iterator
- Can be iterated over MULTIPLE times
- Examples: `list`, `tuple`, `str`, `dict`, `set`, `range`

### Iterator
- Has BOTH `__iter__()` (returns self) and `__next__()`
- Can be iterated over only ONCE — it's consumed
- Examples: file objects, `map()`, `filter()`, `zip()`, generators

```python
my_list = [1, 2, 3]  # Iterable

# Can iterate multiple times:
for x in my_list: print(x, end=" ")  # 1 2 3
for x in my_list: print(x, end=" ")  # 1 2 3 (again!)

# Iterator — only once:
my_iter = iter(my_list)
for x in my_iter: print(x, end=" ")  # 1 2 3
for x in my_iter: print(x, end=" ")  # (nothing — exhausted!)
```

### Why does the iterator's `__iter__` return self?
So that iterators work in for loops too. The for loop calls `iter()` on whatever you give it — if it's already an iterator, `iter()` just returns it.

---

## 3. Building Your Own Iterable

```python
class Countdown:
    def __init__(self, start):
        self.start = start
    
    def __iter__(self):
        """Return a NEW iterator each time — so we can iterate multiple times."""
        return CountdownIterator(self.start)

class CountdownIterator:
    def __init__(self, current):
        self.current = current
    
    def __iter__(self):
        return self  # Iterators return themselves
    
    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1

# Usage:
cd = Countdown(3)
for x in cd: print(x, end=" ")  # 3 2 1
for x in cd: print(x, end=" ")  # 3 2 1 (works again!)
```

### Key design decision:
The iterable creates a FRESH iterator each time `__iter__` is called. This is why lists can be iterated multiple times — each `for` loop gets a fresh iterator.

---

## 4. Generators — Lazy Iterators Made Easy

Writing a full iterator class is verbose. Generators give you the same power with a fraction of the code.

### Generator Function
A function that uses `yield` instead of `return`:

```python
def countdown(n):
    while n > 0:
        yield n       # Pauses here, returns n
        n -= 1        # Resumes here on next call

# Usage:
for x in countdown(3):
    print(x)  # 3, 2, 1
```

### What happens when you call a generator function?

```python
gen = countdown(3)
print(type(gen))  # <class 'generator'>
```

Calling `countdown(3)` does NOT execute the function body. It returns a **generator object** — which is an iterator.

The function body executes lazily, one `yield` at a time:

```python
gen = countdown(3)
print(next(gen))  # 3 — executes until first yield
print(next(gen))  # 2 — resumes after first yield, runs until second yield
print(next(gen))  # 1 — resumes after second yield
# next(gen)       # StopIteration — function returned (fell off the end)
```

### The Magic: Suspended State
When a generator yields, its entire execution state is **frozen**:
- Local variables are preserved
- The instruction pointer (where it stopped) is preserved
- The call stack frame is kept alive

This is why generators are so powerful — they maintain state between calls without you having to manage it.

---

## 5. Generator Expressions

Like list comprehensions, but lazy:

```python
# List comprehension — creates entire list in memory
squares_list = [x**2 for x in range(1000000)]  # 1M items in memory NOW

# Generator expression — creates values one at a time
squares_gen = (x**2 for x in range(1000000))   # Almost no memory used

# Both work in for loops:
for s in squares_gen:
    if s > 100:
        break  # Stopped early — only computed ~11 values!
```

### Memory comparison:
```python
import sys

list_comp = [x for x in range(1000)]
gen_expr = (x for x in range(1000))

print(sys.getsizeof(list_comp))  # ~8056 bytes (stores all 1000 ints)
print(sys.getsizeof(gen_expr))   # ~200 bytes (stores just the generator state)
```

### When to use which:
| Scenario | Use |
|----------|-----|
| Need to access elements multiple times | List comprehension |
| Need to index or slice | List comprehension |
| Processing a large/infinite sequence | Generator expression |
| Piping data through transformations | Generator expression |
| Passing to a function that takes iterable | Generator expression |

---

## 6. `yield from` — Delegating to Sub-Generators

```python
def flatten(nested):
    for item in nested:
        if isinstance(item, list):
            yield from flatten(item)   # Delegate to recursive call
        else:
            yield item

list(flatten([1, [2, [3, 4], 5], 6]))  # [1, 2, 3, 4, 5, 6]
```

`yield from` is equivalent to:
```python
for item in sub_generator:
    yield item
```

But it's more efficient and handles edge cases (like `.send()` and `.throw()`) correctly.

---

## 7. Generator Methods: send, throw, close

Generators aren't just producers — you can communicate WITH them:

### `.send(value)` — Send a value INTO the generator
```python
def accumulator():
    total = 0
    while True:
        value = yield total   # yield sends total out, receives value in
        total += value

gen = accumulator()
next(gen)              # Initialize (run to first yield) — returns 0
print(gen.send(10))    # Send 10, returns 10
print(gen.send(20))    # Send 20, returns 30
print(gen.send(5))     # Send 5, returns 35
```

### `.throw(exception)` — Throw an exception INTO the generator
```python
def careful_generator():
    try:
        yield 1
        yield 2
        yield 3
    except ValueError:
        print("Caught ValueError inside generator!")
        yield "recovered"

gen = careful_generator()
print(next(gen))               # 1
print(gen.throw(ValueError))   # Caught ValueError... → "recovered"
```

### `.close()` — Stop the generator
```python
gen = countdown(100)
next(gen)    # 100
gen.close()  # Raises GeneratorExit inside the generator
# next(gen)  # StopIteration
```

---

## 8. Real-World Generator Patterns

### Pattern 1: Reading Large Files
```python
def read_large_file(filepath):
    """Read a file line by line without loading entire file."""
    with open(filepath) as f:
        for line in f:  # File objects are already iterators!
            yield line.strip()

# Process a 10GB file with constant memory:
# for line in read_large_file("huge.csv"):
#     process(line)
```

### Pattern 2: Pipeline Processing
```python
def parse_lines(lines):
    for line in lines:
        yield line.split(",")

def filter_valid(rows):
    for row in rows:
        if len(row) >= 3:
            yield row

def extract_names(rows):
    for row in rows:
        yield row[0].strip()

# Chain them:
# lines = read_large_file("data.csv")
# parsed = parse_lines(lines)
# valid = filter_valid(parsed)
# names = extract_names(valid)
# for name in names:
#     print(name)

# No intermediate lists created — data flows through the pipeline!
```

### Pattern 3: Infinite Sequences
```python
def integers(start=0):
    n = start
    while True:
        yield n
        n += 1

def take(n, iterable):
    for i, item in enumerate(iterable):
        if i >= n:
            break
        yield item

# First 10 integers starting from 5:
list(take(10, integers(5)))  # [5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
```

---

## 9. itertools — The Standard Library Power Tools

```python
import itertools

# count — infinite counter
# itertools.count(start=0, step=1)

# cycle — infinite cycle through iterable
# itertools.cycle([1, 2, 3])  → 1, 2, 3, 1, 2, 3, ...

# chain — concatenate iterables
list(itertools.chain([1, 2], [3, 4]))  # [1, 2, 3, 4]

# islice — slice an iterator
list(itertools.islice(range(100), 5, 10))  # [5, 6, 7, 8, 9]

# groupby — group consecutive elements
data = [("a", 1), ("a", 2), ("b", 3), ("b", 4)]
for key, group in itertools.groupby(data, key=lambda x: x[0]):
    print(key, list(group))
# a [('a', 1), ('a', 2)]
# b [('b', 3), ('b', 4)]

# product, permutations, combinations
list(itertools.product("AB", "12"))       # [('A','1'),('A','2'),('B','1'),('B','2')]
list(itertools.permutations("ABC", 2))    # 6 items
list(itertools.combinations("ABC", 2))    # 3 items
```

---

## Summary: Mental Model

```
for loop → calls iter() → gets iterator → calls next() repeatedly → StopIteration

Iterable: has __iter__(), can be looped multiple times
Iterator: has __next__(), single-use, consumed as you go

Generator function: uses yield, returns generator object (an iterator)
Generator expression: (expr for x in iterable) — lazy version of list comp

Generators are lazy — compute one value at a time
→ Memory efficient for large/infinite sequences
→ Great for pipeline processing
```

**Interview one-liner**: "Python's iteration protocol is based on two methods: `__iter__()` returns an iterator, and `__next__()` returns the next value or raises StopIteration. Generators are a convenient way to create iterators using `yield` — they maintain suspended state between calls, enabling lazy evaluation. This makes them ideal for processing large datasets, building pipelines, and representing infinite sequences with constant memory."
