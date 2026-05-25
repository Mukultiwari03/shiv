"""
Module 06: Concurrency & Parallelism — Challenges
====================================================
"""
import threading
import time
import asyncio

# ============================================================
# CHALLENGE 1: Thread-Safe Counter Class
# ============================================================
"""
Build a counter that can be safely used from multiple threads.
"""
print("--- Challenge 1: Thread-Safe Counter ---")

class ThreadSafeCounter:
    def __init__(self):
        # YOUR CODE HERE
        pass

    def increment(self):
        # YOUR CODE HERE
        pass

    def decrement(self):
        # YOUR CODE HERE
        pass

    def value(self):
        # YOUR CODE HERE
        pass

# Uncomment to test:
# counter = ThreadSafeCounter()
# threads = []
# for _ in range(10):
#     t = threading.Thread(target=lambda: [counter.increment() for _ in range(10000)])
#     threads.append(t)
#     t.start()
# for t in threads:
#     t.join()
# print(f"Final value: {counter.value()}")  # Should be 100000


# ============================================================
# CHALLENGE 2: Producer-Consumer Pattern
# ============================================================
"""
Implement the producer-consumer pattern using threading and a Queue.
Producer adds items, consumer processes them.
"""
print("\n--- Challenge 2: Producer-Consumer ---")

from queue import Queue

def producer(q, items):
    """Put items into the queue with a small delay."""
    # YOUR CODE HERE
    pass

def consumer(q, name):
    """Get items from queue until sentinel None is received."""
    # YOUR CODE HERE
    pass

# Uncomment to test:
# q = Queue(maxsize=5)
# prod = threading.Thread(target=producer, args=(q, list(range(10))))
# cons = threading.Thread(target=consumer, args=(q, "Consumer-1"))
# prod.start(); cons.start()
# prod.join(); cons.join()


# ============================================================
# CHALLENGE 3: Parallel Map
# ============================================================
"""
Implement your own parallel_map that distributes work across threads.
"""
print("\n--- Challenge 3: Parallel Map ---")

def parallel_map(func, items, num_workers=4):
    """Apply func to each item using a thread pool. Return results in order."""
    # YOUR CODE HERE
    # HINT: Use concurrent.futures.ThreadPoolExecutor
    # or build it manually with threads
    pass

# Uncomment to test:
# def slow_square(x):
#     time.sleep(0.5)
#     return x ** 2
#
# start = time.time()
# results = parallel_map(slow_square, list(range(8)), num_workers=4)
# elapsed = time.time() - start
# print(f"Results: {results}")
# print(f"Time: {elapsed:.2f}s")  # Should be ~1s, not ~4s


# ============================================================
# CHALLENGE 4: Rate Limiter with asyncio
# ============================================================
"""
Build an async rate limiter that allows max N calls per second.
"""
print("\n--- Challenge 4: Rate Limiter ---")

class AsyncRateLimiter:
    def __init__(self, max_per_second):
        # YOUR CODE HERE
        pass

    async def acquire(self):
        """Wait if necessary to respect the rate limit."""
        # YOUR CODE HERE
        pass

# Uncomment to test:
# async def limited_fetch(limiter, url):
#     await limiter.acquire()
#     print(f"  Fetching {url} at {time.time():.2f}")
#     await asyncio.sleep(0.1)  # Simulate fetch
#
# async def test_limiter():
#     limiter = AsyncRateLimiter(max_per_second=3)
#     tasks = [limited_fetch(limiter, f"url_{i}") for i in range(9)]
#     await asyncio.gather(*tasks)
#
# asyncio.run(test_limiter())


# ============================================================
# CHALLENGE 5: Deadlock Detection
# ============================================================
"""
This code has a deadlock. Find it, explain why, and fix it.
"""
print("\n--- Challenge 5: Deadlock ---")

lock_a = threading.Lock()
lock_b = threading.Lock()

def worker_1():
    with lock_a:
        time.sleep(0.1)  # Simulate work
        with lock_b:
            print("  Worker 1 done")

def worker_2():
    with lock_b:
        time.sleep(0.1)  # Simulate work
        with lock_a:
            print("  Worker 2 done")

# DON'T RUN THIS — it will deadlock!
# t1 = threading.Thread(target=worker_1)
# t2 = threading.Thread(target=worker_2)
# t1.start(); t2.start()
# t1.join(); t2.join()

# EXPLAIN: Why does this deadlock?
# Worker 1 holds lock_a, waits for lock_b
# Worker 2 holds lock_b, waits for lock_a
# Neither can proceed!

# FIX: Always acquire locks in the same order.
# YOUR FIX HERE:


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("Thread-safe counter and producer-consumer are")
    print("the most common concurrency interview questions.")
    print("=" * 60)
