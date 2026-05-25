// ============================================================================
//  DSA — SHEET 9: SORTING ALGORITHMS
//  Goal: Understand HOW each algorithm works and WHEN to use which.
//        Interviewers often ask you to implement merge sort or explain
//        quicksort's worst case — don't just know Array.sort().
// ============================================================================
//
//  HOW TO RUN:
//    node dsa_09_sorting.js
//
//  CHEAT SHEET:
//  Algorithm      | Time (avg) | Time (worst) | Space  | Stable? | Use when
//  ---------------------------------------------------------------------------
//  Bubble Sort    | O(n²)      | O(n²)        | O(1)   | Yes     | Teaching only
//  Selection Sort | O(n²)      | O(n²)        | O(1)   | No      | Teaching only
//  Insertion Sort | O(n²)      | O(n²)        | O(1)   | Yes     | Small / nearly sorted
//  Merge Sort     | O(n log n) | O(n log n)   | O(n)   | Yes     | Guaranteed performance
//  Quick Sort     | O(n log n) | O(n²)        | O(log) | No      | In practice fastest
//  Heap Sort      | O(n log n) | O(n log n)   | O(1)   | No      | Space-constrained
//  Counting Sort  | O(n + k)   | O(n + k)     | O(k)   | Yes     | Small integer range
//  Radix Sort     | O(n * d)   | O(n * d)     | O(n+k) | Yes     | Large integers
//
//  INTERVIEW TIP: "What does Array.sort() use?"
//  V8 (Node.js) uses TimSort — hybrid of merge sort + insertion sort.
//  Stable since V8 7.0. Time: O(n log n).
// ============================================================================

const assert = (actual, expected, label) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) console.log("  Expected:", expected, "| Got:", actual);
};


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: SIMPLE SORTS (know the mechanics, not for production)
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 1.1 — Bubble Sort.
// Repeatedly swap adjacent elements that are in the wrong order.
// Optimisation: if no swaps in a pass → already sorted, stop early.

function bubbleSort(arr) {
  // YOUR CODE HERE
  const a = [...arr];
  // Outer loop: n passes. Inner loop: compare adjacent pairs.
  // Optimisation: track if any swap happened. If not → done.
  return a;
}

assert(bubbleSort([5, 3, 8, 1, 2]), [1, 2, 3, 5, 8], "bubbleSort");
assert(bubbleSort([1, 2, 3]), [1, 2, 3], "bubbleSort already sorted");


// EXERCISE 1.2 — Insertion Sort.
// Build sorted section from left to right. Insert each element in its correct spot.
// Great for nearly-sorted arrays and small inputs.

function insertionSort(arr) {
  // YOUR CODE HERE
  const a = [...arr];
  // for i from 1 to n:
  //   key = a[i]
  //   j = i - 1
  //   while j >= 0 && a[j] > key: shift a[j] right, j--
  //   a[j+1] = key
  return a;
}

assert(insertionSort([5, 3, 8, 1, 2]), [1, 2, 3, 5, 8], "insertionSort");

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: EFFICIENT SORTS (know these deeply)
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 2.1 — Merge Sort.
// Divide and conquer. Split in half recursively, merge sorted halves.
// Time: O(n log n) guaranteed. Space: O(n).
// STABLE — maintains relative order of equal elements.

function mergeSort(arr) {
  // YOUR CODE HERE
  // Base case: length <= 1 → return arr.
  // Split into left and right halves.
  // Recursively sort both.
  // Merge them together in O(n) using two pointers.
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  // YOUR CODE HERE — merge two sorted arrays into one sorted array
  const result = [];
  let i = 0, j = 0;
  // while both have elements, compare and push smaller
  // push remaining elements from whichever is non-empty
  return result;
}

assert(mergeSort([5, 3, 8, 1, 2]), [1, 2, 3, 5, 8], "mergeSort");
assert(mergeSort([1]), [1], "mergeSort single");
assert(mergeSort([2, 1]), [1, 2], "mergeSort two");


// EXERCISE 2.2 — Quick Sort.
// Choose a pivot. Partition: all < pivot go left, all > pivot go right.
// Recursively sort left and right partitions.
// Time: O(n log n) average, O(n²) worst (bad pivot). Space: O(log n) stack.
//
//  PIVOT STRATEGIES:
//    First/last element → O(n²) on sorted input (bad!)
//    Median-of-three    → reduces worst-case likelihood
//    Random pivot       → O(n log n) expected with high probability (production choice)

function quickSort(arr, low = 0, high = arr.length - 1) {
  // YOUR CODE HERE — in-place
  if (low < high) {
    const pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  // YOUR CODE HERE — Lomuto scheme: pivot = arr[high]
  // i starts at low - 1
  // for j from low to high-1:
  //   if arr[j] <= pivot: i++, swap arr[i] and arr[j]
  // swap arr[i+1] and arr[high]
  // return i+1
  const pivot = arr[high];
  let i = low - 1;
}

const qs = [5, 3, 8, 1, 2];
quickSort(qs);
assert(qs, [1, 2, 3, 5, 8], "quickSort");

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: NON-COMPARISON SORTS
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 3.1 — Counting Sort.
// For integers in a known range [0, k]. Counts occurrences, then reconstructs.
// Time: O(n + k), Space: O(k). Faster than O(n log n) for small k!

function countingSort(arr, maxVal) {
  // YOUR CODE HERE
  // Step 1: Create count array of size maxVal + 1.
  // Step 2: Count each element.
  // Step 3: Reconstruct sorted array from counts.
}

assert(countingSort([4, 2, 2, 8, 3, 3, 1], 8), [1, 2, 2, 3, 3, 4, 8], "countingSort");


// EXERCISE 3.2 — Sort application: Sort an array of objects by multiple keys.
// First by age ascending, then by name alphabetically.

const people = [
  { name: "Charlie", age: 25 },
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
  { name: "Diana", age: 28 },
];

const sorted = [...people].sort((a, b) => {
  // YOUR CODE HERE
  // Primary sort: age ascending.
  // Secondary sort (tie-break): name alphabetically.
});

assert(sorted.map(p => p.name), ["Bob", "Charlie", "Diana", "Alice"], "multiKeySort");

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: SORT-BASED PROBLEM PATTERNS
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 4.1 — Merge Intervals.
// Given a list of intervals, merge overlapping ones.
// merge([[1,3],[2,6],[8,10],[15,18]]) → [[1,6],[8,10],[15,18]]
// merge([[1,4],[4,5]]) → [[1,5]]
// Time: O(n log n), Space: O(n)

function mergeIntervals(intervals) {
  // YOUR CODE HERE
  // Sort by start time.
  // Iterate: if current start <= last merged end → extend end.
  //          else → push current as new interval.
}

assert(mergeIntervals([[1,3],[2,6],[8,10],[15,18]]), [[1,6],[8,10],[15,18]], "mergeIntervals 1");
assert(mergeIntervals([[1,4],[4,5]]), [[1,5]], "mergeIntervals touching");
assert(mergeIntervals([[1,4],[2,3]]), [[1,4]], "mergeIntervals contained");


// EXERCISE 4.2 — Largest Number.
// Given non-negative integers, arrange them to form the largest number.
// largestNumber([3,30,34,5,9]) → "9534330"
// largestNumber([10,2]) → "210"
// Time: O(n log n), Space: O(n)
//
//  TRICK: Custom comparator. To compare a and b:
//    If ab > ba → a comes first (higher priority).
//    e.g., "9" + "34" = "934" vs "34" + "9" = "349" → "934" > "349" → 9 first.

function largestNumber(nums) {
  // YOUR CODE HERE
}

assert(largestNumber([3, 30, 34, 5, 9]), "9534330", "largestNumber 1");
assert(largestNumber([10, 2]), "210", "largestNumber 2");
assert(largestNumber([0, 0]), "0", "largestNumber zeros");


// EXERCISE 4.3 — Meeting Rooms II.
// Given meeting intervals, find the minimum number of conference rooms needed.
// minMeetingRooms([[0,30],[5,10],[15,20]]) → 2
// minMeetingRooms([[7,10],[2,4]]) → 1
// Time: O(n log n), Space: O(n)
//
//  APPROACH: Separate start and end times, sort both.
//  Use two pointers: greedily match ends to starts.
//  If start < end → need new room. Else → reuse a room.

function minMeetingRooms(intervals) {
  // YOUR CODE HERE
  const starts = intervals.map(i => i[0]).sort((a,b) => a-b);
  const ends   = intervals.map(i => i[1]).sort((a,b) => a-b);
}

assert(minMeetingRooms([[0,30],[5,10],[15,20]]), 2, "meetingRooms 2");
assert(minMeetingRooms([[7,10],[2,4]]), 1, "meetingRooms 1");

console.log("=== Sheet 9 complete! Move to dsa_10_dynamic_programming.js ===\n");
