// ============================================================================
//  DSA — SHEET 2: SLIDING WINDOW
//  Goal: Replace O(n²) nested loops with O(n) window expansion/contraction.
//        One of the MOST common interview patterns — know it cold.
// ============================================================================
//
//  HOW TO RUN:
//    node dsa_02_sliding_window.js
//
//  PATTERN RECOGNITION — use sliding window when:
//    • "Subarray / substring of size k"     → Fixed window
//    • "Longest / shortest subarray where…" → Variable window
//    • "Max/min sum of contiguous elements" → Fixed window
//    • "All characters / at most k distinct"→ Variable window + hash map
//
//  TWO TEMPLATES:
//
//  Fixed window (size k):
//    Build first window of size k, then slide:
//    for (let i = k; i < n; i++) { add arr[i]; remove arr[i-k]; }
//
//  Variable window (shrink when invalid):
//    let left = 0;
//    for (let right = 0; right < n; right++) {
//      // expand: add arr[right]
//      while (window is INVALID) { // shrink
//        // remove arr[left]; left++;
//      }
//      // window is valid — update answer
//    }
// ============================================================================

const assert = (actual, expected, label) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) console.log("  Expected:", expected, "| Got:", actual);
};


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: FIXED WINDOW
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 1.1 — Maximum Sum Subarray of Size K.
// maxSumSubarray([2,1,5,1,3,2], 3) → 9  (subarray [5,1,3])
// maxSumSubarray([2,3,4,1,5], 2) → 7   (subarray [3,4])
// Time: O(n), Space: O(1)

function maxSumSubarray(arr, k) {
  // YOUR CODE HERE
  // Step 1: compute sum of first window (index 0..k-1)
  // Step 2: slide — for each new element, add it and subtract element leaving
  // Step 3: track max
}

assert(maxSumSubarray([2, 1, 5, 1, 3, 2], 3), 9, "maxSumSubarray 1");
assert(maxSumSubarray([2, 3, 4, 1, 5], 2), 7, "maxSumSubarray 2");


// EXERCISE 1.2 — Find all anagrams of p in s.
// Return the starting indices of p's anagrams in s.
// findAnagrams("cbaebabacd", "abc") → [0, 6]
// findAnagrams("abab", "ab") → [0, 1, 2]
// Time: O(n), Space: O(1) — fixed alphabet size
//
//  KEY IDEA: Two windows of same size. Compare frequency maps.
//  Optimisation: use a single `matches` counter instead of comparing maps.

function findAnagrams(s, p) {
  // YOUR CODE HERE
  // 1. Build pCount map for p.
  // 2. Build sCount map for first window.
  // 3. Count how many characters have matching frequencies (matches counter).
  // 4. Slide: add new char, remove old char, update matches counter.
}

assert(findAnagrams("cbaebabacd", "abc"), [0, 6], "findAnagrams 1");
assert(findAnagrams("abab", "ab"), [0, 1, 2], "findAnagrams 2");

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: VARIABLE WINDOW — EXPAND UNTIL INVALID, SHRINK UNTIL VALID
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 2.1 — Longest Substring Without Repeating Characters.
// lengthOfLongestSubstring("abcabcbb") → 3  ("abc")
// lengthOfLongestSubstring("bbbbb") → 1    ("b")
// lengthOfLongestSubstring("pwwkew") → 3   ("wke")
// Time: O(n), Space: O(min(n, alphabet))

function lengthOfLongestSubstring(s) {
  // YOUR CODE HERE
  // Use a Set (or Map) to track characters in current window.
  // Expand right. If s[right] already in set → shrink from left until removed.
  // Track max window size.
}

assert(lengthOfLongestSubstring("abcabcbb"), 3, "longestSubstring 1");
assert(lengthOfLongestSubstring("bbbbb"), 1, "longestSubstring 2");
assert(lengthOfLongestSubstring("pwwkew"), 3, "longestSubstring 3");
assert(lengthOfLongestSubstring(""), 0, "longestSubstring empty");


// EXERCISE 2.2 — Minimum Size Subarray Sum.
// Find the SMALLEST subarray (contiguous) with sum >= target.
// Return its length. Return 0 if no such subarray.
// minSubarrayLen(7, [2,3,1,2,4,3]) → 2  (subarray [4,3])
// minSubarrayLen(4, [1,4,4]) → 1
// minSubarrayLen(11, [1,1,1,1,1,1,1,1]) → 0
// Time: O(n), Space: O(1)

function minSubarrayLen(target, nums) {
  // YOUR CODE HERE
  // Expand right, adding to sum. While sum >= target: record length, shrink from left.
}

assert(minSubarrayLen(7, [2, 3, 1, 2, 4, 3]), 2, "minSubarrayLen 1");
assert(minSubarrayLen(4, [1, 4, 4]), 1, "minSubarrayLen 2");
assert(minSubarrayLen(11, [1, 1, 1, 1, 1, 1, 1, 1]), 0, "minSubarrayLen no result");


// EXERCISE 2.3 — Longest Substring with At Most K Distinct Characters.
// atMostKDistinct("eceba", 2) → 3  ("ece")
// atMostKDistinct("aa", 1) → 2
// Time: O(n), Space: O(k)

function atMostKDistinct(s, k) {
  // YOUR CODE HERE
  // Use a Map to track char → count in window.
  // Expand right. If map.size > k → shrink from left (decrement count, delete if 0).
}

assert(atMostKDistinct("eceba", 2), 3, "atMostKDistinct 1");
assert(atMostKDistinct("aa", 1), 2, "atMostKDistinct 2");

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: VARIABLE WINDOW — SHRINK AFTER EXPANDING
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 VARIANT: When you want the MINIMUM window containing something.
//  Expand until you HAVE the requirement, then shrink until you DON'T,
//  recording the minimum each time you shrink.

// EXERCISE 3.1 — Minimum Window Substring (HARD — classic FAANG question).
// Find the smallest substring of s that contains all characters of t.
// minWindow("ADOBECODEBANC", "ABC") → "BANC"
// minWindow("a", "a") → "a"
// minWindow("a", "aa") → ""
// Time: O(n + m), Space: O(m)

function minWindow(s, t) {
  // YOUR CODE HERE
  // 1. Build tCount map from t. Track `have` and `need` counters.
  // 2. Expand right. When s[right] is in tCount and window count === tCount:
  //    increment `have`.
  // 3. While have === need: record window, try shrinking from left.
  //    If removing s[left] breaks a required count, decrement `have`.
}

assert(minWindow("ADOBECODEBANC", "ABC"), "BANC", "minWindow 1");
assert(minWindow("a", "a"), "a", "minWindow 2");
assert(minWindow("a", "aa"), "", "minWindow no result");

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: FINAL CHALLENGES
// ════════════════════════════════════════════════════════════════════════════

// CHALLENGE 4.1 — Permutation in String.
// Return true if s2 contains a permutation of s1 as a substring.
// checkInclusion("ab", "eidbaooo") → true   ("ba" at index 3)
// checkInclusion("ab", "eidboaoo") → false
// Time: O(n), Space: O(1)

function checkInclusion(s1, s2) {
  // YOUR CODE HERE — this is findAnagrams returning a boolean
}

assert(checkInclusion("ab", "eidbaooo"), true, "checkInclusion true");
assert(checkInclusion("ab", "eidboaoo"), false, "checkInclusion false");


// CHALLENGE 4.2 — Longest Repeating Character Replacement (MEDIUM-HARD).
// You can replace at most k characters in the string.
// Find the length of the longest substring containing the same character after replacements.
// characterReplacement("AABABBA", 1) → 4
// characterReplacement("ABAB", 2) → 4
//
//  KEY INSIGHT: A window is VALID if (windowSize - maxFreqInWindow) <= k.
//  We only need the count of the MOST frequent character.
//  We never need to shrink `maxCount` — only care about largest valid window seen.

function characterReplacement(s, k) {
  // YOUR CODE HERE
  // Track count[char] for window. Track maxCount (never decrease it).
  // Window is valid when (right - left + 1) - maxCount <= k.
  // If invalid: slide left (decrement count[s[left]], left++).
  // Answer = max window size seen.
}

assert(characterReplacement("AABABBA", 1), 4, "characterReplacement 1");
assert(characterReplacement("ABAB", 2), 4, "characterReplacement 2");

console.log("=== Sheet 2 complete! Move to dsa_03_hash_maps_sets.js ===\n");
