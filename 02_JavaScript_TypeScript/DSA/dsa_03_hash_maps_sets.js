// ============================================================================
//  DSA — SHEET 3: HASH MAPS & SETS
//  Goal: Use O(1) lookups to eliminate nested loops. Hash maps are the most
//        powerful tool in your DSA toolkit — used in ~50% of medium problems.
// ============================================================================
//
//  HOW TO RUN:
//    node dsa_03_hash_maps_sets.js
//
//  PATTERN RECOGNITION — reach for a Map/Set when:
//    • "Have we seen this before?"          → Set
//    • "How many times have we seen X?"     → Map (frequency)
//    • "Find complement / pair"             → Map (store what you've seen)
//    • "Group items by property"            → Map (key → array)
//    • "Count distinct items"               → Set / Map
//
//  JS QUICK REFERENCE:
//    const map = new Map();
//    map.set(key, value);   map.get(key);   map.has(key);   map.delete(key);
//    map.size;              for (const [k, v] of map) { }
//
//    const set = new Set();
//    set.add(val);   set.has(val);   set.delete(val);   set.size;
// ============================================================================

const assert = (actual, expected, label) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) console.log("  Expected:", expected, "| Got:", actual);
};


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: FREQUENCY COUNTING
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 1.1 — Two Sum (UNSORTED — use a Map).
// Find two numbers that add to target. Return their indices.
// twoSum([2,7,11,15], 9) → [0, 1]
// twoSum([3,2,4], 6) → [1, 2]
// Time: O(n), Space: O(n)
//
//  KEY IDEA: For each num, check if (target - num) is already in the map.
//  If yes → found the pair. If no → store num → index in map.

function twoSum(nums, target) {
  // YOUR CODE HERE
}

assert(twoSum([2, 7, 11, 15], 9), [0, 1], "twoSum 1");
assert(twoSum([3, 2, 4], 6), [1, 2], "twoSum 2");
assert(twoSum([3, 3], 6), [0, 1], "twoSum duplicate");


// EXERCISE 1.2 — Top K Frequent Elements.
// Return the k most frequent elements. Order doesn't matter.
// topKFrequent([1,1,1,2,2,3], 2) → [1, 2]
// topKFrequent([1], 1) → [1]
// Time: O(n log k) with sorting; O(n) with bucket sort

function topKFrequent(nums, k) {
  // YOUR CODE HERE
  // Step 1: build frequency map.
  // Step 2: sort entries by frequency descending.
  // Step 3: return first k keys.
  // BONUS: try bucket sort for O(n) — bucket[freq] = [elements with that freq]
}

assert(topKFrequent([1, 1, 1, 2, 2, 3], 2), [1, 2], "topKFrequent 1");
assert(topKFrequent([1], 1), [1], "topKFrequent single");


// EXERCISE 1.3 — Valid Anagram.
// Check if t is an anagram of s (same letters, different arrangement).
// isAnagram("anagram", "nagaram") → true
// isAnagram("rat", "car") → false
// Time: O(n), Space: O(1) — fixed alphabet

function isAnagram(s, t) {
  // YOUR CODE HERE
}

assert(isAnagram("anagram", "nagaram"), true, "isAnagram true");
assert(isAnagram("rat", "car"), false, "isAnagram false");
assert(isAnagram("ab", "a"), false, "isAnagram different lengths");

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: GROUPING
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 2.1 — Group Anagrams.
// Group strings that are anagrams of each other.
// groupAnagrams(["eat","tea","tan","ate","nat","bat"]) → [["bat"],["nat","tan"],["ate","eat","tea"]]
// Order of groups and elements within groups doesn't matter.
// Time: O(n * m log m) where m = average string length

function groupAnagrams(strs) {
  // YOUR CODE HERE
  // KEY: the sorted version of an anagram is the SAME → use as map key.
  // Map: sorted_str → [original strings with that sorted form]
}

const ga = groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]);
ga.sort((a, b) => a[0].localeCompare(b[0]));
ga.forEach(g => g.sort());
assert(ga, [["bat"], ["ate", "eat", "tea"], ["nat", "tan"]], "groupAnagrams");


// EXERCISE 2.2 — Subarray Sum Equals K.
// Count the number of subarrays that sum to k.
// subarraySum([1,1,1], 2) → 2
// subarraySum([1,2,3], 3) → 2
// Time: O(n), Space: O(n)
//
//  💡 KEY INSIGHT: Prefix sums!
//  If prefixSum[j] - prefixSum[i] = k, then subarray [i+1..j] sums to k.
//  Store how many times each prefix sum has appeared.
//  For each new prefix sum: answer += map.get(prefixSum - k) || 0.

function subarraySum(nums, k) {
  // YOUR CODE HERE
  // Initialize: map.set(0, 1) — one way to have prefix sum of 0 (empty prefix).
}

assert(subarraySum([1, 1, 1], 2), 2, "subarraySum 1");
assert(subarraySum([1, 2, 3], 3), 2, "subarraySum 2");
assert(subarraySum([1, -1, 1], 1), 3, "subarraySum with negatives");

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: SET-BASED PROBLEMS
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 3.1 — Longest Consecutive Sequence.
// Find the length of the longest consecutive integer sequence.
// longestConsecutive([100,4,200,1,3,2]) → 4  (1,2,3,4)
// longestConsecutive([0,3,7,2,5,8,4,6,0,1]) → 9
// Time: O(n), Space: O(n)
//
//  💡 KEY INSIGHT: Only start counting from the BEGINNING of a sequence.
//  A number n is a sequence start if (n-1) is NOT in the set.
//  Then count upward from n. This ensures each number is visited at most twice.

function longestConsecutive(nums) {
  // YOUR CODE HERE
  // Step 1: put all nums in a Set.
  // Step 2: for each num, if (num-1) not in set: count streak from num.
  // Step 3: track max streak.
}

assert(longestConsecutive([100, 4, 200, 1, 3, 2]), 4, "longestConsecutive 1");
assert(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]), 9, "longestConsecutive 2");


// EXERCISE 3.2 — Contains Duplicate Within K Distance.
// Return true if any two elements are equal and at most k indices apart.
// containsNearbyDuplicate([1,2,3,1], 3) → true
// containsNearbyDuplicate([1,0,1,1], 1) → true
// containsNearbyDuplicate([1,2,3,1,2,3], 2) → false
// Time: O(n), Space: O(k)
//
//  USE A SLIDING WINDOW SET: maintain a Set of the last k elements.

function containsNearbyDuplicate(nums, k) {
  // YOUR CODE HERE
}

assert(containsNearbyDuplicate([1, 2, 3, 1], 3), true, "nearbyDuplicate 1");
assert(containsNearbyDuplicate([1, 0, 1, 1], 1), true, "nearbyDuplicate 2");
assert(containsNearbyDuplicate([1, 2, 3, 1, 2, 3], 2), false, "nearbyDuplicate 3");

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: ENCODE / DECODE & DESIGN PROBLEMS
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 4.1 — Design a data structure that supports:
//   insert(val) → O(1) average
//   remove(val) → O(1) average
//   getRandom()  → O(1) — each element equally likely
//
//  This is asked at Google, Facebook, Amazon.
//  TRICK: Use an array + a Map (val → index).
//  To remove without O(n) shift: swap with LAST element, then pop.

class RandomizedSet {
  constructor() {
    // YOUR CODE HERE: initialize array and map
  }

  insert(val) {
    // YOUR CODE HERE: return true if inserted (wasn't already present)
  }

  remove(val) {
    // YOUR CODE HERE: return true if removed (was present)
    // Trick: swap val with last element, update map, pop array.
  }

  getRandom() {
    // YOUR CODE HERE: return random element from array
    const idx = Math.floor(Math.random() * this.vals.length);
    return this.vals[idx];
  }
}

const rs = new RandomizedSet();
assert(rs.insert(1), true, "insert 1");
assert(rs.insert(2), true, "insert 2");
assert(rs.insert(1), false, "insert duplicate");
assert(rs.remove(1), true, "remove 1");
assert(rs.remove(3), false, "remove non-existent");
const rand = rs.getRandom();
assert(rand === 2, true, "getRandom only element");

console.log("=== Section 4 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: LRU CACHE (DESIGN — ASKED AT TOP COMPANIES)
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 THEORY: LRU Cache evicts the Least Recently Used item when full.
//
//  OPTIMAL APPROACH: Map + Doubly Linked List
//    • Map gives O(1) lookup by key
//    • DLL gives O(1) move-to-front (most recently used) and O(1) remove-tail (LRU)
//
//  JAVASCRIPT TRICK: Map preserves INSERTION ORDER.
//  You can fake a DLL using Map's order:
//    delete key + re-set key → moves to "end" (most recent)
//    first key in map → least recently used
//  This gives O(1) get/put with much simpler code.

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // key → value, insertion order = LRU order
  }

  get(key) {
    // YOUR CODE HERE
    // If key not in cache: return -1.
    // Else: delete then re-set (promotes to most recent). Return value.
  }

  put(key, value) {
    // YOUR CODE HERE
    // If key exists: delete it first (will re-insert as most recent).
    // If at capacity: delete the FIRST entry (cache.keys().next().value).
    // Set key → value.
  }
}

const lru = new LRUCache(2);
lru.put(1, 1);
lru.put(2, 2);
assert(lru.get(1), 1, "LRU get 1");     // returns 1, promotes 1 to recent
lru.put(3, 3);                           // evicts key 2 (LRU)
assert(lru.get(2), -1, "LRU evicted 2");
lru.put(4, 4);                           // evicts key 1
assert(lru.get(1), -1, "LRU evicted 1");
assert(lru.get(3), 3, "LRU get 3");
assert(lru.get(4), 4, "LRU get 4");

console.log("=== Sheet 3 complete! Move to dsa_04_stacks_queues.js ===\n");
