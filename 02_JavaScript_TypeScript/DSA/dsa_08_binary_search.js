// ============================================================================
//  DSA — SHEET 8: BINARY SEARCH
//  Goal: Binary search is more than just "find an element." It's a template
//        for halving search spaces — including ranges of ANSWERS, not just arrays.
// ============================================================================
//
//  HOW TO RUN:
//    node dsa_08_binary_search.js
//
//  THE UNIVERSAL TEMPLATE:
//    let left = 0, right = n - 1;   // or right = max_possible_answer
//    while (left <= right) {
//      const mid = left + Math.floor((right - left) / 2);  // avoids overflow
//      if (nums[mid] === target) return mid;
//      else if (nums[mid] < target) left = mid + 1;
//      else right = mid - 1;
//    }
//    return -1;
//
//  WHY mid = left + (right - left) / 2?
//    (left + right) / 2 can overflow in languages with fixed integers.
//    This form is safe and equivalent.
//
//  PATTERN RECOGNITION — binary search when:
//    • Array is SORTED (or rotated sorted)
//    • "Find first/last position" of something
//    • "Minimum/maximum possible value such that condition is met"
//      (binary search on the ANSWER, not the array)
// ============================================================================

const assert = (actual, expected, label) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) console.log("  Expected:", expected, "| Got:", actual);
};


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: CLASSIC BINARY SEARCH
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 1.1 — Basic Binary Search.
// Return index of target, or -1.
// search([-1,0,3,5,9,12], 9) → 4
// search([-1,0,3,5,9,12], 2) → -1
// Time: O(log n), Space: O(1)

function search(nums, target) {
  // YOUR CODE HERE — standard template above
}

assert(search([-1, 0, 3, 5, 9, 12], 9), 4, "search found");
assert(search([-1, 0, 3, 5, 9, 12], 2), -1, "search not found");
assert(search([5], 5), 0, "search single element");


// EXERCISE 1.2 — Find First and Last Position.
// For a sorted array with duplicates, find the [first, last] index of target.
// searchRange([5,7,7,8,8,10], 8) → [3, 4]
// searchRange([5,7,7,8,8,10], 6) → [-1, -1]
// Time: O(log n), Space: O(1)
//
//  Run binary search TWICE:
//    Once biased LEFT (when found, keep going left: right = mid - 1)
//    Once biased RIGHT (when found, keep going right: left = mid + 1)

function searchRange(nums, target) {
  function findLeft(nums, target) {
    // YOUR CODE HERE — binary search biased to keep searching left
  }
  function findRight(nums, target) {
    // YOUR CODE HERE — binary search biased to keep searching right
  }
  return [findLeft(nums, target), findRight(nums, target)];
}

assert(searchRange([5, 7, 7, 8, 8, 10], 8), [3, 4], "searchRange found");
assert(searchRange([5, 7, 7, 8, 8, 10], 6), [-1, -1], "searchRange not found");
assert(searchRange([1], 1), [0, 0], "searchRange single");

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: BINARY SEARCH ON TRANSFORMED ARRAYS
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 2.1 — Search in Rotated Sorted Array.
// A sorted array was rotated at some pivot. Find target.
// searchRotated([4,5,6,7,0,1,2], 0) → 4
// searchRotated([4,5,6,7,0,1,2], 3) → -1
// Time: O(log n), Space: O(1)
//
//  KEY INSIGHT: One half is ALWAYS normally sorted. Use that half to decide
//  which side to search.
//  If left half is sorted AND target is in [nums[left], nums[mid]]: go left.
//  Else: go right.

function searchRotated(nums, target) {
  // YOUR CODE HERE
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) return mid;
    // Determine which side is sorted, then narrow
  }
  return -1;
}

assert(searchRotated([4, 5, 6, 7, 0, 1, 2], 0), 4, "searchRotated 1");
assert(searchRotated([4, 5, 6, 7, 0, 1, 2], 3), -1, "searchRotated not found");
assert(searchRotated([1], 0), -1, "searchRotated single");


// EXERCISE 2.2 — Find Minimum in Rotated Sorted Array.
// findMin([3,4,5,1,2]) → 1
// findMin([4,5,6,7,0,1,2]) → 0
// Time: O(log n), Space: O(1)
//
//  The minimum is the inflection point — where order breaks.
//  If nums[mid] > nums[right]: minimum is in right half (right of mid).
//  Else: minimum is in left half (including mid).

function findMin(nums) {
  // YOUR CODE HERE
}

assert(findMin([3, 4, 5, 1, 2]), 1, "findMin 1");
assert(findMin([4, 5, 6, 7, 0, 1, 2]), 0, "findMin 2");
assert(findMin([11, 13, 15, 17]), 11, "findMin not rotated");

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: BINARY SEARCH ON THE ANSWER
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 POWERFUL PATTERN: When the problem asks "what is the minimum/maximum X
//  such that some condition holds?", binary search the ANSWER SPACE.
//
//  Template:
//    left = min_possible_answer
//    right = max_possible_answer
//    while (left < right):
//      mid = (left + right) / 2
//      if (canAchieve(mid)):
//        right = mid      // try to minimize
//      else:
//        left = mid + 1   // need more

// EXERCISE 3.1 — Koko Eating Bananas.
// Koko eats at speed k (bananas/hour). Must finish all piles within h hours.
// Return minimum k.
// minEatingSpeed([3,6,7,11], 8) → 4
// minEatingSpeed([30,11,23,4,20], 5) → 30
// Time: O(n log m) where m = max(piles)

function minEatingSpeed(piles, h) {
  // YOUR CODE HERE
  // canFinish(k): sum(ceil(pile/k)) <= h
  // Binary search k in [1, max(piles)].
  function canFinish(k) {
    return piles.reduce((total, p) => total + Math.ceil(p / k), 0) <= h;
  }
}

assert(minEatingSpeed([3, 6, 7, 11], 8), 4, "kokoEating 4");
assert(minEatingSpeed([30, 11, 23, 4, 20], 5), 30, "kokoEating 30");


// EXERCISE 3.2 — Capacity to Ship Packages Within D Days.
// A conveyor belt has packages with weights[]. The ship has a max capacity.
// Find the minimum capacity to ship all packages in D days.
// shipWithinDays([1,2,3,4,5,6,7,8,9,10], 5) → 15
// shipWithinDays([3,2,2,4,1,4], 3) → 6
// Time: O(n log(sum - max))

function shipWithinDays(weights, days) {
  // YOUR CODE HERE
  // canShip(capacity): simulate shipping — count days needed greedily.
  // Binary search capacity in [max(weights), sum(weights)].
  function canShip(capacity) {
    let daysNeeded = 1, current = 0;
    for (const w of weights) {
      if (current + w > capacity) { daysNeeded++; current = 0; }
      current += w;
    }
    return daysNeeded <= days;
  }
}

assert(shipWithinDays([1,2,3,4,5,6,7,8,9,10], 5), 15, "ship 15");
assert(shipWithinDays([3,2,2,4,1,4], 3), 6, "ship 6");

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: FINAL CHALLENGES
// ════════════════════════════════════════════════════════════════════════════

// CHALLENGE 4.1 — Median of Two Sorted Arrays (HARD — O(log(min(m,n)))).
// findMedianSortedArrays([1,3], [2]) → 2.0
// findMedianSortedArrays([1,2], [3,4]) → 2.5
//
//  INSIGHT: Binary search on the PARTITION of the smaller array.
//  Find where to cut both arrays so that left halves ≤ right halves.

function findMedianSortedArrays(nums1, nums2) {
  // YOUR CODE HERE — binary search on shorter array's partition
  // Ensure nums1 is the shorter array.
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
  const m = nums1.length, n = nums2.length;
  let left = 0, right = m;
  while (left <= right) {
    const partA = Math.floor((left + right) / 2);
    const partB = Math.floor((m + n + 1) / 2) - partA;
    // Compute maxLeftA, minRightA, maxLeftB, minRightB
    // Check partition validity and compute median
  }
}

assert(findMedianSortedArrays([1, 3], [2]), 2.0, "median [1,3],[2]");
assert(findMedianSortedArrays([1, 2], [3, 4]), 2.5, "median [1,2],[3,4]");


// CHALLENGE 4.2 — Split Array Largest Sum.
// Split nums into k non-empty subarrays to minimise the largest sum.
// splitArray([7,2,5,10,8], 2) → 18   ([7,2,5] and [10,8])
// splitArray([1,2,3,4,5], 2) → 9    ([1,2,3] and [4,5])
// Time: O(n log(sum))
//
//  Binary search on the answer: what is the maximum allowed subarray sum?
//  canSplit(maxSum, k): greedily split and check if ≤ k pieces needed.

function splitArray(nums, k) {
  // YOUR CODE HERE
  function canSplit(maxSum) {
    let parts = 1, current = 0;
    for (const n of nums) {
      if (current + n > maxSum) { parts++; current = 0; }
      current += n;
    }
    return parts <= k;
  }
  // Binary search between max(nums) and sum(nums).
}

assert(splitArray([7, 2, 5, 10, 8], 2), 18, "splitArray 18");
assert(splitArray([1, 2, 3, 4, 5], 2), 9, "splitArray 9");

console.log("=== Sheet 8 complete! Move to dsa_09_sorting.js ===\n");
