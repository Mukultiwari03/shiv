"""
Module 02: Objects, Names, and Memory — Challenges
====================================================

Harder problems. Try WITHOUT looking at theory.
"""

# ============================================================
# CHALLENGE 1: The Nested Mutation Maze
# ============================================================
print("--- Challenge 1: Nested Mutation ---")

a = [1, [2, 3], {"x": [4, 5]}]
b = a.copy()
c = a

b[0] = 99
b[1].append(99)
b[2]["x"].append(99)
c[1] = [0, 0, 0]

print(f"a = {a}")  # PREDICT
print(f"b = {b}")  # PREDICT
print(f"c = {c}")  # PREDICT


# ============================================================
# CHALLENGE 2: The += vs + Distinction
# ============================================================
print("\n--- Challenge 2: += vs + ---")

def func_a(x):
    x = x + [4]   # Creates NEW list
    return x

def func_b(x):
    x += [4]       # Mutates IN PLACE (__iadd__)
    return x

test1 = [1, 2, 3]
func_a(test1)
print(f"after func_a: {test1}")  # PREDICT

test2 = [1, 2, 3]
func_b(test2)
print(f"after func_b: {test2}")  # PREDICT


# ============================================================
# CHALLENGE 3: Tuple += Paradox
# ============================================================
print("\n--- Challenge 3: Tuple += Paradox ---")

t = ([1, 2], [3, 4])
try:
    t[0] += [100]
except TypeError as e:
    print(f"Error: {e}")
    print(f"But t = {t}")  # Did t[0] change despite the error? PREDICT

# WHY: t[0] += [100] does TWO things:
# 1. t[0].__iadd__([100]) — mutates the list (SUCCEEDS)
# 2. t[0] = result — assignment to tuple (FAILS with TypeError)
# Both step 1 AND the error happen!


# ============================================================
# CHALLENGE 4: Implement deep_copy
# ============================================================
print("\n--- Challenge 4: Implement deep_copy ---")

def my_deep_copy(obj):
    """Deep copy handling: int, float, str, bool, None, list, dict, tuple"""
    # YOUR CODE HERE (use recursion)
    if isinstance(obj, list):
        new_list = []
        for i in obj:
            new_list.append(my_deep_copy(i))
        return new_list
    elif isinstance(obj, dict):
        new_dict = {}
        for k,v in obj.items():
            new_dict[k] = my_deep_copy(v)
        return new_dict
    elif isinstance(obj, tuple):
        return tuple(my_deep_copy(i) for i in obj)
    else:
        return obj

# Test:
orig = [1, [2, [3]], {"a": [4]}]
dc = my_deep_copy(orig)
if dc is not None:
    dc[1][1].append(99)
    dc[2]["a"].append(99)
    print(f"orig unchanged: {orig}")  # Should be [1, [2, [3]], {'a': [4]}]
    print(f"deep copy modified: {dc}")


# ============================================================
# CHALLENGE 5: Default Argument Deep Cut
# ============================================================
print("\n--- Challenge 5: Default Argument ---")

def make_row(item, row=[]):
    row.append(item)
    return row

r1 = make_row("a")
r2 = make_row("b")
r3 = make_row("c", [])
r4 = make_row("d")

print(f"r1={r1}, r2={r2}, r3={r3}, r4={r4}")  # PREDICT all four
print(f"r1 is r2: {r1 is r2}")  # PREDICT
print(f"r1 is r3: {r1 is r3}")  # PREDICT


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("Key takeaway: += vs + behave differently for mutables!")
    print("=" * 60)
