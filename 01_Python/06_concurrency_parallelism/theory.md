# Module 06: Concurrency & Parallelism

## The Big Question
Threading, multiprocessing, asyncio — what's the difference, when do you use each, and what is the GIL?

---

## 1. Concurrency vs Parallelism

These are NOT the same thing:

**Concurrency**: Multiple tasks making progress by interleaving. Like a chef switching between multiple dishes.
- One CPU core, switching between tasks
- Tasks take turns using the CPU
- Good for I/O-bound work (waiting for network, disk, user input)

**Parallelism**: Multiple tasks running simultaneously. Like multiple chefs cooking at the same time.
- Multiple CPU cores, truly running at once
- Good for CPU-bound work (number crunching, image processing)

```
Concurrency (interleaving):
Task A: ████░░░░████░░░░████
Task B: ░░░░████░░░░████░░░░

Parallelism (simultaneous):
Task A: ████████████████████  (Core 1)
Task B: ████████████████████  (Core 2)
```

---

## 2. The GIL (Global Interpreter Lock)

The GIL is a **mutex** in CPython that allows only ONE thread to execute Python bytecode at a time.

### Why does the GIL exist?
CPython's memory management (reference counting) is NOT thread-safe. If two threads modify an object's reference count simultaneously, you'd get race conditions and memory corruption. The GIL prevents this by letting only one thread run Python code at a time.

### What the GIL means in practice:

```python
# CPU-BOUND: GIL is a bottleneck
# Only one thread runs Python at a time — no speedup from threads!
import threading

def count(n):
    while n > 0:
        n -= 1

# Two threads, but they take the SAME time as one
# because only one runs at a time (GIL)
t1 = threading.Thread(target=count, args=(100_000_000,))
t2 = threading.Thread(target=count, args=(100_000_000,))
```

```python
# I/O-BOUND: GIL is NOT a bottleneck
# While one thread waits for I/O, another can run!
import threading
import time

def download(url):
    time.sleep(2)  # Simulates I/O wait — releases the GIL
    return f"Done: {url}"

# These run concurrently because sleep() releases the GIL
t1 = threading.Thread(target=download, args=("url1",))
t2 = threading.Thread(target=download, args=("url2",))
# Total time: ~2 seconds, not ~4
```

### Key rules:
| Work Type | Use | Why |
|-----------|-----|-----|
| I/O-bound (network, disk) | `threading` or `asyncio` | GIL is released during I/O waits |
| CPU-bound (computation) | `multiprocessing` | Separate processes = separate GILs |
| Both | `multiprocessing` + `asyncio` | Best of both worlds |

---

## 3. Threading

### Basic threading:
```python
import threading
import time

def worker(name, duration):
    print(f"  {name} starting")
    time.sleep(duration)
    print(f"  {name} done after {duration}s")

t1 = threading.Thread(target=worker, args=("Thread-1", 2))
t2 = threading.Thread(target=worker, args=("Thread-2", 1))

t1.start()  # Begins execution
t2.start()

t1.join()   # Wait for t1 to finish
t2.join()   # Wait for t2 to finish
print("All threads done")
```

### Thread Safety — The Problem:
```python
import threading

counter = 0

def increment():
    global counter
    for _ in range(1_000_000):
        counter += 1  # NOT thread-safe!

t1 = threading.Thread(target=increment)
t2 = threading.Thread(target=increment)
t1.start(); t2.start()
t1.join(); t2.join()

print(counter)  # NOT 2,000,000! Race condition.
```

### The Fix — Locks:
```python
import threading

counter = 0
lock = threading.Lock()

def increment_safe():
    global counter
    for _ in range(1_000_000):
        with lock:        # Only one thread can be here at a time
            counter += 1  # Now thread-safe

# Or manually:
# lock.acquire()
# try:
#     counter += 1
# finally:
#     lock.release()
```

### Other Synchronization Primitives:
```python
# RLock — Reentrant lock (same thread can acquire multiple times)
rlock = threading.RLock()

# Semaphore — Allows N threads at once
sem = threading.Semaphore(3)  # Max 3 concurrent threads

# Event — One thread signals, others wait
event = threading.Event()
# Thread A: event.wait()    — blocks until event is set
# Thread B: event.set()     — unblocks all waiters

# Condition — Complex synchronization (producer/consumer)
condition = threading.Condition()
```

---

## 4. Multiprocessing

Each process has its OWN Python interpreter and its OWN GIL → true parallelism.

```python
from multiprocessing import Process, Pool
import os

def cpu_work(n):
    """CPU-heavy work."""
    total = sum(i * i for i in range(n))
    print(f"  PID {os.getpid()}: result = {total}")
    return total

# Basic process:
p = Process(target=cpu_work, args=(1_000_000,))
p.start()
p.join()

# Pool — manage multiple workers:
with Pool(processes=4) as pool:
    # Map work across 4 processes:
    results = pool.map(cpu_work, [1_000_000, 2_000_000, 3_000_000])
    print(f"  Results: {results}")
```

### Key differences from threading:
| Feature | Threading | Multiprocessing |
|---------|-----------|-----------------|
| Memory | Shared | Separate (must serialize data) |
| GIL | One GIL, shared | Each process has own GIL |
| Best for | I/O-bound | CPU-bound |
| Overhead | Low (lightweight) | High (process creation) |
| Communication | Shared variables (with locks) | Queues, Pipes, shared memory |

### Inter-Process Communication:
```python
from multiprocessing import Queue

def producer(q):
    q.put("hello from producer")

def consumer(q):
    msg = q.get()
    print(f"  Consumer got: {msg}")

q = Queue()
p1 = Process(target=producer, args=(q,))
p2 = Process(target=consumer, args=(q,))
p1.start(); p2.start()
p1.join(); p2.join()
```

---

## 5. asyncio — Cooperative Concurrency

asyncio uses a **single thread** with an **event loop**. Tasks voluntarily yield control when they're waiting (cooperative).

### The basics:
```python
import asyncio

async def fetch_data(name, delay):
    print(f"  {name}: starting")
    await asyncio.sleep(delay)  # Yield control to event loop
    print(f"  {name}: done after {delay}s")
    return f"{name} result"

async def main():
    # Run tasks concurrently:
    results = await asyncio.gather(
        fetch_data("Task-1", 2),
        fetch_data("Task-2", 1),
        fetch_data("Task-3", 3),
    )
    print(f"  Results: {results}")

# asyncio.run(main())
# Total time: ~3 seconds (not 6) because they run concurrently
```

### Key concepts:

**`async def`** — Defines a coroutine function. Calling it returns a coroutine object (like generators!).

**`await`** — Suspends the coroutine, gives control back to the event loop. Can only `await` other coroutines or awaitables.

**Event Loop** — The scheduler. It tracks which coroutines are ready to run and which are waiting.

```
Event Loop:
  1. Pick a ready coroutine
  2. Run it until it hits 'await'
  3. Coroutine yields control
  4. Pick another ready coroutine
  5. Repeat
```

### `async for` and `async with`:
```python
# Async iteration:
async def async_range(n):
    for i in range(n):
        await asyncio.sleep(0.1)
        yield i

async def main():
    async for i in async_range(5):
        print(i)

# Async context manager:
class AsyncTimer:
    async def __aenter__(self):
        self.start = asyncio.get_event_loop().time()
        return self

    async def __aexit__(self, *args):
        elapsed = asyncio.get_event_loop().time() - self.start
        print(f"  Elapsed: {elapsed:.2f}s")
```

### Common Patterns:
```python
# Run with timeout:
async def main():
    try:
        result = await asyncio.wait_for(slow_task(), timeout=5.0)
    except asyncio.TimeoutError:
        print("  Task timed out!")

# Run first completed:
async def main():
    done, pending = await asyncio.wait(
        [task1(), task2(), task3()],
        return_when=asyncio.FIRST_COMPLETED
    )
    for p in pending:
        p.cancel()
```

---

## 6. `concurrent.futures` — High-Level Interface

Provides a unified API for both threading and multiprocessing:

```python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import time

def task(n):
    time.sleep(1)
    return n * n

# Thread pool (I/O-bound):
with ThreadPoolExecutor(max_workers=4) as executor:
    futures = [executor.submit(task, i) for i in range(4)]
    results = [f.result() for f in futures]
    print(f"  Thread results: {results}")

# Process pool (CPU-bound):
with ProcessPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(task, range(4)))
    print(f"  Process results: {results}")
```

---

## 7. When to Use What — Decision Tree

```
Is my bottleneck I/O (network, disk, API calls)?
├── Yes → Do I need simple concurrency?
│         ├── Yes → threading or concurrent.futures.ThreadPoolExecutor
│         └── No (need many concurrent connections) → asyncio
└── No (CPU-bound computation)
    └── multiprocessing or concurrent.futures.ProcessPoolExecutor
```

---

## Summary

```
GIL: Only one thread executes Python bytecode at a time (CPython)
Threading: Concurrent (interleaved), good for I/O-bound, shared memory
Multiprocessing: Parallel (simultaneous), good for CPU-bound, separate memory
asyncio: Cooperative concurrency, single thread, event loop, best for many I/O tasks
concurrent.futures: High-level API that unifies threading and multiprocessing
```

**Interview one-liner**: "The GIL prevents true thread parallelism for CPU-bound Python code. For I/O-bound work, threading works because the GIL is released during I/O waits. For CPU-bound work, use multiprocessing (separate processes, separate GILs). asyncio provides cooperative single-threaded concurrency using an event loop, ideal for handling many concurrent I/O operations like web requests."
