"""
Module 06: Concurrency & Parallelism — Exercises
==================================================

RULES: Predict → Type → Run → Understand surprises
NOTE: Some exercises involve timing — results may vary slightly.
"""
import threading
import time

# ============================================================
# EXERCISE 1: Basic Threading
# ============================================================
print("--- Exercise 1: Basic Threading ---")

def worker(name, delay):
    print(f"  {name} starting (thread: {threading.current_thread().name})")
    time.sleep(delay)
    print(f"  {name} done")

start = time.time()

t1 = threading.Thread(target=worker, args=("A", 1))
t2 = threading.Thread(target=worker, args=("B", 1))

t1.start()
t2.start()
t1.join()
t2.join()

elapsed = time.time() - start
print(f"Total time: {elapsed:.2f}s")  # PREDICT: ~1s or ~2s?


# ============================================================
# EXERCISE 2: Sequential vs Concurrent
# ============================================================
print("\n--- Exercise 2: Sequential vs Concurrent ---")

def fake_download(url, delay):
    time.sleep(delay)
    return f"Data from {url}"

# Sequential:
start = time.time()
r1 = fake_download("url1", 1)
r2 = fake_download("url2", 1)
r3 = fake_download("url3", 1)
seq_time = time.time() - start
print(f"Sequential: {seq_time:.2f}s")  # PREDICT:

# Concurrent with threads:
start = time.time()
threads = []
results = [None] * 3

def download_to(idx, url, delay):
    results[idx] = fake_download(url, delay)

for i, (url, d) in enumerate([("url1", 1), ("url2", 1), ("url3", 1)]):
    t = threading.Thread(target=download_to, args=(i, url, d))
    threads.append(t)
    t.start()

for t in threads:
    t.join()

conc_time = time.time() - start
print(f"Concurrent: {conc_time:.2f}s")  # PREDICT:
print(f"Speedup: {seq_time/conc_time:.1f}x")


# ============================================================
# EXERCISE 3: Race Condition
# ============================================================
print("\n--- Exercise 3: Race Condition ---")

counter = 0

def increment_unsafe():
    global counter
    for _ in range(100_000):
        counter += 1

t1 = threading.Thread(target=increment_unsafe)
t2 = threading.Thread(target=increment_unsafe)
t1.start(); t2.start()
t1.join(); t2.join()

print(f"Expected: 200000")
print(f"Actual: {counter}")  # PREDICT: Is it 200000?
print(f"Race condition: {counter != 200000}")


# ============================================================
# EXERCISE 4: Fixing with a Lock
# ============================================================
print("\n--- Exercise 4: Lock Fix ---")

counter = 0
lock = threading.Lock()

def increment_safe():
    global counter
    for _ in range(100_000):
        with lock:
            counter += 1

t1 = threading.Thread(target=increment_safe)
t2 = threading.Thread(target=increment_safe)
t1.start(); t2.start()
t1.join(); t2.join()

print(f"With lock: {counter}")  # PREDICT:


# ============================================================
# EXERCISE 5: Thread-Local Data
# ============================================================
print("\n--- Exercise 5: Thread-Local Data ---")

local_data = threading.local()

def show_data(name, value):
    local_data.name = name
    local_data.value = value
    time.sleep(0.1)  # Simulate some work
    # Each thread sees its OWN local_data:
    print(f"  Thread {name}: local_data.value = {local_data.value}")

t1 = threading.Thread(target=show_data, args=("A", 1))
t2 = threading.Thread(target=show_data, args=("B", 2))
t1.start(); t2.start()
t1.join(); t2.join()
# PREDICT: Does thread A see value 2? Or does each see its own?


# ============================================================
# EXERCISE 6: Multiprocessing Basics
# ============================================================
print("\n--- Exercise 6: Multiprocessing ---")

import multiprocessing
import os

def cpu_task(n):
    result = sum(i * i for i in range(n))
    return (os.getpid(), result)

# Note: multiprocessing on macOS needs __main__ guard
# We'll use a pool to show the concept:
if __name__ == "__main__":
    print(f"Main process PID: {os.getpid()}")

    # Using a pool is the most common pattern:
    with multiprocessing.Pool(2) as pool:
        results = pool.map(cpu_task, [100_000, 200_000])
        for pid, result in results:
            print(f"  PID {pid}: {result}")
        # QUESTION: Are the PIDs the same as the main process?


# ============================================================
# EXERCISE 7: asyncio Basics
# ============================================================
print("\n--- Exercise 7: asyncio ---")

import asyncio

async def async_task(name, delay):
    print(f"  {name}: starting")
    await asyncio.sleep(delay)
    print(f"  {name}: done after {delay}s")
    return f"{name} result"

async def main_sequential():
    """Run tasks one after another."""
    r1 = await async_task("Task1", 1)
    r2 = await async_task("Task2", 1)
    return [r1, r2]

async def main_concurrent():
    """Run tasks concurrently."""
    results = await asyncio.gather(
        async_task("Task1", 1),
        async_task("Task2", 1),
    )
    return results

if __name__ == "__main__":
    start = time.time()
    results = asyncio.run(main_sequential())
    print(f"Sequential async: {time.time()-start:.2f}s")  # PREDICT: ~1s or ~2s?

    start = time.time()
    results = asyncio.run(main_concurrent())
    print(f"Concurrent async: {time.time()-start:.2f}s")  # PREDICT: ~1s or ~2s?


# ============================================================
# EXERCISE 8: async vs threading for I/O
# ============================================================
print("\n--- Exercise 8: async vs threading ---")

# Both solve the same problem — concurrent I/O.
# asyncio: single thread, explicit await points
# threading: multiple threads, OS switches between them

# Key difference in code style:
# Threading:   time.sleep()    — blocks the thread
# Asyncio:     await asyncio.sleep()  — yields to event loop

# QUESTION: Which would you choose for 10,000 concurrent connections?
# HINT: Each thread uses ~8MB of stack memory.
# 10,000 threads = 80GB! asyncio handles this with one thread.


# ============================================================
# EXERCISE 9: concurrent.futures
# ============================================================
print("\n--- Exercise 9: concurrent.futures ---")

from concurrent.futures import ThreadPoolExecutor

def fetch(url):
    time.sleep(0.5)
    return f"Data from {url}"

if __name__ == "__main__":
    urls = [f"url_{i}" for i in range(5)]

    start = time.time()
    with ThreadPoolExecutor(max_workers=5) as executor:
        # Method 1: map
        results = list(executor.map(fetch, urls))
    print(f"ThreadPool time: {time.time()-start:.2f}s")  # PREDICT:
    print(f"Results: {results[:2]}...")


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("Key: GIL makes threads useless for CPU-bound work.")
    print("Use threads for I/O, processes for CPU, asyncio for many I/O.")
    print("=" * 60)
