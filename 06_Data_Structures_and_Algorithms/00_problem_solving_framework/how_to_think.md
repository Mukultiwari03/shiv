# How to Think About Problems

This is the most important file in your entire prep. The difference between someone who "knows Python" and someone who can solve problems isn't syntax — it's **how they think**.

---

## The 5-Step Framework

Every problem, from "reverse a string" to "design a URL shortener," follows this process:

### Step 1: UNDERSTAND (2-3 minutes)
Before writing a single character of code:

- **Restate the problem in your own words** — if you can't, you don't understand it
- **Identify inputs and outputs** — what goes in, what comes out, what types?
- **Ask clarifying questions** — even to yourself:
  - Can the input be empty? Negative? Very large?
  - Are there duplicates?
  - Does order matter?
  - What should I return if there's no answer?

**Example**: "Write a function that finds the second largest number in a list"
- Input: a list of numbers
- Output: one number (the second largest)
- Questions: What if the list has fewer than 2 elements? What about duplicates — is `[5, 5, 3]`'s second largest `5` or `3`?

### Step 2: EXAMPLES (2-3 minutes)
Work through 2-3 examples BY HAND. Use paper or comments. Don't code yet.

```
Input: [3, 1, 4, 1, 5, 9]
Step by step: Sort → [1, 1, 3, 4, 5, 9] → Second from end → 5
Output: 5

Input: [5, 5, 5]
Hmm, all same. Is second largest 5? Or does "second largest" mean second unique?
Need to clarify!

Input: [7]
Only one element — should return None? Raise error?

Input: []
Empty — should return None? Raise error?
```

**This is where most people fail.** They skip examples and start coding a solution they haven't thought through.

### Step 3: APPROACH (2-3 minutes)
Now decide HOW to solve it. Think in plain English first:

**Option A**: Sort the list, return the second-to-last unique element.
- Simple, easy to code
- Time: O(n log n) for sorting

**Option B**: Track the two largest as we scan through once.
- More efficient
- Time: O(n), Space: O(1)

Pick the simpler approach first. You can optimize later.

### Step 4: CODE (5-10 minutes)
NOW write the code. Translate your approach step by step.

```python
def second_largest(nums):
    if len(nums) < 2:
        return None
    
    # Track two largest
    first = second = float('-inf')
    
    for num in nums:
        if num > first:
            second = first
            first = num
        elif num > second and num != first:
            second = num
    
    return second if second != float('-inf') else None
```

### Step 5: TEST (2-3 minutes)
Run your examples through the code mentally (or actually run them):

```python
second_largest([3, 1, 4, 1, 5, 9])  # → 5 ✓
second_largest([5, 5, 5])            # → None ✓
second_largest([7])                  # → None ✓
second_largest([])                   # → None ✓
second_largest([1, 2])               # → 1 ✓
```

---

## Common Thinking Patterns

When you see a problem, ask yourself: "Which pattern does this match?"

### Pattern 1: Transform Each Element
**Signal**: "For each item, do X and return the results"
**Approach**: Loop or list comprehension

```python
# Double each number
[x * 2 for x in nums]

# Extract first letter of each word
[word[0] for word in words]
```

### Pattern 2: Filter Elements  
**Signal**: "Keep only items that satisfy condition"
**Approach**: List comprehension with `if`, or `filter()`

```python
# Keep only even numbers
[x for x in nums if x % 2 == 0]

# Keep only words longer than 3 characters
[w for w in words if len(w) > 3]
```

### Pattern 3: Accumulate / Reduce
**Signal**: "Combine all elements into a single result"
**Approach**: Loop with an accumulator variable

```python
# Sum of all numbers
total = 0
for num in nums:
    total += num

# Build a string from a list
result = ""
for char in chars:
    result += char
```

### Pattern 4: Find / Search
**Signal**: "Find the first/any/all elements that match"
**Approach**: Loop with early return, or `any()`/`all()`

```python
# Find first negative number
for num in nums:
    if num < 0:
        return num
return None
```

### Pattern 5: Compare Adjacent / Pairs
**Signal**: "Compare elements with their neighbors"
**Approach**: Loop with index, or `zip(list, list[1:])`

```python
# Check if list is sorted
for i in range(len(nums) - 1):
    if nums[i] > nums[i + 1]:
        return False
return True

# Equivalent with zip:
all(a <= b for a, b in zip(nums, nums[1:]))
```

### Pattern 6: Build Up Incrementally
**Signal**: "Construct a result piece by piece"  
**Approach**: Start with empty result, add to it in a loop

```python
# Group words by first letter
groups = {}
for word in words:
    first = word[0]
    if first not in groups:
        groups[first] = []
    groups[first].append(word)
```

### Pattern 7: Recursion
**Signal**: "The problem can be broken into smaller versions of itself"
**Approach**: Base case + recursive case

```python
# Factorial: n! = n × (n-1)!
def factorial(n):
    if n <= 1:        # Base case
        return 1
    return n * factorial(n - 1)  # Recursive case
```

**The recursion template**:
```python
def solve(problem):
    # 1. Base case — smallest possible input
    if is_trivial(problem):
        return trivial_answer
    
    # 2. Break down — make the problem smaller
    smaller = make_smaller(problem)
    
    # 3. Recurse — solve the smaller version
    sub_result = solve(smaller)
    
    # 4. Combine — build the answer from sub-result
    return combine(sub_result, problem)
```

---

## The #1 Mistake

**Jumping to code before thinking.**

If you catch yourself typing code within 30 seconds of reading a problem — STOP. You're guessing, not solving. Force yourself through Steps 1-3 first, even if it feels slow. With practice, this becomes fast and automatic. Without it, you'll write buggy code that you then spend 10 minutes debugging.

---

## How to Practice

1. **Read the problem** — understand it fully
2. **Close the hints** — try the 5-step process yourself
3. **Write your solution** — even if it's ugly, finish it
4. **Compare with the solution** — don't just check "right/wrong," compare the APPROACH
5. **If you got stuck** — identify which STEP you got stuck on (understanding? approach? coding?)
6. **Redo problems** — if you needed hints, redo the same problem tomorrow without looking
