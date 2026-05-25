"""
Recursion — From Fear to Fluency
==================================

If deepcopy felt hard, this module will fix that.

The secret: EVERY recursive function has the SAME structure.
Once you see it, recursion stops being scary.

THE TEMPLATE:
    def solve(problem):
        # 1. BASE CASE: the smallest/simplest input
        if problem is trivial:
            return trivial_answer
        
        # 2. MAKE SMALLER: reduce the problem
        smaller_problem = shrink(problem)
        
        # 3. RECURSE: trust that it works on smaller input
        sub_answer = solve(smaller_problem)
        
        # 4. COMBINE: build answer from sub_answer
        return combine(sub_answer)

That's it. Every recursive function fits this template.
"""


# ============================================================
# PROBLEM 1: Factorial (the "hello world" of recursion)
# ============================================================
"""
factorial(5) → 120  (5 × 4 × 3 × 2 × 1)
factorial(0) → 1
factorial(1) → 1

Apply the template:
- BASE CASE: factorial(0) = 1
- MAKE SMALLER: n → n-1
- RECURSE: factorial(n-1)
- COMBINE: n * factorial(n-1)
"""

def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)

assert factorial(5) == 120
assert factorial(0) == 1
assert factorial(1) == 1
print("Problem 1: PASSED")


# ============================================================
# PROBLEM 2: Sum of a List (recursively)
# ============================================================
"""
recursive_sum([1, 2, 3, 4]) → 10
recursive_sum([]) → 0

Apply the template:
- BASE CASE: empty list → 0
- MAKE SMALLER: remove the first element
- RECURSE: recursive_sum(rest of list)
- COMBINE: first element + recursive result
"""

def recursive_sum(lst):
    if len(lst) == 0:
        return 0
    else:
        return lst.pop(0) + recursive_sum(lst)

assert recursive_sum([1, 2, 3, 4]) == 10
assert recursive_sum([]) == 0
assert recursive_sum([5]) == 5
print("Problem 2: PASSED")


# ============================================================
# PROBLEM 3: Count Items in a List (recursively)
# ============================================================
"""
recursive_len([1, 2, 3]) → 3
recursive_len([]) → 0

YOU figure out the template parts this time:
- BASE CASE: empty list
- MAKE SMALLER: count exluding the current first item
- RECURSE: recursive_len(rest_of_list)
- COMBINE: 
"""

def recursive_len(lst):
    if len(lst) == 0:
        return 0
    else:
        lst.pop()
        return 1 + recursive_len(lst)

assert recursive_len([1, 2, 3]) == 3
assert recursive_len([]) == 0
assert recursive_len([1]) == 1
print("Problem 3: PASSED")


# ============================================================
# PROBLEM 4: Reverse a String (recursively)
# ============================================================
"""
recursive_reverse("hello") → "olleh"
recursive_reverse("") → ""
recursive_reverse("a") → "a"

THINK: If I know the reverse of "ello", how do I get the reverse of "hello"?
"""

def recursive_reverse(s):
    if len(s) == 0:
        return ""
    else:
        reverse = s[0:-1]
        return s[-1] + recursive_reverse(reverse)

assert recursive_reverse("hello") == "olleh"
assert recursive_reverse("") == ""
assert recursive_reverse("a") == "a"
print("Problem 4: PASSED")


# ============================================================
# PROBLEM 5: Power (x^n)
# ============================================================
"""
power(2, 3) → 8   (2 × 2 × 2)
power(5, 0) → 1
power(3, 1) → 3

THINK: x^n = x × x^(n-1)
"""

def power(x, n):
    if n == 0:
        return 1
    else:
        return x * power(x,(n-1))

assert power(2, 3) == 8
assert power(5, 0) == 1
assert power(3, 1) == 3
assert power(2, 10) == 1024
print("Problem 5: PASSED")


# ============================================================
# PROBLEM 6: Fibonacci
# ============================================================
"""
fib(0) → 0
fib(1) → 1
fib(5) → 5
fib(10) → 55

Pattern: fib(n) = fib(n-1) + fib(n-2)
This has TWO base cases and TWO recursive calls.
"""

def fib(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fib(n-1) + fib(n-2)

assert fib(0) == 0
assert fib(1) == 1
assert fib(5) == 5
assert fib(10) == 55
print("Problem 6: PASSED")


# ============================================================
# PROBLEM 7: Check if Palindrome (recursively)
# ============================================================
"""
is_palindrome("racecar") → True
is_palindrome("hello") → False
is_palindrome("aba") → True
is_palindrome("a") → True
is_palindrome("") → True

THINK: A string is a palindrome if:
  - First char == last char, AND
  - The middle part is also a palindrome
"""

def is_palindrome(s):
    if len(s) == 0 or len(s) == 1:
        return True
    elif s[0] == s[-1]:
        reverse = s[1:-1]
        return is_palindrome(reverse)
    else:
        return False

assert is_palindrome("racecar") == True
assert is_palindrome("hello") == False
assert is_palindrome("a") == True
assert is_palindrome("") == True
print("Problem 7: PASSED")


# ============================================================
# PROBLEM 8: Flatten Nested List (recursively)
# ============================================================
"""
flatten([1, [2, [3, 4], 5], 6]) → [1, 2, 3, 4, 5, 6]
flatten([]) → []
flatten([1, 2, 3]) → [1, 2, 3]

This IS the deepcopy pattern! For each item:
- If it's a list → recurse into it
- If it's not → it's a leaf, add it to result
"""

def flatten(lst):
    final_lst = []
    if len(lst) == 0:
        return []
    for i in lst:
        if isinstance(i, list):
            temp_lst = flatten(i)
            final_lst.extend(temp_lst)
        else:
            final_lst.append(i)
    return final_lst

assert flatten([1, [2, [3, 4], 5], 6]) == [1, 2, 3, 4, 5, 6]
assert flatten([]) == []
assert flatten([1, 2, 3]) == [1, 2, 3]
print("Problem 8: PASSED")


# ============================================================
# PROBLEM 9: Deep Copy (the one you struggled with!)
# ============================================================
"""
Now that you've done 8 recursive problems, try deepcopy again.
Handle: int, float, str, bool, None, list, dict, tuple

deep_copy([1, [2, 3], {"a": [4]}]) should return a completely
independent copy where modifying the copy doesn't affect original.
"""

def deep_copy(obj):
    # YOUR CODE HERE
    # Template:
    # BASE CASE: primitives (int, str, etc.) → return as-is
    # RECURSIVE CASE: containers (list, dict, tuple) → 
    #   create new container, recurse into each element

    if isinstance(obj, int) or isinstance(obj, str) or isinstance(obj, float) or isinstance(obj, bool) or obj is None:
        return obj
    if isinstance(obj, list):
        return [deep_copy(i) for i in obj]
    if isinstance(obj, dict):
        return {deep_copy(k): deep_copy(v) for k, v in obj.items()}
    if isinstance(obj, tuple):
        return tuple(deep_copy(i) for i in obj)

        
# Test 1: Primitives (Base Case)
assert deep_copy(5) == 5
assert deep_copy("hello world") == "hello world"
assert deep_copy(False) is False
assert deep_copy(None) is None
print("✓ Test 1: Primitives passed")

# Test 2: Empty List
assert deep_copy([]) == []
print("✓ Test 2: Empty list passed")

# Test 3: Simple List (1D)
# Note: This will likely fail with your current code returning None from .append()
assert deep_copy([1, 2, 3]) == [1, 2, 3]

# Test 4: Nested List (Independence Check)
orig_list = [1, [2, 3]]
copy_list = deep_copy(orig_list)
assert copy_list == [1, [2, 3]]
copy_list[1].append(4)
assert orig_list == [1, [2, 3]] 

# Test 5: Dictionary
orig_dict = {"a": 1, "b": 2}
copy_dict = deep_copy(orig_dict)
assert copy_dict == {"a": 1, "b": 2}

# Test 6: Nested Dictionary
orig_nested_dict = {"a": {"b": 1}}
copy_nested_dict = deep_copy(orig_nested_dict)
copy_nested_dict["a"]["b"] = 99
assert orig_nested_dict["a"]["b"] == 1

# Test 7: Tuple
assert deep_copy((1, 2)) == (1, 2)



# ============================================================
# PROBLEM 10: Sum of Nested List
# ============================================================
"""
Sum all numbers in an arbitrarily nested list.
    nested_sum([1, [2, [3, 4], 5], 6]) → 21
    nested_sum([]) → 0
    nested_sum([[[[1]]]]) → 1

Uses the SAME pattern as flatten, but accumulates instead of collecting.
"""

def nested_sum(lst):
    total = 0
    # if len(lst) == 0:
    #     return 0
    for i in lst:
        if isinstance(i, list):
            total += nested_sum(i)
        else:
            total += i
    return total

assert nested_sum([1, [2, [3, 4], 5], 6]) == 21
assert nested_sum([]) == 0
assert nested_sum([[[[1]]]]) == 1
print("Problem 10: PASSED")


# ============================================================
if __name__ == "__main__":
    print("=" * 50)
    print("Recursion has ONE template. Once you see it,")
    print("every recursive problem becomes fill-in-the-blanks.")
    print()
    print("If you solved 1-8 without hints, problem 9 (deepcopy)")
    print("should now feel obvious. If it doesn't, redo 1-8.")
    print("=" * 50)
