# Module 04: Interview Gotchas — Iteration & Generators

---

## Gotcha 1: "What's the difference between an iterable and an iterator?"

**Shallow**: "An iterable can be looped over."

**Deep**: "An iterable is any object with `__iter__()` — it can produce an iterator. An iterator has both `__iter__()` (returns self) and `__next__()` — it tracks position and yields values one at a time. Key difference: iterables can be iterated multiple times (each call to `__iter__` returns a fresh iterator), while iterators are single-use — once exhausted, they're done."

---

## Gotcha 2: "What is a generator?"

**Shallow**: "A function with `yield`."

**Deep**: "A generator function uses `yield` to produce a lazy iterator. When called, it returns a generator object without executing any of the function body. Each `next()` call resumes execution until the next `yield`, which suspends the entire execution state — local variables, instruction pointer, everything. This makes generators memory-efficient for large or infinite sequences, and they're the foundation for Python's coroutine system."

---

## Gotcha 3: Generator expressions are single-use

```python
gen = (x**2 for x in range(5))
print(sum(gen))    # 30
print(sum(gen))    # 0 — generator is exhausted!
```

**Key**: If you need to iterate multiple times, use a list comprehension or wrap in `list()`.

---

## Gotcha 4: "When would you use a generator over a list?"

**Answer**: "When you're dealing with large datasets that don't fit in memory, infinite sequences, or pipeline-style processing where you transform data step by step. Generators compute values on-demand (lazy evaluation), so they use O(1) memory regardless of sequence size. But if you need random access, need to iterate multiple times, or the dataset is small, use a list."

---

## Gotcha 5: The `in` operator consumes iterators

```python
gen = (x for x in range(5))
print(3 in gen)  # True — consumed 0, 1, 2, 3
print(1 in gen)  # False — 1 is already consumed!
print(4 in gen)  # True — continues from where it left off
```

**Key**: `in` on an iterator advances it until it finds the value (or exhausts). Remaining elements before the found value are consumed.

---

## Gotcha 6: "Explain `yield from`."

**Answer**: "`yield from` delegates to a sub-iterator. Instead of writing `for item in sub: yield item`, you write `yield from sub`. It's not just syntactic sugar — it also properly handles `send()`, `throw()`, and `close()` propagation, which a manual loop wouldn't. It's essential for composing generators and for recursive generators like tree traversal."
