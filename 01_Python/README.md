# Python — Deep Interview Prep

This is not a syntax reference. This is about understanding **why** Python works the way it does.

## Module Order

| # | Module | Core Question It Answers |
|---|--------|--------------------------|
| 01 | How Python Actually Works | What happens when you run `python script.py`? |
| 02 | Objects, Names, and Memory | Why does `a = b` not copy a list? |
| 03 | Functions Deep Dive | Closures, decorators, `*args/**kwargs` — why do they exist? |
| 04 | Iteration Protocol & Generators | Why are generators memory-efficient? |
| 05 | OOP — Beyond Classes | MRO, descriptors, metaclasses — how does Python's OOP actually work? |
| 06 | Concurrency & Parallelism | GIL, threading, asyncio, multiprocessing — when to use what? |
| 07 | Error Handling & Context Managers | Why `with` exists and how to build your own |
| 08 | Data Structures Internals | How are dicts O(1)? How do sets work? |
| 09 | Pythonic Patterns & Idioms | List comprehensions, EAFP vs LBYL, and writing "real" Python |
| 10 | Testing & Debugging | unittest, pytest, pdb — how to think about testing |

## How to Use Each Module

1. **Read the theory** (`theory.md`) — understand the WHY
2. **Run the exercises** (`exercises.py`) — type them yourself, predict output BEFORE running
3. **Do the challenges** (`challenges.py`) — apply what you learned
4. **Review the gotchas** (`gotchas.md`) — common interview traps

> **Rule**: Never copy-paste. Type everything. Predict before you run. If you're surprised by the output, you found a gap — that's gold.
