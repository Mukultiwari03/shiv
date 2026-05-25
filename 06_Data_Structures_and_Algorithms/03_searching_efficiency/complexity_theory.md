# Big O Notation: The Language of Efficiency

In interviews, "Does it work?" is only 50% of the grade. The other 50% is "How does it scale?"

---

## 1. What is Big O?
Big O notation describes how the **time** or **space** requirements of an algorithm grow as the **input size (n)** increases.

We don't care about exact seconds (because different computers have different speeds). We care about the **shape of the growth**.

### Common Complexities (Fastest to Slowest)

| Notation | Name | Analogy | Example |
| :--- | :--- | :--- | :--- |
| **O(1)** | Constant | Picking a name from a hat | `list[0]`, `dict[key]` |
| **O(log n)** | Logarithmic | Finding a word in a dictionary (Binary Search) | `binary_search(sorted_list)` |
| **O(n)** | Linear | Reading every page in a book | `for x in list:`, `max(list)` |
| **O(n log n)** | Linearithmic | Sorting a deck of cards efficiently | `list.sort()`, `sorted()` |
| **O(n²)** | Quadratic | Comparing every item to every other item | Nested loops, `for i in list: for j in list:` |
| **O(2ⁿ)** | Exponential | Trying every possible combination | Naive `fib(n)` recursion |

---

## 2. The Golden Rules of Big O

### Rule 1: Worst Case Matters
If you're searching for a number in a list, it might be the first item (O(1)). But Big O always assumes the **worst case** (the item is at the end or not there at all). So searching a list is **O(n)**.

### Rule 2: Drop the Constants
`O(2n)` becomes **O(n)**. 
`O(500n + 100)` becomes **O(n)**.
We only care about the most significant factor.

### Rule 3: Drop the Lower-Order Terms
`O(n² + n)` becomes **O(n²)**.
As `n` gets huge, the `n²` dwarfs the `n`.

---

## 3. How to calculate it in your head

### The "Loop Count" method:
- 1 loop through `n` items = **O(n)**
- 2 **nested** loops through `n` items = **O(n²)**
- 2 **sequential** loops through `n` items = **O(n + n)** = **O(n)**

### The "Halving" method:
- If you divide the problem in half every step (like Binary Search) = **O(log n)**

### The "Space" method:
- If you create a new list of size `n` = **O(n) Space**
- If you only use a few variables = **O(1) Space**

---

## 4. Python Built-in Costs (MUST MEMORIZE)

Interviewers will catch you if you don't know these:

| Operation | Complexity | Why? |
| :--- | :--- | :--- |
| `list.append()` | **O(1)** | Just adds to the end |
| `list.insert(0, x)` | **O(n)** | Must shift every other element! |
| `item in list` | **O(n)** | Scans every item |
| `item in set` | **O(1)** | Uses a Hash Table (Magic!) |
| `item in dict` | **O(1)** | Uses a Hash Table |
| `list.sort()` | **O(n log n)** | Timsort algorithm |

---

## 5. Why the `two_sum` fix was better

Your first `two_sum` used:
```python
for i in nums:              # O(n)
    if complement in nums:  # O(n) inside the loop
```
**Total: O(n²)**. If you had 1,000,000 numbers, it would take 1,000,000,000,000 operations.

A better way (using a Set or Dict):
```python
seen = set()                # Space: O(n)
for i in nums:              # O(n)
    if complement in seen:  # O(1) inside the loop
```
**Total: O(n)**. If you had 1,000,000 numbers, it takes 1,000,000 operations.
**Result**: 1,000,000x faster!