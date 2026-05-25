// ============================================================================
//  DSA — SHEET 12: INTERVIEW CHALLENGES (MIXED PATTERNS)
//  Goal: Real interview questions that combine multiple patterns. By now you
//        know every building block — this sheet is about recognising which to use.
// ============================================================================
//
//  HOW TO RUN:
//    node dsa_12_interview_challenges.js
//
//  APPROACH FOR EACH PROBLEM:
//    1. Understand the problem — restate it in your own words.
//    2. Work through examples by hand.
//    3. Identify the pattern (two pointers? DP? hash map? BFS?).
//    4. State time/space complexity BEFORE coding.
//    5. Code. Test against edge cases.
//    6. Optimise if time permits.
// ============================================================================

const assert = (actual, expected, label) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) console.log("  Expected:", expected, "| Got:", actual);
};


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: BACKTRACKING
// ════════════════════════════════════════════════════════════════════════════
//
//  PATTERN: Build a solution incrementally. At each step, try all choices.
//  If a choice leads to an invalid state, UNDO it (backtrack) and try next.
//
//  Template:
//    function backtrack(state, choices) {
//      if (isComplete(state)) { results.push([...state]); return; }
//      for (const choice of choices) {
//        if (!isValid(state, choice)) continue;
//        state.push(choice);             // CHOOSE
//        backtrack(state, nextChoices);  // EXPLORE
//        state.pop();                    // UNCHOOSE (backtrack)
//      }
//    }

// EXERCISE 1.1 — Subsets.
// Return all possible subsets (the power set) of nums.
// subsets([1,2,3]) → [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
// Time: O(n * 2^n), Space: O(n * 2^n)

function subsets(nums) {
  // YOUR CODE HERE
  const result = [];
  function backtrack(start, current) {
    result.push([...current]);
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  backtrack(0, []);
  return result;
}

assert(subsets([1,2,3]).length, 8, "subsets 8");
assert(subsets([0]).length, 2, "subsets 2");


// EXERCISE 1.2 — Permutations.
// Return all permutations of nums (no duplicates in input).
// permutations([1,2,3]) → [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
// Time: O(n!), Space: O(n!)

function permutations(nums) {
  // YOUR CODE HERE
  const result = [];
  function backtrack(current, remaining) {
    if (remaining.length === 0) { result.push([...current]); return; }
    for (let i = 0; i < remaining.length; i++) {
      current.push(remaining[i]);
      backtrack(current, [...remaining.slice(0, i), ...remaining.slice(i + 1)]);
      current.pop();
    }
  }
  backtrack([], nums);
  return result;
}

assert(permutations([1,2,3]).length, 6, "permutations 6");


// EXERCISE 1.3 — Combination Sum.
// Find all combinations of candidates that sum to target (can reuse elements).
// combinationSum([2,3,6,7], 7) → [[2,2,3],[7]]
// Time: O(n^(t/m)) where t=target, m=min candidate

function combinationSum(candidates, target) {
  // YOUR CODE HERE
  const result = [];
  candidates.sort((a, b) => a - b);
  function backtrack(start, current, remaining) {
    if (remaining === 0) { result.push([...current]); return; }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) break; // pruning
      current.push(candidates[i]);
      backtrack(i, current, remaining - candidates[i]); // same i = reuse allowed
      current.pop();
    }
  }
  backtrack(0, [], target);
  return result;
}

assert(combinationSum([2,3,6,7], 7), [[2,2,3],[7]], "combinationSum 1");
assert(combinationSum([2,3,5], 8), [[2,2,2,2],[2,3,3],[3,5]], "combinationSum 2");

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: TRIE
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: A prefix tree. Each node represents a character.
//  Root to a leaf = a word. Common prefixes are shared.
//  Use for: autocomplete, word search, spell check.
//
//  Operations: insert, search, startsWith — all O(m) where m = word length.

class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word) {
    // YOUR CODE HERE
    // Walk from root, create nodes as needed. Mark isEndOfWord at the end.
  }

  search(word) {
    // YOUR CODE HERE — return true only if word exists AND isEndOfWord
  }

  startsWith(prefix) {
    // YOUR CODE HERE — return true if any word starts with prefix
  }
}

const trie = new Trie();
trie.insert("apple");
assert(trie.search("apple"), true, "trie search apple");
assert(trie.search("app"), false, "trie search app (not inserted)");
assert(trie.startsWith("app"), true, "trie startsWith app");
trie.insert("app");
assert(trie.search("app"), true, "trie search app (now inserted)");


// EXERCISE 2.1 — Word Search II.
// Given a board of characters and a list of words, find all words in the board.
// (Characters can connect horizontally/vertically, same cell not reused.)
// Time: O(m*n*4^L) where L = word length. With Trie: much better in practice.

function findWords(board, words) {
  // YOUR CODE HERE
  // 1. Build a Trie from all words.
  // 2. DFS from every cell, following Trie paths.
  // 3. When isEndOfWord is reached: add word to results.
  // 4. Mark cell visited during DFS, restore after.
  const trie = new Trie();
  for (const w of words) trie.insert(w);
  const result = new Set();
  const m = board.length, n = board[0].length;
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];

  function dfs(node, r, c, path) {
    // ...
  }

  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++)
      dfs(trie.root, r, c, "");

  return [...result];
}

const board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]];
const foundWords = findWords(board, ["oath","pea","eat","rain"]);
foundWords.sort();
assert(foundWords, ["eat","oath"], "findWords");

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: CLASSIC COMPANY PROBLEMS
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 3.1 — Product of Array Except Self.
// Return array where output[i] = product of all elements except nums[i].
// No division allowed. O(n) time, O(1) extra space.
// productExceptSelf([1,2,3,4]) → [24,12,8,6]

function productExceptSelf(nums) {
  // YOUR CODE HERE
  // Two passes:
  //   Left pass: result[i] = product of all elements LEFT of i.
  //   Right pass: multiply result[i] by product of all elements RIGHT of i.
}

assert(productExceptSelf([1,2,3,4]), [24,12,8,6], "productExceptSelf 1");
assert(productExceptSelf([-1,1,0,-3,3]), [0,0,9,0,0], "productExceptSelf 2");


// EXERCISE 3.2 — Spiral Matrix.
// Return all elements in spiral order.
// spiralOrder([[1,2,3],[4,5,6],[7,8,9]]) → [1,2,3,6,9,8,7,4,5]
// Time: O(m*n), Space: O(1)

function spiralOrder(matrix) {
  // YOUR CODE HERE
  // Track four boundaries: top, bottom, left, right.
  // Traverse: right across top, down right side, left across bottom, up left side.
  // Shrink boundaries after each direction. Stop when top > bottom or left > right.
}

assert(spiralOrder([[1,2,3],[4,5,6],[7,8,9]]), [1,2,3,6,9,8,7,4,5], "spiralOrder 3x3");
assert(spiralOrder([[1,2,3,4],[5,6,7,8],[9,10,11,12]]), [1,2,3,4,8,12,11,10,9,5,6,7], "spiralOrder 3x4");


// EXERCISE 3.3 — Jump Game.
// Can you reach the last index? nums[i] = max jump length from i.
// canJump([2,3,1,1,4]) → true
// canJump([3,2,1,0,4]) → false
// GREEDY: track the max reachable index.

function canJump(nums) {
  // YOUR CODE HERE
}

assert(canJump([2,3,1,1,4]), true, "canJump true");
assert(canJump([3,2,1,0,4]), false, "canJump false");


// EXERCISE 3.4 — Gas Station (circular).
// You can complete the circuit if total gas >= total cost.
// If possible, there's exactly one valid starting station. Find it.
// canCompleteCircuit([1,2,3,4,5],[3,4,5,1,2]) → 3
// Time: O(n), Space: O(1)
//
//  KEY INSIGHTS:
//  1. If total gas >= total cost, a solution always exists.
//  2. If you run out of gas at station k, none of 0..k can be the start.
//     So start = k + 1.

function canCompleteCircuit(gas, cost) {
  // YOUR CODE HERE
}

assert(canCompleteCircuit([1,2,3,4,5],[3,4,5,1,2]), 3, "gasStation 3");
assert(canCompleteCircuit([2,3,4],[3,4,3]), -1, "gasStation -1");

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: BIT MANIPULATION (quick reference)
// ════════════════════════════════════════════════════════════════════════════
//
//  OPERATIONS:
//    n & 1          — check if odd (last bit)
//    n >> 1         — divide by 2 (right shift)
//    n << 1         — multiply by 2 (left shift)
//    n & (n - 1)    — clear lowest set bit (also: is power of 2 if n & (n-1) === 0)
//    n ^ n          — 0 (XOR with itself)
//    0 ^ n          — n (XOR with 0)
//    a ^ b ^ a      — b (XOR cancels pairs)

// EXERCISE 4.1 — Single Number.
// Every element appears twice except one. Find it.
// XOR all numbers: pairs cancel, single remains.
// singleNumber([2,2,1]) → 1
// singleNumber([4,1,2,1,2]) → 4

function singleNumber(nums) {
  // YOUR CODE HERE — one line with reduce
}

assert(singleNumber([2,2,1]), 1, "singleNumber 1");
assert(singleNumber([4,1,2,1,2]), 4, "singleNumber 4");


// EXERCISE 4.2 — Count Bits.
// For every number 0..n, return how many 1s in binary representation.
// countBits(5) → [0,1,1,2,1,2]
// dp: bits[i] = bits[i >> 1] + (i & 1)

function countBits(n) {
  // YOUR CODE HERE
}

assert(countBits(2), [0,1,1], "countBits 2");
assert(countBits(5), [0,1,1,2,1,2], "countBits 5");

console.log("=== Sheet 12 complete! You've finished all DSA sheets! ===");
console.log("Now move to the SystemDesign/ folder for the other half of interviews.\n");
