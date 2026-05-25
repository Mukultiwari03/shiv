// ============================================================================
//  DSA — SHEET 11: HEAPS & PRIORITY QUEUES
//  Goal: Know when you need the "k-th something." Heaps give you O(log n)
//        insert and O(log n) extract-min/max — better than sorting everything.
// ============================================================================
//
//  HOW TO RUN:
//    node dsa_11_heaps.js
//
//  WHAT IS A HEAP?
//    A complete binary tree satisfying the heap property:
//      Min-Heap: parent ≤ children (root = minimum element)
//      Max-Heap: parent ≥ children (root = maximum element)
//
//    Stored as an ARRAY (no pointers needed):
//      Parent of i:      Math.floor((i - 1) / 2)
//      Left child of i:  2 * i + 1
//      Right child of i: 2 * i + 2
//
//  OPERATIONS:
//    insert:     push to end, bubble UP    → O(log n)
//    extractMin: swap root with end, pop,  → O(log n)
//                bubble DOWN
//    peek:       return root               → O(1)
//    heapify:    build heap from array     → O(n) (not O(n log n)!)
//
//  PATTERN RECOGNITION — reach for a heap when:
//    • "K largest / K smallest elements"
//    • "K-th largest element"
//    • "Merge K sorted lists"
//    • "Find median of a data stream"
//    • "Task scheduling with priorities"
//    • "Dijkstra's shortest path"
//
//  NOTE: JavaScript has no built-in heap/priority queue.
//  In interviews, you either implement one or simulate with sorted arrays.
//  This sheet teaches the real implementation + the key problem patterns.
// ============================================================================

const assert = (actual, expected, label) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) console.log("  Expected:", expected, "| Got:", actual);
};


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: MIN-HEAP IMPLEMENTATION
// ════════════════════════════════════════════════════════════════════════════

class MinHeap {
  constructor() {
    this.heap = [];
  }

  size()    { return this.heap.length; }
  peek()    { return this.heap[0]; }

  // Helper indices
  parent(i)    { return Math.floor((i - 1) / 2); }
  leftChild(i) { return 2 * i + 1; }
  rightChild(i){ return 2 * i + 2; }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  insert(val) {
    // YOUR CODE HERE
    // 1. Push to end.
    // 2. Bubble up: while val < parent, swap with parent, move index up.
  }

  extractMin() {
    // YOUR CODE HERE
    // 1. Save root (min).
    // 2. Move last element to root, pop last.
    // 3. Bubble down: repeatedly swap with smaller child until heap property holds.
    // 4. Return saved root.
  }

  bubbleUp(i) {
    // YOUR CODE HERE
  }

  bubbleDown(i) {
    // YOUR CODE HERE
    // Find smallest among node and its children. If not current node, swap and recurse.
  }
}

// Test the heap implementation:
const heap = new MinHeap();
heap.insert(5); heap.insert(3); heap.insert(8); heap.insert(1); heap.insert(4);
assert(heap.peek(), 1, "MinHeap peek");
assert(heap.extractMin(), 1, "MinHeap extract 1");
assert(heap.extractMin(), 3, "MinHeap extract 3");
assert(heap.extractMin(), 4, "MinHeap extract 4");


// Max-Heap: same as MinHeap but flip comparisons (> instead of <).
// Quick trick: negate values when inserting into a MinHeap to simulate MaxHeap.

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: K-TH ELEMENT PROBLEMS
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 2.1 — K-th Largest Element in an Array.
// findKthLargest([3,2,1,5,6,4], 2) → 5
// findKthLargest([3,2,3,1,2,4,5,5,6], 4) → 4
// Time: O(n log k), Space: O(k)
//
//  STRATEGY: Maintain a MIN-HEAP of size k.
//  The minimum of a max-k-heap = the k-th largest element.
//  For each element: push to heap. If size > k: extract min.
//  Result = heap.peek().

function findKthLargest(nums, k) {
  // YOUR CODE HERE using MinHeap class above
}

assert(findKthLargest([3, 2, 1, 5, 6, 4], 2), 5, "kthLargest 5");
assert(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4), 4, "kthLargest 4");


// EXERCISE 2.2 — K Closest Points to Origin.
// kClosest([[1,3],[-2,2]], 1) → [[-2,2]]
// kClosest([[3,3],[5,-1],[-2,4]], 2) → [[3,3],[-2,4]]
// Distance² = x²+y² (no need for sqrt — preserves order)
// Time: O(n log k), Space: O(k)
//
//  STRATEGY: Max-Heap of size k (keep k closest = eliminate farthest).
//  When heap exceeds k: extract the farthest point.

function kClosest(points, k) {
  // YOUR CODE HERE
  // Use a max-heap of [distance², point]. If size > k: pop (removes farthest).
  // Simulate max-heap with MinHeap by negating distance.
}

const kc1 = kClosest([[1,3],[-2,2]], 1);
assert(kc1.length, 1, "kClosest length 1");
assert(kc1[0], [-2,2], "kClosest point");

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: ADVANCED HEAP PROBLEMS
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 3.1 — Merge K Sorted Lists.
// Merge k sorted linked lists into one sorted list.
// Time: O(n log k) where n = total nodes, k = number of lists
//
//  STRATEGY: Min-Heap of (value, listIndex, node).
//  Always extract the minimum node, add its next node to the heap.

class ListNode {
  constructor(val = 0, next = null) { this.val = val; this.next = next; }
}

function mergeKLists(lists) {
  // YOUR CODE HERE
  // Initialize heap with the head of each non-null list.
  // Use a MinHeap that compares by node.val.
  // Pull min, append to result, push min.next if it exists.
  const heap = new MinHeap();
}

// Test helper:
function fromArray(arr) {
  const dummy = new ListNode(0); let cur = dummy;
  for (const v of arr) { cur.next = new ListNode(v); cur = cur.next; }
  return dummy.next;
}
function toArray(head) {
  const r = []; while (head) { r.push(head.val); head = head.next; } return r;
}

const merged = mergeKLists([fromArray([1,4,5]),fromArray([1,3,4]),fromArray([2,6])]);
assert(toArray(merged), [1,1,2,3,4,4,5,6], "mergeKLists");


// EXERCISE 3.2 — Find Median from Data Stream (HARD — FAANG favourite).
// Efficiently support:
//   addNum(num) — add a number
//   findMedian()  — return median so far
//
//  STRATEGY: Two heaps.
//    maxHeap (left half) — stores smaller half of numbers.
//    minHeap (right half) — stores larger half.
//    Invariant: |maxHeap| - |minHeap| ∈ {0, 1}
//    If |maxHeap| > |minHeap|: median = maxHeap.peek()
//    If equal: median = (maxHeap.peek() + minHeap.peek()) / 2

class MedianFinder {
  constructor() {
    this.maxHeap = new MinHeap(); // negate values to simulate max-heap
    this.minHeap = new MinHeap();
  }

  addNum(num) {
    // YOUR CODE HERE
    // 1. Push to maxHeap (negate for max behaviour).
    // 2. Balance: if maxHeap.peek() (un-negated) > minHeap.peek(): move to minHeap.
    // 3. Re-balance sizes so maxHeap is same size or 1 larger.
  }

  findMedian() {
    // YOUR CODE HERE
    // If maxHeap.size > minHeap.size: return -maxHeap.peek() (un-negate)
    // Else: return (-maxHeap.peek() + minHeap.peek()) / 2
  }
}

const mf = new MedianFinder();
mf.addNum(1); mf.addNum(2);
assert(mf.findMedian(), 1.5, "median 1.5");
mf.addNum(3);
assert(mf.findMedian(), 2, "median 2");

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: HEAP SORT
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Build a max-heap from the array (O(n)).
//  Then repeatedly extract the max to the end of the array (O(n log n)).
//  Result: in-place O(n log n) sort with O(1) extra space.
//  Not stable — but space optimal.

function heapSort(arr) {
  // YOUR CODE HERE
  const n = arr.length;

  // Step 1: Build max-heap in-place.
  // Start from last non-leaf node and heapify down each.
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapifyDown(arr, n, i);
  }

  // Step 2: Extract elements one by one.
  // Swap root (max) with last, shrink heap size, heapify root.
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapifyDown(arr, i, 0);
  }

  return arr;
}

function heapifyDown(arr, n, i) {
  // YOUR CODE HERE — max-heap version
  let largest = i;
  const left = 2 * i + 1, right = 2 * i + 2;
  // if left < n && arr[left] > arr[largest]: largest = left
  // if right < n && arr[right] > arr[largest]: largest = right
  // if largest !== i: swap arr[i] and arr[largest], heapifyDown(arr, n, largest)
}

assert(heapSort([4, 10, 3, 5, 1]), [1, 3, 4, 5, 10], "heapSort");
assert(heapSort([1]), [1], "heapSort single");

console.log("=== Sheet 11 complete! Move to dsa_12_interview_challenges.js ===\n");
