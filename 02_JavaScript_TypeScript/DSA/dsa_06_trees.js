// ============================================================================
//  DSA — SHEET 6: TREES (BFS & DFS)
//  Goal: Master tree traversal. Every tree problem is either:
//        1) DFS — go deep, combine results coming back up.
//        2) BFS — level by level, use a queue.
// ============================================================================
//
//  HOW TO RUN:
//    node dsa_06_trees.js
//
//  DFS TRAVERSALS (recursive, O(n) time & space):
//    Inorder:   left → root → right   (gives SORTED output for BST)
//    Preorder:  root → left → right   (useful for copying/serializing tree)
//    Postorder: left → right → root   (useful for deleting/evaluating tree)
//
//  BFS (level-order): use a QUEUE. Process all nodes at depth d before d+1.
//    while (queue not empty):
//      levelSize = queue.length
//      for i in 0..levelSize:
//        node = queue.dequeue()
//        process node
//        if node.left: queue.enqueue(node.left)
//        if node.right: queue.enqueue(node.right)
//
//  INTERVIEW MENTAL MODEL:
//    "At each node, what information do I need from my children?"
//    Return that information upward. Often: (result, some_aggregate).
// ============================================================================

const assert = (actual, expected, label) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) console.log("  Expected:", expected, "| Got:", actual);
};

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val; this.left = left; this.right = right;
  }
}

// Build tree from level-order array (null = missing node).
function buildTree(arr) {
  if (!arr || !arr.length || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (queue.length && i < arr.length) {
    const node = queue.shift();
    if (arr[i] !== null && arr[i] !== undefined) {
      node.left = new TreeNode(arr[i]); queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
      node.right = new TreeNode(arr[i]); queue.push(node.right);
    }
    i++;
  }
  return root;
}


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: DFS TRAVERSALS
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 1.1 — All three DFS traversals (recursive).

function inorder(root) {
  // YOUR CODE HERE — left, root, right
  // Base case: if (!root) return []
  // return [...inorder(root.left), root.val, ...inorder(root.right)]
}

function preorder(root) {
  // YOUR CODE HERE — root, left, right
}

function postorder(root) {
  // YOUR CODE HERE — left, right, root
}

const t1 = buildTree([1, null, 2, 3]);
assert(inorder(t1), [1, 3, 2], "inorder");
assert(preorder(t1), [1, 2, 3], "preorder");
assert(postorder(t1), [3, 2, 1], "postorder");


// EXERCISE 1.2 — Max Depth of Binary Tree.
// maxDepth([3,9,20,null,null,15,7]) → 3
// Time: O(n), Space: O(h) where h = height

function maxDepth(root) {
  // YOUR CODE HERE
  // Base: null → 0.
  // Return 1 + max(maxDepth(left), maxDepth(right)).
}

assert(maxDepth(buildTree([3, 9, 20, null, null, 15, 7])), 3, "maxDepth 1");
assert(maxDepth(buildTree([1, null, 2])), 2, "maxDepth 2");
assert(maxDepth(null), 0, "maxDepth null");


// EXERCISE 1.3 — Diameter of Binary Tree.
// The diameter = length of the longest path between any two nodes.
// The path may or may not pass through the root.
// diameterOfBinaryTree([1,2,3,4,5]) → 3  (path: 4→2→1→3 or 5→2→1→3)
// Time: O(n), Space: O(h)
//
//  KEY INSIGHT: At each node, the diameter through that node =
//  depth(left) + depth(right). Track a global max.

function diameterOfBinaryTree(root) {
  // YOUR CODE HERE
  // Use a helper that returns the depth of the subtree.
  // Inside the helper, update a closure variable `maxDiameter`.
  let maxDiameter = 0;
  function depth(node) {
    // return depth, update maxDiameter as side effect
  }
  depth(root);
  return maxDiameter;
}

assert(diameterOfBinaryTree(buildTree([1, 2, 3, 4, 5])), 3, "diameter 1");
assert(diameterOfBinaryTree(buildTree([1, 2])), 1, "diameter 2");

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: BFS — LEVEL ORDER
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 2.1 — Level Order Traversal.
// Return values grouped by level.
// levelOrder([3,9,20,null,null,15,7]) → [[3],[9,20],[15,7]]
// Time: O(n), Space: O(n)

function levelOrder(root) {
  // YOUR CODE HERE
  // Queue starts with [root].
  // Each iteration: process all nodes at current level (queue.length snapshot).
  // Push children of each node.
}

assert(levelOrder(buildTree([3, 9, 20, null, null, 15, 7])), [[3], [9, 20], [15, 7]], "levelOrder");
assert(levelOrder(null), [], "levelOrder null");


// EXERCISE 2.2 — Right Side View.
// Return the values visible when looking at the tree from the right.
// rightSideView([1,2,3,null,5,null,4]) → [1,3,4]
// Time: O(n), Space: O(n)
//
//  KEY: Last node at each BFS level = right side view.

function rightSideView(root) {
  // YOUR CODE HERE
}

assert(rightSideView(buildTree([1, 2, 3, null, 5, null, 4])), [1, 3, 4], "rightSideView 1");
assert(rightSideView(buildTree([1, null, 3])), [1, 3], "rightSideView 2");


// EXERCISE 2.3 — Binary Tree Level Order Zigzag.
// Alternate direction each level: left→right, right→left, left→right...
// zigzagLevelOrder([3,9,20,null,null,15,7]) → [[3],[20,9],[15,7]]
// Time: O(n), Space: O(n)

function zigzagLevelOrder(root) {
  // YOUR CODE HERE — same as levelOrder but reverse every other level.
}

assert(zigzagLevelOrder(buildTree([3, 9, 20, null, null, 15, 7])), [[3], [20, 9], [15, 7]], "zigzag");

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: BINARY SEARCH TREES
// ════════════════════════════════════════════════════════════════════════════
//
//  BST PROPERTY: for every node, all values in LEFT subtree < node.val,
//  all values in RIGHT subtree > node.val.
//  INORDER of a BST gives a SORTED sequence.

// EXERCISE 3.1 — Validate BST.
// isValidBST([2,1,3]) → true
// isValidBST([5,1,4,null,null,3,6]) → false (4 is in right subtree of 5 but < 5)
// Time: O(n), Space: O(h)
//
//  TRICK: Pass min and max bounds down. Each node must be in (min, max).

function isValidBST(root) {
  // YOUR CODE HERE
  function validate(node, min, max) {
    // if !node: return true
    // if node.val <= min || node.val >= max: return false
    // return validate(left, min, node.val) && validate(right, node.val, max)
  }
  return validate(root, -Infinity, Infinity);
}

assert(isValidBST(buildTree([2, 1, 3])), true, "isValidBST true");
assert(isValidBST(buildTree([5, 1, 4, null, null, 3, 6])), false, "isValidBST false");


// EXERCISE 3.2 — Lowest Common Ancestor of BST.
// lcaBST(root, p, q): find LCA of nodes with values p and q.
// If both p and q < node.val → go left.
// If both p and q > node.val → go right.
// Otherwise → current node is LCA.
// Time: O(h), Space: O(1)

function lcaBST(root, p, q) {
  // YOUR CODE HERE
}

const bst = buildTree([6, 2, 8, 0, 4, 7, 9, null, null, 3, 5]);
assert(lcaBST(bst, 2, 8).val, 6, "lcaBST 2,8");
assert(lcaBST(bst, 2, 4).val, 2, "lcaBST 2,4");

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: ADVANCED DFS — RETURN VALUES UP THE TREE
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 4.1 — Binary Tree Maximum Path Sum (HARD — FAANG favourite).
// A path goes from any node to any node (no repeating). Find the max sum.
// maxPathSum([-10,9,20,null,null,15,7]) → 42  (15+20+7)
// Time: O(n), Space: O(h)
//
//  AT EACH NODE: max gain this subtree can contribute upward = node.val + max(left, right, 0).
//  The path THROUGH this node = node.val + max(left,0) + max(right,0).
//  Update global max with that, but return only one branch upward.

function maxPathSum(root) {
  let maxSum = -Infinity;
  function gain(node) {
    // YOUR CODE HERE
    // if !node: return 0
    // leftGain = max(gain(left), 0)
    // rightGain = max(gain(right), 0)
    // maxSum = max(maxSum, node.val + leftGain + rightGain)
    // return node.val + max(leftGain, rightGain)
  }
  gain(root);
  return maxSum;
}

assert(maxPathSum(buildTree([1, 2, 3])), 6, "maxPathSum 1");
assert(maxPathSum(buildTree([-10, 9, 20, null, null, 15, 7])), 42, "maxPathSum 2");


// EXERCISE 4.2 — Serialize and Deserialize Binary Tree.
// Convert tree to string and back. Your format, as long as it's consistent.
// Time: O(n), Space: O(n)

function serialize(root) {
  // YOUR CODE HERE — preorder DFS, use "null" for missing nodes, comma separator.
}

function deserialize(data) {
  // YOUR CODE HERE — rebuild from preorder sequence.
  // Use a pointer (index or queue) into the comma-split array.
}

const original = buildTree([1, 2, 3, null, null, 4, 5]);
const reconstructed = deserialize(serialize(original));
assert(inorder(reconstructed), inorder(original), "serialize/deserialize");

console.log("=== Sheet 6 complete! Move to dsa_07_graphs.js ===\n");
