# Module 06: Interview Gotchas — Concurrency & Parallelism

---

## Gotcha 1: "What is the GIL?"

**Shallow**: "It prevents multi-threading."

**Deep**: "The GIL (Global Interpreter Lock) is a mutex in CPython that allows only one thread to execute Python bytecode at a time. It exists because CPython's reference counting isn't thread-safe. It means threads can't achieve CPU parallelism — but they CAN achieve I/O concurrency because the GIL is released during I/O operations (network calls, file reads, `time.sleep()`). For CPU-bound parallelism, use `multiprocessing` which creates separate processes with separate GILs."

---

## Gotcha 2: "Concurrency vs Parallelism?"

**Answer**: "Concurrency is about managing multiple tasks that make progress by interleaving — like a single cashier serving multiple queues. Parallelism is about executing multiple tasks simultaneously — like multiple cashiers. Threading gives concurrency (one thread at a time due to GIL). Multiprocessing gives parallelism (truly simultaneous). asyncio gives concurrency with a single thread using cooperative scheduling."

---

## Gotcha 3: "When would you use asyncio over threading?"

**Answer**: "asyncio when I have many concurrent I/O operations (hundreds/thousands of connections), because each thread costs ~8MB of stack and OS thread scheduling has overhead. asyncio handles thousands of concurrent tasks in a single thread. Threading is simpler for a small number of concurrent I/O tasks. Both are for I/O-bound work — neither helps with CPU-bound work."

---

## Gotcha 4: Race condition with `counter += 1`

**Why it's not atomic**: `counter += 1` is actually three operations: LOAD counter, ADD 1, STORE counter. A thread switch can happen between any of these steps, causing lost updates.

**Fix**: Use `threading.Lock()`, `queue.Queue()`, or `threading.local()`.

---

## Gotcha 5: "What is a deadlock?"

**Answer**: "A deadlock occurs when two or more threads are each waiting for a resource held by another, creating a circular dependency. Classic example: Thread A holds Lock 1, waits for Lock 2. Thread B holds Lock 2, waits for Lock 1. Neither can proceed. Prevention: always acquire locks in a consistent global order, use timeout on lock acquisition, or use higher-level abstractions like `concurrent.futures`."

---

## Gotcha 6: "What's the difference between `async`/`await` and threads?"

**Answer**: "Threads use preemptive multitasking — the OS switches between them at any time. async/await uses cooperative multitasking — the code explicitly yields control at `await` points. This makes async code easier to reason about (no race conditions between await points) but requires all I/O to be async-compatible. You can't `await` a blocking function like `time.sleep()` — you must use `asyncio.sleep()`."
