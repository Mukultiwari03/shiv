// ============================================================================
//  DSA — SHEET 5: LINKED LISTS
//  Goal: Build intuition for pointer manipulation. Every linked list problem
//        is solved by drawing the state before and after each pointer move.
// ============================================================================
//
//  HOW TO RUN:
//    node dsa_05_linked_lists.js
//
//  KEY TECHNIQUES:
//    • Dummy head node  — eliminates edge cases at the head
//    • Two pointers     — fast/slow for cycle, middle, nth-from-end
//    • Reversal         — in-place, group-by-k
//    • Merge            — sorted merge, merge k lists
//
//  INTERVIEW TIPS:
//    • ALWAYS draw the list. Write out pointers step by step.
//    • Clarify: singly or doubly linked? Can it have cycles?
//    • Test on: empty list, single node, two nodes.
// ============================================================================

const assert = (actual, expected, label) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) console.log("  Expected:", expected, "| Got:", actual);
};

// Node class used throughout this sheet.
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

// Helpers for testing.
function fromArray(arr) {
  if (!arr.length) return null;
  const head = new ListNode(arr[0]);
  let cur = head;
  for (let i = 1; i < arr.length; i++) { cur.next = new ListNode(arr[i]); cur = cur.next; }
  return head;
}

function toArray(head) {
  const result = [];
  while (head) { result.push(head.val); head = head.next; }
  return result;
}


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: REVERSAL
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 1.1 — Reverse a Linked List (iterative).
// reverseList(1→2→3→4→5) → 5→4→3→2→1
// Time: O(n), Space: O(1)
//
//  POINTER DANCE (draw this!):
//    prev = null, cur = head
//    Loop:
//      next = cur.next
//      cur.next = prev   ← reverse the arrow
//      prev = cur
//      cur = next

function reverseList(head) {
  // YOUR CODE HERE
}

assert(toArray(reverseList(fromArray([1, 2, 3, 4, 5]))), [5, 4, 3, 2, 1], "reverseList");
assert(toArray(reverseList(fromArray([1, 2]))), [2, 1], "reverseList 2");
assert(toArray(reverseList(fromArray([1]))), [1], "reverseList single");
assert(reverseList(null), null, "reverseList null");


// EXERCISE 1.2 — Reverse a Linked List (recursive).
// Same result as above but understand the recursive call stack.
//
//  reverseListRec(1→2→3→4→5):
//    recurse to the end → newHead = 5
//    on the way back: 5.next = 4, then 4.next = 3... etc.

function reverseListRec(head) {
  // YOUR CODE HERE
  // Base case: head is null or head.next is null → return head
  // Recursive case:
  //   const newHead = reverseListRec(head.next)
  //   head.next.next = head   ← make next node point back
  //   head.next = null         ← break forward link
  //   return newHead
}

assert(toArray(reverseListRec(fromArray([1, 2, 3, 4, 5]))), [5, 4, 3, 2, 1], "reverseListRec");

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: FAST & SLOW POINTERS
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 2.1 — Find Middle of Linked List.
// If even number of nodes, return the SECOND middle.
// middleNode(1→2→3→4→5) → 3
// middleNode(1→2→3→4)   → 3 (second middle)
// Time: O(n), Space: O(1)

function middleNode(head) {
  // YOUR CODE HERE — fast moves 2, slow moves 1. When fast reaches end, slow = middle.
}

assert(middleNode(fromArray([1, 2, 3, 4, 5])).val, 3, "middleNode odd");
assert(middleNode(fromArray([1, 2, 3, 4])).val, 3, "middleNode even");


// EXERCISE 2.2 — Detect Cycle in Linked List.
// Return true if the list has a cycle.
// Time: O(n), Space: O(1) — Floyd's algorithm

function hasCycle(head) {
  // YOUR CODE HERE
  // slow = head, fast = head
  // Move slow by 1, fast by 2. If they meet → cycle. If fast reaches null → no cycle.
}

// Build a cycle for testing.
const cycleList = fromArray([3, 2, 0, -4]);
cycleList.next.next.next.next = cycleList.next; // -4 → 2 (cycle at pos 1)
assert(hasCycle(cycleList), true, "hasCycle true");
assert(hasCycle(fromArray([1, 2])), false, "hasCycle false");


// EXERCISE 2.3 — Remove Nth Node From End of List.
// removeNthFromEnd(1→2→3→4→5, 2) → 1→2→3→5
// Time: O(n), Space: O(1)
//
//  TWO POINTER TRICK: Move fast n+1 steps ahead first.
//  Then move both until fast reaches null.
//  Slow is now at the node BEFORE the target. Remove target.

function removeNthFromEnd(head, n) {
  // YOUR CODE HERE
  // Use a dummy node: dummy.next = head. Start fast and slow at dummy.
  // Move fast n+1 times. Then move both until fast is null.
  // slow.next = slow.next.next.
  // Return dummy.next.
}

assert(toArray(removeNthFromEnd(fromArray([1, 2, 3, 4, 5]), 2)), [1, 2, 3, 5], "removeNth 1");
assert(toArray(removeNthFromEnd(fromArray([1]), 1)), [], "removeNth single");
assert(toArray(removeNthFromEnd(fromArray([1, 2]), 1)), [1], "removeNth last");

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: MERGING
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 3.1 — Merge Two Sorted Lists.
// mergeTwoLists(1→2→4, 1→3→4) → 1→1→2→3→4→4
// Time: O(n + m), Space: O(1)

function mergeTwoLists(list1, list2) {
  // YOUR CODE HERE
  // Use a dummy node to avoid head edge case.
  // Compare l1.val and l2.val. Attach the smaller. Advance that pointer.
  // After loop, attach remaining non-null list.
}

assert(toArray(mergeTwoLists(fromArray([1, 2, 4]), fromArray([1, 3, 4]))), [1, 1, 2, 3, 4, 4], "mergeTwoLists");
assert(toArray(mergeTwoLists(null, fromArray([0]))), [0], "mergeTwoLists null");


// EXERCISE 3.2 — Reorder List.
// Given 1→2→3→4→5, reorder to 1→5→2→4→3.
// Pattern: L0→Ln→L1→Ln-1→L2→Ln-2→...
// Time: O(n), Space: O(1)
//
//  THREE STEPS:
//    1. Find the middle (fast/slow).
//    2. Reverse the second half.
//    3. Merge the two halves by interleaving.

function reorderList(head) {
  // YOUR CODE HERE — modifies in place, no return needed.
}

const rl = fromArray([1, 2, 3, 4, 5]);
reorderList(rl);
assert(toArray(rl), [1, 5, 2, 4, 3], "reorderList 5");

const rl2 = fromArray([1, 2, 3, 4]);
reorderList(rl2);
assert(toArray(rl2), [1, 4, 2, 3], "reorderList 4");

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: ADVANCED
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 4.1 — Add Two Numbers (stored in reverse order as linked lists).
// l1 = 2→4→3 (represents 342), l2 = 5→6→4 (represents 465)
// addTwoNumbers(l1, l2) → 7→0→8  (represents 807)
// Time: O(max(m,n)), Space: O(max(m,n))

function addTwoNumbers(l1, l2) {
  // YOUR CODE HERE
  // Process digit by digit, track carry.
  const dummy = new ListNode(0);
  let cur = dummy;
  let carry = 0;
  // while (l1 || l2 || carry) { ... }
}

assert(
  toArray(addTwoNumbers(fromArray([2, 4, 3]), fromArray([5, 6, 4]))),
  [7, 0, 8],
  "addTwoNumbers 342+465=807"
);
assert(
  toArray(addTwoNumbers(fromArray([9, 9, 9, 9, 9, 9, 9]), fromArray([9, 9, 9, 9]))),
  [8, 9, 9, 9, 0, 0, 0, 1],
  "addTwoNumbers carry"
);


// EXERCISE 4.2 — Copy List with Random Pointer.
// Each node has val, next, and random (points to any node or null).
// Return a deep copy.
// Time: O(n), Space: O(n)

class RandomNode {
  constructor(val, next = null, random = null) {
    this.val = val; this.next = next; this.random = random;
  }
}

function copyRandomList(head) {
  // YOUR CODE HERE
  // Use a Map: original node → copy node.
  // First pass: create all copies and store in map.
  // Second pass: wire up next and random using map lookups.
}

// Manual test (random pointers make assert tricky — just verify it runs):
const n1 = new RandomNode(7);
const n2 = new RandomNode(13);
const n3 = new RandomNode(11);
n1.next = n2; n2.next = n3;
n1.random = null; n2.random = n1; n3.random = n3;
const copied = copyRandomList(n1);
assert(copied !== n1, true, "copyRandomList is a new object");
assert(copied.val, 7, "copyRandomList head val");
assert(copied.next.random !== n1, true, "copyRandomList deep (not same ref)");

console.log("=== Sheet 5 complete! Move to dsa_06_trees.js ===\n");
