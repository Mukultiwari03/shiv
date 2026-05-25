"""
Level 1: Warm-Up Problems
===========================

These are INTENTIONALLY easy. The goal is NOT to challenge you — it's to
practice the 5-step framework on simple problems so it becomes automatic.

For EACH problem:
1. Read the description
2. Write your understanding + examples in the comments
3. Write your approach in plain English
4. Code it
5. Test with the provided test cases + your own edge cases

DO NOT skip the comments. That's where the real practice is.
"""


# ============================================================
# PROBLEM 1: Sum of a List
# ============================================================
"""
Write a function that returns the sum of all numbers in a list.
Do NOT use the built-in sum().

Example:
    my_sum([1, 2, 3, 4]) → 10
    my_sum([]) → 0
    my_sum([-1, 1]) → 0
"""

# YOUR UNDERSTANDING:
# Input: list
# Output: integer
# Edge cases: empty list

# YOUR APPROACH (plain English): 
# Initialize a variable total to 0.
# Iterate through the list.
# Add each number to total.
# Return total.

def my_sum(nums):

    total = 0
    for num in nums:
        total += num
    return total

# TESTS (uncomment when ready):
# assert my_sum([1, 2, 3, 4]) == 10
# assert my_sum([]) == 0
# assert my_sum([-1, 1]) == 0
# assert my_sum([5]) == 5
# print("Problem 1: PASSED")


# ============================================================
# PROBLEM 2: Find the Maximum
# ============================================================
"""
Write a function that returns the largest number in a list.
Do NOT use the built-in max().

Example:
    my_max([3, 1, 4, 1, 5]) → 5
    my_max([-10, -20, -5]) → -5
    my_max([42]) → 42
"""

# YOUR UNDERSTANDING: Given a list, need to find the largest number in that list. Output a single integer
#
# YOUR APPROACH: Iterate trhough the list and keep track of the largest number
#

def my_max(nums):
    # YOUR CODE HERE
    largest = float('-inf')
    for num in nums:
        if num > largest:
            largest = num
    return largest

# TESTS:
# assert my_max([3, 1, 4, 1, 5]) == 5
# assert my_max([-10, -20, -5]) == -5
# assert my_max([42]) == 42
# print("Problem 2: PASSED")


# ============================================================
# PROBLEM 3: Count Occurrences
# ============================================================
"""
Write a function that counts how many times a target appears in a list.
Do NOT use .count().

Example:
    count([1, 2, 3, 2, 2], 2) → 3
    count([1, 2, 3], 5) → 0
    count([], 1) → 0
"""

# YOUR UNDERSTANDING: given a list and an integer, 
# need to check how many times that integer appears in that list
# Output -> Integer
# YOUR APPROACH: Initialise a count variable to 0. 
# Iterate through the list and for every time list element is equal to target, 
# increase the count
#

def count(lst, target):
    counter = 0
    for i in lst:
        if i == target:
            counter += 1
    return counter

# TESTS:
# assert count([1, 2, 3, 2, 2], 2) == 3
# assert count([1, 2, 3], 5) == 0
# assert count([], 1) == 0
# print("Problem 3: PASSED")


# ============================================================
# PROBLEM 4: Reverse a String
# ============================================================
"""
Write a function that reverses a string.
Do NOT use slicing [::-1] or reversed().

Example:
    reverse("hello") → "olleh"
    reverse("a") → "a"
    reverse("") → ""
"""

# YOUR UNDERSTANDING: given a string, need to reverse it
# Output: string
# YOUR APPROACH: keep track of an empty string
# Iterate on s string and add each element BEFORE the reversed string
#

def reverse(s):
    reversed= ""
    for i in s:
        reversed = i + reversed
    return reversed


# TESTS:
# assert reverse("hello") == "olleh"
# assert reverse("a") == "a"
# assert reverse("") == ""
# assert reverse("ab") == "ba"
# print("Problem 4: PASSED")


# ============================================================
# PROBLEM 5: Is Palindrome
# ============================================================
"""
Write a function that checks if a string is a palindrome
(reads the same forwards and backwards). Case-insensitive.

Example:
    is_palindrome("racecar") → True
    is_palindrome("Madam") → True
    is_palindrome("hello") → False
    is_palindrome("a") → True
    is_palindrome("") → True
"""

# YOUR UNDERSTANDING: need to check if original and reversed string is the same - case insensitive
# Output -> Boolean
# YOUR APPROACH: reverse the string like before, then check if original and reversed are same
#

def is_palindrome(s):
    reversed = ""
    s_lowered = s.lower()
    for i in s_lowered:
        reversed = i + reversed
    if reversed == s_lowered:
        return True
    return False


# TESTS:
# assert is_palindrome("racecar") == True
# assert is_palindrome("Madam") == True
# assert is_palindrome("hello") == False
# assert is_palindrome("a") == True
# assert is_palindrome("") == True
# print("Problem 5: PASSED")


# ============================================================
# PROBLEM 6: Remove Duplicates
# ============================================================
"""
Write a function that returns a new list with duplicates removed,
preserving the original order.

Example:
    remove_dupes([1, 2, 3, 2, 1, 4]) → [1, 2, 3, 4]
    remove_dupes([1, 1, 1]) → [1]
    remove_dupes([]) → []
"""

# YOUR UNDERSTANDING: given a list, need to remove all duplicates
# Input: List
# Output: List
# YOUR APPROACH: Initialise a new list and add current object into this new list if doesn't alreayd exist while iterating
# HINT: How do you track what you've already seen?
#

def remove_dupes(lst):
    unique_lst = []
    for i in lst:
        if i not in unique_lst:
            unique_lst.append(i)
    return unique_lst
# TESTS:
# assert remove_dupes([1, 2, 3, 2, 1, 4]) == [1, 2, 3, 4]
# assert remove_dupes([1, 1, 1]) == [1]
# assert remove_dupes([]) == []
# print("Problem 6: PASSED")


# ============================================================
# PROBLEM 7: FizzBuzz
# ============================================================
"""
Write a function that returns a list of strings for numbers 1 to n:
- "Fizz" for multiples of 3
- "Buzz" for multiples of 5
- "FizzBuzz" for multiples of both 3 and 5
- The number as a string otherwise

Example:
    fizzbuzz(5) → ["1", "2", "Fizz", "4", "Buzz"]
    fizzbuzz(15) → last element should be "FizzBuzz"
"""

# YOUR UNDERSTANDING: for a given number n, return a list with some num strings and some word strings based on multiples of 3 and 5
# Input: Int
# Output: List
# YOUR APPROACH: iterate through the list from 1 to n, 
# if i satisfies a condition, add that particual string, else just add a number string
#

def fizzbuzz(n):
    lst = []
    for i in range(1, n + 1):
        if i % 3 == 0 and i % 5 == 0:
            lst.append("FizzBuzz")
        elif i % 3 == 0:
            lst.append("Fizz")
        elif i % 5 == 0:
            lst.append("Buzz")
        else:
            lst.append(f"{i}")
    return lst

# TESTS:
# result = fizzbuzz(15)
# assert result[0] == "1"
# assert result[1] == "2"
# assert result[2] == "Fizz"
# assert result[4] == "Buzz"
# assert result[14] == "FizzBuzz"
# assert len(result) == 15
# print("Problem 7: PASSED")


# ============================================================
# PROBLEM 8: Two Sum
# ============================================================
"""
Given a list of numbers and a target, return the INDICES of two numbers
that add up to the target. Assume exactly one solution exists.

Example:
    two_sum([2, 7, 11, 15], 9) → (0, 1)  because nums[0] + nums[1] = 9
    two_sum([3, 2, 4], 6) → (1, 2)
"""

# YOUR UNDERSTANDING: given a list and a target integer, need to find 2 numbers from the list that add up to the target and return the indices
#
# YOUR APPROACH: Iterate through the list and for each number, check where a compliment exists.
# Think about: what are you looking for at each step?
# If you're at number X and target is T, what number do you NEED?
# How can you quickly check if that number exists?
#

def two_sum(nums, target):
    for i in range(len(nums)):
        complement = target - nums[i]
        if complement in nums:
            complement_idx = nums.index(complement)
            if complement_idx != i: # Make sure indices are different!
                return (i, complement_idx)


# Tried to this in 1 for loop instead of 2 loops. Not sure if this is faster or no

# TESTS:
# assert two_sum([2, 7, 11, 15], 9) == (0, 1)
# assert two_sum([3, 2, 4], 6) == (1, 2)
# print("Problem 8: PASSED")


# ============================================================
# PROBLEM 9: Group Words by Length
# ============================================================
"""
Given a list of words, return a dictionary grouping them by length.

Example:
    group_by_length(["hi", "hey", "hello", "yo", "sup"]) →
    {2: ["hi", "yo"], 3: ["hey", "sup"], 5: ["hello"]}
"""

# YOUR UNDERSTANDING: given a list of strings, group these strings based on their length into a dictionary with key being the length
# Input: List
# Output: Dict
# YOUR APPROACH: initialising a dict, iterating through the list, adding each element into the dict corresponding to the correct key
# HINT: Pattern 6 from the framework — "Build Up Incrementally"
#

def group_by_length(words):
    diction = {}
    for i in words:
        length = len(i)
        if length not in diction:
            diction[length] = [i]
        else:
            diction[length].append(i)
    return diction

# TESTS:
# result = group_by_length(["hi", "hey", "hello", "yo", "sup"])
# assert result[2] == ["hi", "yo"]
# assert result[3] == ["hey", "sup"]
# assert result[5] == ["hello"]
# print("Problem 9: PASSED")


# ============================================================
# PROBLEM 10: Flatten One Level
# ============================================================
"""
Given a list of lists, flatten it by one level.
(Don't worry about deeply nested lists — that's a later problem)

Example:
    flatten([[1, 2], [3, 4], [5]]) → [1, 2, 3, 4, 5]
    flatten([[1], [], [2, 3]]) → [1, 2, 3]
    flatten([]) → []
"""

# YOUR UNDERSTANDING: given a list of lists, tranform it into a list of integers, 
# bring out the inner list items out into the main list
# Input: List of lists
# Output: List of integer
# YOUR APPROACH: iterate through a nested loop, and keep adding item to a new list
#

def flatten(lst_of_lsts):
    lst = []
    for i in lst_of_lsts:
        for j in i:
            lst.append(j)
    return lst

# TESTS:
assert flatten([[1, 2], [3, 4], [5]]) == [1, 2, 3, 4, 5]
assert flatten([[1], [], [2, 3]]) == [1, 2, 3]
assert flatten([]) == []
print("Problem 10: PASSED")


# ============================================================
if __name__ == "__main__":
    print("=" * 50)
    print("Uncomment the tests as you solve each problem.")
    print("Goal: solve all 10 with ZERO hints.")
    print("If you get stuck, re-read how_to_think.md")
    print("=" * 50)
