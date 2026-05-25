"""
Module 03: Searching & Efficiency
==================================

Now we focus on two things:
1. Solving the problem.
2. Proving it's the MOST EFFICIENT solution.

For every problem, write the Time and Space complexity in the comments.
"""

# ============================================================
# PROBLEM 1: Binary Search
# ============================================================
"""
Given a SORTED list and a target, find the index of the target.
If it doesn't exist, return -1.

You MUST do this in O(log n) time. No linear scanning!

HINT: Look at the middle. Is target higher or lower? 
Shrink your search range and repeat.
"""

# TIME: O(log n)
# SPACE: O(1)

def binary_search(nums, target):
    if len(nums) == 0:
        return -1
    
    # Use // for integer division
    new_nums = nums[0:(len(nums)//2)]
    rest_nums = nums[len(new_nums):]

    # Safety: If left side is empty, check the first element of the right side
    if not new_nums:
        if rest_nums[0] == target:
            return 0
        return -1

    # Use the last element of the left side as our pivot
    pivot_val = new_nums[-1]
    pivot_idx = len(new_nums) - 1

    if target == pivot_val:
        return pivot_idx
    elif target < pivot_val:
        # Search left half
        return binary_search(new_nums, target)
    else:
        # Search right half
        res = binary_search(rest_nums, target)
        if res == -1:
            return -1
        # Add the length of the skipped left half to the result index
        return len(new_nums) + res


# TESTS:
assert binary_search([1, 2, 3, 4, 5, 6], 4) == 3
assert binary_search([10, 20, 30, 40], 25) == -1
assert binary_search([5], 5) == 0
assert binary_search([], 10) == -1


# ============================================================
# PROBLEM 2: Two Sum (Optimized)
# ============================================================
"""
You did Two Sum in O(n^2) before. Now do it in O(n) time.
You can use extra space (a dictionary).

HINT: As you iterate, store each number's INDEX in a dictionary.
Before adding, check if the complement is already in the dictionary.
"""

# TIME: O(n)
# SPACE: O(n)

def two_sum_fast(nums, target):
    indexes = {}
    for i, j in enumerate(nums):
        complement = target - j

        if complement in indexes:
            return tuple((indexes[complement], i))
        else:
            indexes[j] = i

    
# TESTS:
assert two_sum_fast([2, 7, 11, 15], 9) == (0, 1)
assert two_sum_fast([3, 2, 4], 6) == (1, 2)


# ============================================================
# PROBLEM 3: Find First Duplicate
# ============================================================
"""
Given a list, find the first element that repeats.
Return None if all are unique.

Example: [2, 1, 3, 5, 3, 2] → 3 (because 3 repeats first)

Challenge: Do it in O(n) time.
"""

# TIME: O(n)
# SPACE: O(n)

def first_duplicate(nums):
    seen = set()
    for i in nums:
        if i in seen:
            return i
        else:
            seen.add(i)

# TESTS:
assert first_duplicate([2, 1, 3, 5, 3, 2]) == 3
assert first_duplicate([1, 2, 3, 4, 5]) == None


# ============================================================
# PROBLEM 4: Intersection of Two Lists
# ============================================================
"""
Find common elements between two lists. Return as a set.

Challenge: If lists are size N and M, do it in O(N + M) time.
(A nested loop would be O(N * M) - too slow!)
"""

# TIME: O(N + M)
# SPACE: O(min(N, M))

def intersection(lst1, lst2):
    seen = set(lst1)
    result = set()
    for i in lst2:
        if i in seen:
            result.add(i)
    return result

# TESTS:
assert intersection([1, 2, 3], [2, 3, 4]) == {2, 3}
assert intersection([1, 1], [1, 2]) == {1}


# ============================================================
# PROBLEM 5: Move Zeroes
# ============================================================
"""
Given a list, move all 0's to the end while maintaining 
the relative order of the non-zero elements.

Do this IN-PLACE (modify the original list, don't return a new one).

Example: [0, 1, 0, 3, 12] → [1, 3, 12, 0, 0]

Challenge: O(n) time and O(1) space.
"""

# TIME: O(n)
# SPACE: O(1)

def move_zeroes(nums):
    write_pos = 0
    
    for i in range(len(nums)):
        if nums[i] != 0:
            # Swap the non-zero element to the write_pos
            nums[write_pos], nums[i] = nums[i], nums[write_pos]
            write_pos += 1

# TESTS:
# lst = [0, 1, 0, 3, 12]
# move_zeroes(lst)
# assert lst == [1, 3, 12, 0, 0]


if __name__ == "__main__":
    print("Efficiency is the difference between a Junior and a Senior dev.")
    print("Focus on using sets/dicts to turn O(n^2) into O(n).")
