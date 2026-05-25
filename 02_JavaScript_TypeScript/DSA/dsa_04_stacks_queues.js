// ============================================================================
//  DSA — SHEET 4: STACKS & QUEUES
//  Goal: Know when LIFO vs FIFO matters. Master the monotonic stack —
//        the hidden pattern behind ~20 "hard" problems.
// ============================================================================
//
//  HOW TO RUN:
//    node dsa_04_stacks_queues.js
//
//  STACK (LIFO — Last In, First Out)
//    JS array: push() to add, pop() to remove, arr[arr.length-1] to peek.
//    Use for: undo/redo, call stack, brackets matching, monotonic problems.
//
//  QUEUE (FIFO — First In, First Out)
//    JS array: push() to enqueue, shift() to dequeue (O(n)!).
//    For O(1) queues: use a pointer or a doubly linked list.
//    Use for: BFS, task scheduling, sliding window maximum.
//
//  MONOTONIC STACK: A stack where elements are always in sorted order
//    (monotonically increasing or decreasing). Pop elements that violate order.
//    KEY INSIGHT: When you pop an element, the current element is its
//    "next greater" (or smaller) element. This solves NGE problems in O(n).
// ============================================================================

const assert = (actual, expected, label) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) console.log("  Expected:", expected, "| Got:", actual);
};


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: STACK FUNDAMENTALS
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 1.1 — Valid Parentheses (most common stack problem).
// Determine if a string of brackets is valid.
// isValid("()[]{}") → true
// isValid("(]") → false
// isValid("{[]}") → true
// Time: O(n), Space: O(n)

function isValid(s) {
  // YOUR CODE HERE
  // Map close → open bracket.
  // Push open brackets. On close bracket: check stack top matches.
  const pairs = { ')': '(', ']': '[', '}': '{' };
}

assert(isValid("()[]{}"), true, "isValid 1");
assert(isValid("(]"), false, "isValid 2");
assert(isValid("{[]}"), true, "isValid nested");
assert(isValid("([)]"), false, "isValid interleaved");
assert(isValid("]"), false, "isValid empty stack");


// EXERCISE 1.2 — Min Stack.
// Design a stack that supports push, pop, top, and getMin — all O(1).
//
//  TRICK: Maintain a second "min stack" in parallel.
//  Only push to min stack when new val <= current min.
//  Pop from min stack when popping a value === current min.

class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = []; // top is always the current minimum
  }

  push(val) {
    // YOUR CODE HERE
  }

  pop() {
    // YOUR CODE HERE
  }

  top() {
    return this.stack[this.stack.length - 1];
  }

  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}

const ms = new MinStack();
ms.push(-2); ms.push(0); ms.push(-3);
assert(ms.getMin(), -3, "MinStack getMin -3");
ms.pop();
assert(ms.top(), 0, "MinStack top 0");
assert(ms.getMin(), -2, "MinStack getMin -2");


// EXERCISE 1.3 — Evaluate Reverse Polish Notation.
// evalRPN(["2","1","+","3","*"]) → 9   ((2+1)*3)
// evalRPN(["4","13","5","/","+"]) → 6  (4+(13/5))
// Time: O(n), Space: O(n)

function evalRPN(tokens) {
  // YOUR CODE HERE
  // Push numbers. On operator: pop two numbers, apply, push result.
  // Use Math.trunc for division (truncate toward zero, not floor).
}

assert(evalRPN(["2", "1", "+", "3", "*"]), 9, "evalRPN 1");
assert(evalRPN(["4", "13", "5", "/", "+"]), 6, "evalRPN 2");
assert(evalRPN(["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]), 22, "evalRPN 3");

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: MONOTONIC STACK
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: A monotonic stack maintains elements in sorted order.
//  "Monotonically decreasing" = each new element ≤ top of stack.
//  When you encounter an element LARGER than the top: pop until valid.
//  IMPORTANT: the element that caused the pop is the "next greater element"
//  for everything that was popped.

// EXERCISE 2.1 — Next Greater Element.
// For each element in nums1, find the next greater element in nums2.
// -1 if none exists.
// nextGreaterElement([4,1,2], [1,3,4,2]) → [-1,3,-1]
// Time: O(n + m), Space: O(n)
//
//  ALGORITHM:
//    1. Build NGE map for all elements in nums2 using monotonic stack.
//    2. For each element in nums1, look up in NGE map.

function nextGreaterElement(nums1, nums2) {
  // YOUR CODE HERE
  // Monotonic decreasing stack on nums2:
  //   For each num in nums2:
  //     while stack not empty AND stack.top < num: map[stack.pop()] = num
  //     push num
  //   Remaining elements in stack have NGE = -1.
}

assert(nextGreaterElement([4, 1, 2], [1, 3, 4, 2]), [-1, 3, -1], "NGE 1");
assert(nextGreaterElement([2, 4], [1, 2, 3, 4]), [3, -1], "NGE 2");


// EXERCISE 2.2 — Daily Temperatures.
// For each day, how many days until a warmer temperature? 0 if never.
// dailyTemperatures([73,74,75,71,69,72,76,73]) → [1,1,4,2,1,1,0,0]
// Time: O(n), Space: O(n)
//
//  PATTERN: monotonic decreasing stack of INDICES.
//  When temperatures[i] > temperatures[stack.top]:
//    answer[stack.pop()] = i - popped_index

function dailyTemperatures(temperatures) {
  // YOUR CODE HERE
}

assert(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]), [1, 1, 4, 2, 1, 1, 0, 0], "dailyTemps");
assert(dailyTemperatures([30, 40, 50, 60]), [1, 1, 1, 0], "dailyTemps ascending");
assert(dailyTemperatures([30, 60, 90]), [1, 1, 0], "dailyTemps 3");


// EXERCISE 2.3 — Largest Rectangle in Histogram (HARD — classic interview).
// Find the largest rectangle that fits in the histogram.
// largestRectangle([2,1,5,6,2,3]) → 10
// largestRectangle([2,4]) → 4
// Time: O(n), Space: O(n)
//
//  ALGORITHM (monotonic increasing stack):
//  Stack stores indices. Maintain stack in increasing height order.
//  When heights[i] < heights[stack.top]:
//    pop index j. Width = i - stack.top - 1 (or i if stack is empty).
//    area = heights[j] * width. Update max.
//  After loop: drain stack with i = heights.length.

function largestRectangle(heights) {
  // YOUR CODE HERE
  // Append 0 to heights to flush remaining elements in stack at the end.
}

assert(largestRectangle([2, 1, 5, 6, 2, 3]), 10, "largestRectangle 1");
assert(largestRectangle([2, 4]), 4, "largestRectangle 2");
assert(largestRectangle([1]), 1, "largestRectangle single");

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: QUEUE PATTERNS
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 3.1 — Implement a Queue using two Stacks.
// Each operation should be amortised O(1).
//
//  TRICK: Use two stacks — inbox and outbox.
//  Enqueue → push to inbox.
//  Dequeue → if outbox empty: move all inbox to outbox (reverses order). Then pop outbox.

class MyQueue {
  constructor() {
    this.inbox = [];
    this.outbox = [];
  }

  push(x) {
    // YOUR CODE HERE
  }

  pop() {
    // YOUR CODE HERE: move inbox to outbox if outbox empty, then pop outbox
  }

  peek() {
    // YOUR CODE HERE
  }

  empty() {
    return this.inbox.length === 0 && this.outbox.length === 0;
  }
}

const q = new MyQueue();
q.push(1); q.push(2);
assert(q.peek(), 1, "queue peek");
assert(q.pop(), 1, "queue pop");
assert(q.empty(), false, "queue not empty");


// EXERCISE 3.2 — Sliding Window Maximum (HARD — monotonic deque).
// Return the maximum value in every sliding window of size k.
// maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3) → [3,3,5,5,6,7]
// Time: O(n), Space: O(k)
//
//  DEQUE APPROACH: Maintain a deque of indices where values are decreasing.
//  Front of deque = index of current window's maximum.
//  Before adding new element:
//    Remove expired indices from front (index <= i - k).
//    Remove indices from back where value <= current value (they'll never be max).
//  Front of deque = max for this window.

function maxSlidingWindow(nums, k) {
  // YOUR CODE HERE
  // Use an array as a deque: shift from front (O(n) total), push/pop from back.
  const deque = []; // stores indices
  const result = [];
}

assert(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7], "slidingMax 1");
assert(maxSlidingWindow([1], 1), [1], "slidingMax single");
assert(maxSlidingWindow([1, -1], 1), [1, -1], "slidingMax k=1");

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: FINAL CHALLENGE
// ════════════════════════════════════════════════════════════════════════════

// CHALLENGE 4.1 — Decode String.
// k[encoded_string] means encoded_string repeated k times.
// decodeString("3[a]2[bc]") → "aaabcbc"
// decodeString("3[a2[c]]") → "accaccacc"
// Time: O(n * max_k), Space: O(n)

function decodeString(s) {
  // YOUR CODE HERE
  // Use TWO stacks: one for counts, one for strings-in-progress.
  // On '[': push current count and current string to stacks. Reset both.
  // On ']': pop count and prev string. new string = prev + current.repeat(count).
  // On digit: build current count.
  // On letter: append to current string.
}

assert(decodeString("3[a]2[bc]"), "aaabcbc", "decodeString 1");
assert(decodeString("3[a2[c]]"), "accaccacc", "decodeString nested");
assert(decodeString("2[abc]3[cd]ef"), "abcabccdcdcdef", "decodeString complex");

console.log("=== Sheet 4 complete! Move to dsa_05_linked_lists.js ===\n");
