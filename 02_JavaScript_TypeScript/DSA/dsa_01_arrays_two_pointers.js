// ============================================================================
//  DSA — SHEET 1: ARRAYS & TWO POINTERS
//  Goal: Master the most common interview pattern. Two pointers eliminates
//        the need for nested loops (O(n²) → O(n)) on sorted/sequential data.
// ============================================================================
//
//  HOW TO RUN:
//    node dsa_01_arrays_two_pointers.js
//
//  PATTERN RECOGNITION:
//    • Sorted array + find pair/triplet → Two pointers (opposite ends)
//    • Remove duplicates / partition  → Two pointers (same direction)
//    • Cycle detection in linked list → Fast/slow pointers
//    • Palindrome check               → Two pointers (opposite ends)
// ============================================================================

const assert = (actual, expected, label) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) console.log("  Expected:", expected, "| Got:", actual);
};


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: ARRAY FUNDAMENTALS — TIME COMPLEXITIES TO KNOW COLD
// ════════════════════════════════════════════════════════════════════════════
//
//  OPERATION                   ARRAY     NOTES
//  Access by index             O(1)      arr[i]
//  Push / pop (end)            O(1)      amortised
//  Shift / unshift (front)     O(n)      shifts every element
//  Insert/delete in middle     O(n)      shifts elements
//  Search (unsorted)           O(n)      linear scan
//  Search (sorted)             O(log n)  binary search
//
//  💡 INTERVIEW TIP: "Why is shift() O(n)?"
//  Because every element after index 0 must move one position left.
//  If you need a fast queue, use a pointer instead of shift().

// EXERCISE 1.1 — Reverse an array IN PLACE (no new array).
// reverseInPlace([1,2,3,4,5]) → [5,4,3,2,1]
// Time: O(n), Space: O(1)

function reverseInPlace(arr) {
  // YOUR CODE HERE
  // Hint: two pointers — one at start, one at end. Swap and move inward.
}

const rev = [1, 2, 3, 4, 5];
reverseInPlace(rev);
assert(rev, [5, 4, 3, 2, 1], "reverseInPlace");


// EXERCISE 1.2 — Check if an array is sorted (ascending).
function isSorted(arr) {
  // YOUR CODE HERE
}
assert(isSorted([1, 2, 3, 4]), true, "isSorted true");
assert(isSorted([1, 3, 2, 4]), false, "isSorted false");
assert(isSorted([1]), true, "isSorted single element");

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: TWO POINTERS — OPPOSITE ENDS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Start one pointer at index 0, one at index n-1.
//  Move them inward based on some condition.
//  Works when the array is SORTED or when you're collapsing from both sides.
//
//  Template:
//    let left = 0, right = arr.length - 1;
//    while (left < right) {
//      if (condition) { left++; }
//      else           { right--; }
//    }

// EXERCISE 2.1 — Two Sum II (sorted array).
// Given a SORTED array, find TWO numbers that add up to target.
// Return their 1-based indices.
// twoSum([2,7,11,15], 9) → [1, 2]
// twoSum([2,3,4], 6) → [1, 3]
// Time: O(n), Space: O(1)

function twoSum(numbers, target) {
  // YOUR CODE HERE
  // Hint: if sum < target → move left right. If sum > target → move right left.
}

assert(twoSum([2, 7, 11, 15], 9), [1, 2], "twoSum basic");
assert(twoSum([2, 3, 4], 6), [1, 3], "twoSum mid");
assert(twoSum([-1, 0], -1), [1, 2], "twoSum negative");


// EXERCISE 2.2 — Valid Palindrome.
// A string is a palindrome if it reads the same forwards and backwards,
// ignoring non-alphanumeric characters and case.
// isPalindrome("A man, a plan, a canal: Panama") → true
// isPalindrome("race a car") → false
// Time: O(n), Space: O(1)

function isPalindrome(s) {
  // YOUR CODE HERE
  // Hint: skip non-alphanumeric with a helper. Compare lowercased chars.
  const isAlphaNum = c => /[a-z0-9]/i.test(c);
}

assert(isPalindrome("A man, a plan, a canal: Panama"), true, "palindrome true");
assert(isPalindrome("race a car"), false, "palindrome false");
assert(isPalindrome(" "), true, "palindrome space");


// EXERCISE 2.3 — Container With Most Water (CLASSIC interview problem).
// Given heights array, find two lines that hold the most water.
// maxWater([1,8,6,2,5,4,8,3,7]) → 49
// Time: O(n), Space: O(1)
//
//  KEY INSIGHT: Always move the SHORTER pointer inward.
//  Why? Moving the taller pointer can ONLY decrease or maintain area (width shrinks).
//  Moving the shorter pointer gives a CHANCE to find a taller line and increase area.

function maxWater(height) {
  // YOUR CODE HERE
}

assert(maxWater([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49, "maxWater");
assert(maxWater([1, 1]), 1, "maxWater two equal");

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: TWO POINTERS — SAME DIRECTION (READ/WRITE)
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Use a "slow" writer pointer and a "fast" reader pointer.
//  The writer only advances when it writes a valid element.
//  This modifies the array in-place in O(1) space.
//
//  Template:
//    let write = 0;
//    for (let read = 0; read < arr.length; read++) {
//      if (shouldKeep(arr[read])) {
//        arr[write++] = arr[read];
//      }
//    }

// EXERCISE 3.1 — Remove Duplicates from Sorted Array in-place.
// Modify the array so unique elements fill the start. Return the count.
// removeDuplicates([1,1,2,3,3,3,4]) → 4 (array starts [1,2,3,4,...])
// Time: O(n), Space: O(1)

function removeDuplicates(arr) {
  // YOUR CODE HERE
  // Hint: write pointer starts at 1. Only advance it when arr[read] !== arr[read-1].
}

const arr1 = [1, 1, 2, 3, 3, 3, 4];
assert(removeDuplicates(arr1), 4, "removeDuplicates count");
assert(arr1.slice(0, 4), [1, 2, 3, 4], "removeDuplicates values");


// EXERCISE 3.2 — Move Zeroes to End.
// Move all 0s to the end while keeping the relative order of non-zero elements.
// moveZeroes([0,1,0,3,12]) → [1,3,12,0,0]  (in-place)
// Time: O(n), Space: O(1)

function moveZeroes(arr) {
  // YOUR CODE HERE
  // Hint: write pointer only advances when arr[read] !== 0.
  // After reading loop, fill from write to end with 0s.
}

const arr2 = [0, 1, 0, 3, 12];
moveZeroes(arr2);
assert(arr2, [1, 3, 12, 0, 0], "moveZeroes");

const arr3 = [0, 0, 1];
moveZeroes(arr3);
assert(arr3, [1, 0, 0], "moveZeroes all zeroes front");

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: THREE SUM (REDUCES TO TWO POINTERS)
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: Find all unique triplets that sum to zero.
//  Naive: O(n³). With two pointers after sorting: O(n²).
//
//  ALGORITHM:
//    1. Sort the array.
//    2. Fix one element at index i.
//    3. Run two-pointer on the rest to find pairs summing to -arr[i].
//    4. Skip duplicates at each level to avoid duplicate triplets.
//
//  This pattern — fix one, two-pointer the rest — scales to k-sum problems.

// EXERCISE 4.1 — Three Sum.
// threeSum([-1,0,1,2,-1,-4]) → [[-1,-1,2],[-1,0,1]]
// threeSum([0,1,1]) → []
// threeSum([0,0,0]) → [[0,0,0]]
// Time: O(n²), Space: O(1) excluding output

function threeSum(nums) {
  // YOUR CODE HERE
  // Step 1: sort nums
  // Step 2: for each i from 0..n-3:
  //   - Skip duplicate i values (if nums[i] === nums[i-1] && i > 0, continue)
  //   - Two pointer on i+1..n-1 for pairs summing to -nums[i]
  //   - Skip duplicates in the two-pointer loop too
}

assert(threeSum([-1, 0, 1, 2, -1, -4]), [[-1, -1, 2], [-1, 0, 1]], "threeSum basic");
assert(threeSum([0, 1, 1]), [], "threeSum no result");
assert(threeSum([0, 0, 0]), [[0, 0, 0]], "threeSum all zeros");

console.log("=== Section 4 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: FAST & SLOW POINTERS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: One pointer moves 1 step, the other moves 2 steps.
//  If there's a cycle, the fast pointer will eventually lap the slow pointer
//  and they'll meet. If no cycle, fast reaches the end first.
//
//  Use cases:
//    - Detect cycle in linked list / array
//    - Find middle of linked list
//    - Detect cycle START position (Floyd's algorithm)
//
//  Note: this pattern is used in linked list problems too (Sheet 5).
//  Here we practice on arrays using index jumping.

// EXERCISE 5.1 — Find the duplicate number (cycle in array).
// Given array of n+1 integers where each integer is in [1, n],
// exactly one number is duplicated. Find it WITHOUT modifying the array,
// using O(1) extra space.
// findDuplicate([1,3,4,2,2]) → 2
// findDuplicate([3,1,3,4,2]) → 3
//
//  TRICK: Treat the array like a linked list. arr[i] is the "next" pointer.
//  Since there's a duplicate, there's a cycle (two nodes point to same place).
//  Use Floyd's cycle detection.

function findDuplicate(nums) {
  // YOUR CODE HERE
  // Phase 1: find meeting point inside cycle.
  //   slow = nums[slow]; fast = nums[nums[fast]];
  //   Loop until slow === fast.
  // Phase 2: find cycle entrance.
  //   Reset slow to nums[0]. Move both one step at a time.
  //   Where they meet = the duplicate.
}

assert(findDuplicate([1, 3, 4, 2, 2]), 2, "findDuplicate 2");
assert(findDuplicate([3, 1, 3, 4, 2]), 3, "findDuplicate 3");

console.log("=== Section 5 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: FINAL CHALLENGE
// ════════════════════════════════════════════════════════════════════════════

// CHALLENGE 6.1 — Trapping Rain Water (HARD — top interview question at FAANG).
// Given an array where each element is the height of a bar,
// compute how much water can be trapped after raining.
// trap([0,1,0,2,1,0,1,3,2,1,2,1]) → 6
// trap([4,2,0,3,2,5]) → 9
//
//  TWO POINTER APPROACH (O(n) time, O(1) space):
//  At each position, water = min(maxLeft, maxRight) - height[i]
//  With two pointers, track running maxLeft and maxRight.
//  Always process the side with the SMALLER max (that side's answer is determined).

function trap(height) {
  // YOUR CODE HERE
}

assert(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), 6, "trap water classic");
assert(trap([4, 2, 0, 3, 2, 5]), 9, "trap water 2");


// CHALLENGE 6.2 — Sort Colors (Dutch National Flag problem).
// Sort [0,1,2] in-place using ONE pass, O(1) space.
// sortColors([2,0,2,1,1,0]) → [0,0,1,1,2,2]
//
//  THREE POINTER APPROACH:
//  low = 0 (everything before low is 0)
//  mid = 0 (everything before mid is sorted, currently examining)
//  high = n-1 (everything after high is 2)
//
//  If arr[mid] === 0: swap arr[low] and arr[mid], low++, mid++
//  If arr[mid] === 1: mid++
//  If arr[mid] === 2: swap arr[mid] and arr[high], high-- (don't mid++, need to recheck)

function sortColors(nums) {
  // YOUR CODE HERE
}

const colors = [2, 0, 2, 1, 1, 0];
sortColors(colors);
assert(colors, [0, 0, 1, 1, 2, 2], "sortColors");

console.log("=== Sheet 1 complete! Move to dsa_02_sliding_window.js ===\n");
