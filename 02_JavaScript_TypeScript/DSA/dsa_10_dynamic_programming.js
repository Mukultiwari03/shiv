// ============================================================================
//  DSA — SHEET 10: DYNAMIC PROGRAMMING
//  Goal: DP = recursion + memoization. Identify the subproblem, define the
//        recurrence, and choose top-down (memo) or bottom-up (tabulation).
// ============================================================================
//
//  HOW TO RUN:
//    node dsa_10_dynamic_programming.js
//
//  DP RECOGNITION CHECKLIST:
//    ✓ "How many ways to..."
//    ✓ "Maximum / minimum..."
//    ✓ "Can you reach / is it possible..."
//    ✓ Overlapping subproblems (same computation repeated)
//    ✓ Optimal substructure (optimal solution uses optimal sub-solutions)
//
//  TWO APPROACHES:
//    Top-down (memoization):
//      Write the recursive solution. Add a cache. Return cached result if hit.
//      Easier to write. Same complexity as bottom-up.
//
//    Bottom-up (tabulation):
//      Fill a DP array/table iteratively from base cases upward.
//      No recursion overhead. Often slightly faster in practice.
//
//  DP PATTERNS:
//    Linear:           Fibonacci, climbing stairs, house robber
//    Grid:             Unique paths, min path sum
//    String:           Longest common subsequence, edit distance
//    Interval:         Burst balloons, matrix chain multiply
//    Knapsack:         0/1 knapsack, coin change, partition equal subset
// ============================================================================

const assert = (actual, expected, label) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) console.log("  Expected:", expected, "| Got:", actual);
};


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: LINEAR DP — 1D PROBLEMS
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 1.1 — Climbing Stairs.
// To climb n stairs, you can take 1 or 2 steps. How many distinct ways?
// climbStairs(2) → 2   (1+1, 2)
// climbStairs(3) → 3   (1+1+1, 1+2, 2+1)
// It's Fibonacci! dp[n] = dp[n-1] + dp[n-2]

function climbStairs(n) {
  // YOUR CODE HERE — use O(1) space (only need last two values)
}

assert(climbStairs(2), 2, "climbStairs 2");
assert(climbStairs(3), 3, "climbStairs 3");
assert(climbStairs(5), 8, "climbStairs 5");


// EXERCISE 1.2 — House Robber.
// Rob houses on a street. No two adjacent houses. Maximize loot.
// rob([1,2,3,1]) → 4   (rob house 0 and 2: 1+3)
// rob([2,7,9,3,1]) → 12  (rob 0,2,4: 2+9+1)
// dp[i] = max(dp[i-1], dp[i-2] + nums[i])

function rob(nums) {
  // YOUR CODE HERE — O(1) space with two variables
}

assert(rob([1, 2, 3, 1]), 4, "rob 1");
assert(rob([2, 7, 9, 3, 1]), 12, "rob 2");
assert(rob([1]), 1, "rob single");


// EXERCISE 1.3 — House Robber II (circular street — houses 0 and n-1 are adjacent).
// robII([2,3,2]) → 3
// robII([1,2,3,1]) → 4
// TRICK: Run House Robber I TWICE — once on [0..n-2], once on [1..n-1]. Take max.

function robII(nums) {
  // YOUR CODE HERE
}

assert(robII([2, 3, 2]), 3, "robII 1");
assert(robII([1, 2, 3, 1]), 4, "robII 2");


// EXERCISE 1.4 — Longest Increasing Subsequence.
// Length of the longest strictly increasing subsequence.
// lengthOfLIS([10,9,2,5,3,7,101,18]) → 4  ([2,3,7,101] or [2,5,7,101])
// Time: O(n²) DP or O(n log n) with patience sort / binary search

function lengthOfLIS(nums) {
  // YOUR CODE HERE — O(n²) DP is fine for interview
  // dp[i] = length of LIS ending at index i (minimum 1).
  // For each i: dp[i] = 1 + max(dp[j]) for all j < i where nums[j] < nums[i].
}

assert(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]), 4, "LIS 4");
assert(lengthOfLIS([0, 1, 0, 3, 2, 3]), 4, "LIS 4 b");
assert(lengthOfLIS([7, 7, 7, 7]), 1, "LIS all same");

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: GRID DP
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 2.1 — Unique Paths.
// A robot in an m×n grid. Can only move right or down. How many paths to bottom-right?
// uniquePaths(3, 7) → 28
// uniquePaths(3, 2) → 3
// dp[i][j] = dp[i-1][j] + dp[i][j-1]

function uniquePaths(m, n) {
  // YOUR CODE HERE — can optimise to O(n) space with 1D array
}

assert(uniquePaths(3, 7), 28, "uniquePaths 3x7");
assert(uniquePaths(3, 2), 3, "uniquePaths 3x2");


// EXERCISE 2.2 — Minimum Path Sum.
// Find minimum sum path from top-left to bottom-right (only right/down moves).
// minPathSum([[1,3,1],[1,5,1],[4,2,1]]) → 7  (1→3→1→1→1)

function minPathSum(grid) {
  // YOUR CODE HERE — modify grid in place to save space, or use dp[][] copy
  // dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
}

assert(minPathSum([[1,3,1],[1,5,1],[4,2,1]]), 7, "minPathSum 1");
assert(minPathSum([[1,2,3],[4,5,6]]), 12, "minPathSum 2");

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: KNAPSACK / SUBSET PATTERNS
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 3.1 — Coin Change.
// Fewest coins to make amount. Return -1 if impossible.
// coinChange([1,5,11], 15) → 3  (use three 5s)
// coinChange([2], 3) → -1
// dp[i] = min coins to make amount i.
// dp[i] = 1 + min(dp[i - coin]) for each coin.

function coinChange(coins, amount) {
  // YOUR CODE HERE
  // dp array of size amount+1, filled with Infinity.
  // dp[0] = 0.
  // For each amount i from 1..amount:
  //   for each coin: if coin <= i: dp[i] = min(dp[i], dp[i-coin]+1)
}

assert(coinChange([1, 5, 11], 15), 3, "coinChange 15");
assert(coinChange([2], 3), -1, "coinChange impossible");
assert(coinChange([1, 2, 5], 11), 3, "coinChange 11");


// EXERCISE 3.2 — Partition Equal Subset Sum.
// Can we partition array into two subsets with equal sum?
// canPartition([1,5,11,5]) → true  ([1,5,5] and [11])
// canPartition([1,2,3,5]) → false
// This is the 0/1 knapsack problem in disguise.
// Target = totalSum / 2. Can we find a subset summing to target?

function canPartition(nums) {
  // YOUR CODE HERE
  // If totalSum is odd → false.
  // dp[j] = true if subset summing to j exists.
  // For each num: iterate j from target down to num (backwards to avoid reuse).
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;
  // dp array of size target+1, dp[0] = true.
}

assert(canPartition([1, 5, 11, 5]), true, "canPartition true");
assert(canPartition([1, 2, 3, 5]), false, "canPartition false");

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: STRING DP
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 4.1 — Longest Common Subsequence.
// LCS("abcde", "ace") → 3  ("ace")
// LCS("abc", "abc") → 3
// LCS("abc", "def") → 0
// dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]
// If chars match: dp[i][j] = 1 + dp[i-1][j-1]
// Else:           dp[i][j] = max(dp[i-1][j], dp[i][j-1])

function longestCommonSubsequence(text1, text2) {
  // YOUR CODE HERE — 2D DP table
}

assert(longestCommonSubsequence("abcde", "ace"), 3, "LCS 3");
assert(longestCommonSubsequence("abc", "abc"), 3, "LCS identical");
assert(longestCommonSubsequence("abc", "def"), 0, "LCS 0");


// EXERCISE 4.2 — Edit Distance (Levenshtein).
// Min operations (insert, delete, replace) to convert word1 to word2.
// minDistance("horse","ros") → 3
// minDistance("intention","execution") → 5
// dp[i][j] = edit distance between word1[0..i-1] and word2[0..j-1].
// If match: dp[i][j] = dp[i-1][j-1].
// Else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
//                          delete      insert      replace

function minDistance(word1, word2) {
  // YOUR CODE HERE
}

assert(minDistance("horse", "ros"), 3, "editDistance 3");
assert(minDistance("intention", "execution"), 5, "editDistance 5");


// EXERCISE 4.3 — Word Break.
// Can s be segmented into dictionary words?
// wordBreak("leetcode", ["leet","code"]) → true
// wordBreak("applepenapple", ["apple","pen"]) → true
// wordBreak("catsandog", ["cats","dog","sand","and","cat"]) → false

function wordBreak(s, wordDict) {
  // YOUR CODE HERE
  // dp[i] = can s[0..i-1] be segmented?
  // dp[0] = true (empty string)
  // For each i: for each word in dict:
  //   if dp[i - word.length] && s.slice(i - word.length, i) === word: dp[i] = true
  const wordSet = new Set(wordDict);
}

assert(wordBreak("leetcode", ["leet", "code"]), true, "wordBreak 1");
assert(wordBreak("applepenapple", ["apple", "pen"]), true, "wordBreak 2");
assert(wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"]), false, "wordBreak 3");

console.log("=== Sheet 10 complete! Move to dsa_11_heaps.js ===\n");
