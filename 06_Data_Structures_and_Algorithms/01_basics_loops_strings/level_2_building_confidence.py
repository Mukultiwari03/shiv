"""
Level 2: Building Confidence
==============================

Each problem maps to a PATTERN from how_to_think.md.
Identify the pattern BEFORE coding.

Same rules: Understand → Examples → Approach → Code → Test
"""


# ============================================================
# PROBLEM 1: Rotate a List [Pattern: Transform]
# ============================================================
"""
Rotate a list to the right by k positions.
    rotate([1, 2, 3, 4, 5], 2) → [4, 5, 1, 2, 3]
    rotate([1, 2, 3], 4) → [3, 1, 2]  (k > length)
"""

def rotate(lst, k):
    if not lst:
        return []
        
    n = len(lst)
    new_lst = [None] * n  # Pre-allocate a list of the same size
    
    for idx, value in enumerate(lst):
        # Calculate new position using the actual index 'idx'
        new_pos = (idx + k) % n
        new_lst[new_pos] = value
        
    return new_lst


assert rotate([1, 2, 3, 4, 5], 2) == [4, 5, 1, 2, 3]
assert rotate([1, 2, 3], 3) == [1, 2, 3]
assert rotate([], 5) == []


# ============================================================
# PROBLEM 2: Most Frequent Element [Pattern: Accumulate]
# ============================================================
"""
Return the element that appears most frequently.
    most_frequent([1, 2, 3, 2, 2, 1]) → 2
HINT: First count (dict), then find max.
"""

def most_frequent(lst):
    count = {}
    for i in lst:
        count[i] = count.get(i, 0) + 1
    return max(count, key=count.get)


assert most_frequent([1, 2, 3, 2, 2, 1]) == 2
assert most_frequent(["a", "b", "a"]) == "a"


# ============================================================
# PROBLEM 3: Is Anagram [Pattern: Compare/Transform]
# ============================================================
"""
Check if two strings are anagrams. Case-insensitive, ignore spaces.
    is_anagram("listen", "silent") → True
    is_anagram("Astronomer", "Moon starer") → True
"""

def is_anagram(s1, s2):
    # 1. Clean strings: remove spaces and lowercase
    clean1 = "".join(s1.lower().split())
    clean2 = "".join(s2.lower().split())
    
    # 2. Sort and compare
    # sorted() returns a list of characters in order
    return sorted(clean1) == sorted(clean2)


assert is_anagram("listen", "silent") == True
assert is_anagram("Hello", "World") == False
assert is_anagram("Astronomer", "Moon starer") == True


# ============================================================
# PROBLEM 4: Chunk a List [Pattern: Build Up]
# ============================================================
"""
Split a list into chunks of size n. Last chunk may be smaller.
    chunk([1, 2, 3, 4, 5], 2) → [[1, 2], [3, 4], [5]]
"""

def chunk(lst, n):
    full_lst = []
    curr_lst = []
    for i in lst:
        if len(curr_lst) != n:
            curr_lst.append(i)
        else:
            full_lst.append(curr_lst)
            curr_lst = []
            curr_lst.append(i)
    if curr_lst:
        full_lst.append(curr_lst)

    return full_lst

assert chunk([1, 2, 3, 4, 5], 2) == [[1, 2], [3, 4], [5]]
assert chunk([1, 2, 3], 5) == [[1, 2, 3]]
assert chunk([], 3) == []


# ============================================================
# PROBLEM 5: Merge Two Sorted Lists [Pattern: Two Pointer]
# ============================================================
"""
Merge two sorted lists into one sorted list. Don't concatenate+sort.
    merge_sorted([1, 4, 5], [2, 3, 6]) → [1, 2, 3, 4, 5, 6]
HINT: Two pointers, compare values, take the smaller.
"""

def merge_sorted(lst1, lst2):
    new_lst = []
    curr = 0
    next = 0

    while curr < len(lst1) and next < len(lst2):
        if lst1[curr] < lst2[next]:
            new_lst.append(lst1[curr])
            curr += 1
        else:
            new_lst.append(lst2[next])
            next += 1

        # Step 2: Add the leftovers!
    new_lst.extend(lst1[curr:])
    new_lst.extend(lst2[next:])
    
    return new_lst

    return new_lst

assert merge_sorted([1, 3, 5], [2, 4, 6]) == [1, 2, 3, 4, 5, 6]
assert merge_sorted([1, 2, 3], []) == [1, 2, 3]
assert merge_sorted([1, 1], [1, 1]) == [1, 1, 1, 1]


# ============================================================
# PROBLEM 6: Matrix Transpose [Pattern: Nested Transform]
# ============================================================
"""
Transpose a matrix (rows become columns).
    transpose([[1, 2, 3], [4, 5, 6]]) → [[1, 4], [2, 5], [3, 6]]
HINT: Element at [i][j] goes to [j][i].
"""

def transpose(matrix):
    rows = len(matrix)
    cols = len(matrix[0])
    
    # 1. Create a NEW matrix with 'cols' rows and 'rows' columns
    # This is the "Build Up" pattern
    new_matrix = []
    for c in range(cols):
        new_row = []
        for r in range(rows):
            # 2. Grab the element and put it in its new home
            new_row.append(matrix[r][c])
        new_matrix.append(new_row)
            
    return new_matrix


assert transpose([[1, 2, 3], [4, 5, 6]]) == [[1, 4], [2, 5], [3, 6]]
assert transpose([[1]]) == [[1]]


# ============================================================
# PROBLEM 7: String Compression [Pattern: Accumulate + Adjacent]
# ============================================================
"""
Compress consecutive duplicates: "aabcccccaaa" → "a2b1c5a3"
If compressed isn't shorter, return original.
    compress("abc") → "abc" (a1b1c1 is longer)
"""

def compress(s):
    combined = ""
    count = 1

    if s == "":
        return ""

    for i in range(len(s) - 1):
        if s[i] == s[i + 1]:
            count += 1
        else:
            combined = combined + s[i] + f"{count}"
            count = 1
    if count:
        combined = combined + s[-1] + f"{count}"

    if len(combined) < len(s):
        return combined
    else:
        return s



assert compress("aabcccccaaa") == "a2b1c5a3"
assert compress("abc") == "abc"
assert compress("") == ""


# ============================================================
# PROBLEM 8: Valid Parentheses [Pattern: Stack]
# ============================================================
"""
Check if brackets are valid: (), [], {} must match correctly.
    is_valid("()[]{}") → True
    is_valid("([)]") → False
    is_valid("{[]}") → True
HINT: Use a list as a stack. Push opening, pop on closing.
"""

def is_valid(s):
    stack = []
    pairs = {")": "(", "]": "[", "}": "{"}
    
    for char in s:
        if char in "([{":
            # 1. Opening bracket? Push it.
            stack.append(char)
        elif char in pairs:
            # 2. Closing bracket? 
            # First, check if stack is empty OR if it doesn't match
            if not stack or stack[-1] != pairs[char]:
                return False
            # 3. Match found! Pop it.
            stack.pop()
            
    return len(stack) == 0


assert is_valid("()[]{}") == True
assert is_valid("(]") == False
assert is_valid("{[]}") == True
assert is_valid("(") == False


# ============================================================
# PROBLEM 9: Deep Flatten [Pattern: Recursion]
# ============================================================
"""
Flatten arbitrarily nested lists.
    deep_flatten([1, [2, [3, [4]], 5]]) → [1, 2, 3, 4, 5]

This is the same PATTERN as deepcopy! Apply the recursion template:
- Base case: if item is not a list, it's a leaf
- Recursive case: if item is a list, recurse into it
"""

def deep_flatten(lst):
    final_lst = []
    for i in lst:
        if isinstance(i, list):
            temp_lst = deep_flatten(i)
            final_lst.extend(temp_lst)
        else:
            final_lst.append(i)
    return final_lst

assert deep_flatten([1, [2, [3, [4]], 5]]) == [1, 2, 3, 4, 5]
assert deep_flatten([]) == []
assert deep_flatten([1, 2, 3]) == [1, 2, 3]


# ============================================================
# PROBLEM 10: Word Frequency Counter [Pattern: Accumulate + Transform]
# ============================================================
"""
Count word frequencies in a sentence. Case-insensitive.
    word_freq("the cat sat on the mat") → {"the": 2, "cat": 1, "sat": 1, "on": 1, "mat": 1}
"""

def word_freq(sentence):
    final_dict = {}
    for i in sentence.lower().split():
        final_dict[i] = final_dict.get(i, 0) + 1
    return final_dict

result = word_freq("The cat sat on the mat")
assert result["the"] == 2
assert result["cat"] == 1


# ============================================================
if __name__ == "__main__":
    print("Level 2: Identify the pattern BEFORE coding!")
    print("Uncomment tests as you solve each problem.")
