// ============================================================================
//  DSA — SHEET 7: GRAPHS
//  Goal: Graphs generalise trees. Once you master graph BFS/DFS, you can
//        solve a huge class of problems: islands, dependencies, shortest paths.
// ============================================================================
//
//  HOW TO RUN:
//    node dsa_07_graphs.js
//
//  REPRESENTATIONS:
//    Adjacency List (most common): Map<node, neighbors[]> or array of arrays.
//    Adjacency Matrix: matrix[i][j] = 1 if edge exists. Good for dense graphs.
//    Edge List: [[u,v], [u,v], ...]. Good for sorting edges by weight.
//
//  BFS vs DFS:
//    BFS → shortest path in UNWEIGHTED graph, level-by-level exploration.
//    DFS → cycle detection, topological sort, connected components.
//
//  VISITED SET: Critical — graphs can have cycles. Always track visited nodes.
//
//  GRID PROBLEMS: Treat each cell as a node. Neighbors = 4 directions (or 8).
//    const dirs = [[0,1],[0,-1],[1,0],[-1,0]]; // right, left, down, up
// ============================================================================

const assert = (actual, expected, label) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${label}`);
  if (!pass) console.log("  Expected:", expected, "| Got:", actual);
};


// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: GRAPH TRAVERSAL
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 1.1 — Build an adjacency list and run BFS.
// Graph: 0→1, 0→2, 1→3, 2→3, 3→4
// BFS from 0 → [0, 1, 2, 3, 4]

function buildAdjList(edges, n) {
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u); // undirected
  }
  return graph;
}

function bfs(graph, start) {
  // YOUR CODE HERE
  // Queue starting with [start]. Visited set.
  // Return the order nodes are visited.
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
}

const g1 = buildAdjList([[0,1],[0,2],[1,3],[2,3],[3,4]], 5);
assert(bfs(g1, 0), [0, 1, 2, 3, 4], "BFS order");


// EXERCISE 1.2 — Number of Connected Components.
// Given n nodes and edges, return how many disconnected groups exist.
// countComponents(5, [[0,1],[1,2],[3,4]]) → 2
// Time: O(V + E), Space: O(V)

function countComponents(n, edges) {
  // YOUR CODE HERE
  // Build adjacency list. DFS/BFS from each unvisited node. Count starts.
}

assert(countComponents(5, [[0,1],[1,2],[3,4]]), 2, "countComponents 2");
assert(countComponents(4, [[0,1],[2,3],[1,2]]), 1, "countComponents 1");


// EXERCISE 1.3 — Clone Graph.
// Deep clone an undirected graph. Each node has val and neighbors[].
// Time: O(V + E), Space: O(V)

class GraphNode {
  constructor(val, neighbors = []) { this.val = val; this.neighbors = neighbors; }
}

function cloneGraph(node) {
  // YOUR CODE HERE
  // Use a Map: original → clone.
  // DFS: if node in map, return clone. Else create clone, add to map,
  // then recurse for each neighbor.
  if (!node) return null;
  const map = new Map();
  function dfs(n) { /* ... */ }
  return dfs(node);
}

console.log("=== Section 1 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: GRID / MATRIX PROBLEMS
// ════════════════════════════════════════════════════════════════════════════
//
//  💡 TRICK: Modify the grid in place to mark visited (change '1' to '0').
//  This avoids a separate visited set. Only do this if mutation is allowed.

const DIRS = [[0,1],[0,-1],[1,0],[-1,0]];

// EXERCISE 2.1 — Number of Islands.
// Count the number of islands ('1') in a 2D grid of '1's and '0's.
// Time: O(m*n), Space: O(m*n) recursion stack

function numIslands(grid) {
  // YOUR CODE HERE
  // For each unvisited '1': increment count, DFS to sink the island (mark as '0').
}

assert(numIslands([
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]), 1, "numIslands 1");

assert(numIslands([
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]), 3, "numIslands 3");


// EXERCISE 2.2 — Rotting Oranges (Multi-source BFS).
// Grid: 0=empty, 1=fresh orange, 2=rotten orange.
// Each minute, fresh oranges adjacent to rotten ones become rotten.
// Return minutes until all oranges are rotten. -1 if impossible.
// Time: O(m*n), Space: O(m*n)
//
//  KEY: Multi-source BFS — start with ALL rotten oranges in the queue at once.

function orangesRotting(grid) {
  // YOUR CODE HERE
  // 1. Find all initial rotten oranges → add to queue. Count fresh oranges.
  // 2. BFS level by level (each level = 1 minute).
  //    For each rotten: check 4 neighbors. If fresh: make rotten, queue it, fresh--.
  // 3. After BFS: if fresh === 0 return minutes, else -1.
}

assert(orangesRotting([[2,1,1],[1,1,0],[0,1,1]]), 4, "orangesRotting 4");
assert(orangesRotting([[2,1,1],[0,1,1],[1,0,1]]), -1, "orangesRotting -1");
assert(orangesRotting([[0,2]]), 0, "orangesRotting no fresh");

console.log("=== Section 2 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: CYCLE DETECTION & TOPOLOGICAL SORT
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 3.1 — Course Schedule (detect cycle in directed graph).
// canFinish(2, [[1,0]]) → true    (take 0, then 1)
// canFinish(2, [[1,0],[0,1]]) → false  (cycle: 0→1→0)
// Time: O(V + E), Space: O(V + E)
//
//  ALGORITHM: DFS with three states: UNVISITED, VISITING (in current path), VISITED.
//  If we reach a VISITING node → cycle detected.

function canFinish(numCourses, prerequisites) {
  // YOUR CODE HERE
  // Build adjacency list (directed).
  // DFS with state array: 0=unvisited, 1=visiting, 2=visited.
  // If dfs returns false for any node: return false.
  const graph = Array.from({ length: numCourses }, () => []);
  const state = new Array(numCourses).fill(0); // 0=unvisited, 1=visiting, 2=done
  for (const [course, prereq] of prerequisites) graph[prereq].push(course);

  function dfs(node) {
    // return false if cycle found
  }
}

assert(canFinish(2, [[1,0]]), true, "canFinish no cycle");
assert(canFinish(2, [[1,0],[0,1]]), false, "canFinish cycle");
assert(canFinish(3, [[1,0],[2,1],[0,2]]), false, "canFinish 3-cycle");


// EXERCISE 3.2 — Topological Sort (Course Schedule II).
// Return the order to take all courses, or [] if impossible.
// Time: O(V + E), Space: O(V + E)
//
//  KAHN'S ALGORITHM (BFS-based):
//    1. Compute in-degree for each node.
//    2. Queue all nodes with in-degree 0.
//    3. Process queue: add to result, decrement in-degree of neighbors.
//       Add neighbor to queue if in-degree becomes 0.
//    4. If result.length === numCourses → valid order. Else cycle.

function findOrder(numCourses, prerequisites) {
  // YOUR CODE HERE
}

assert(findOrder(2, [[1,0]]), [0,1], "topoSort [0,1]");
assert(findOrder(4, [[1,0],[2,0],[3,1],[3,2]]), [0,1,2,3], "topoSort 4 courses");
assert(findOrder(2, [[1,0],[0,1]]), [], "topoSort cycle → []");

console.log("=== Section 3 done ===\n");


// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: SHORTEST PATH & ADVANCED
// ════════════════════════════════════════════════════════════════════════════

// EXERCISE 4.1 — Word Ladder (BFS shortest path).
// Transform beginWord → endWord by changing one letter at a time.
// Each intermediate word must be in wordList.
// Return the number of steps (0 if impossible).
// ladderLength("hit","cog",["hot","dot","dog","lot","log","cog"]) → 5
// Time: O(n * m²) where n=words, m=word length

function ladderLength(beginWord, endWord, wordList) {
  // YOUR CODE HERE
  // BFS where each "edge" is a single-letter change.
  // TRICK: For each position, try all 26 letters. Check if new word is in wordSet.
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;
  // BFS from beginWord...
}

assert(ladderLength("hit","cog",["hot","dot","dog","lot","log","cog"]), 5, "wordLadder 5");
assert(ladderLength("hit","cog",["hot","dot","dog","lot","log"]), 0, "wordLadder impossible");


// EXERCISE 4.2 — Pacific Atlantic Water Flow.
// Water can flow to adjacent lower-or-equal cells. Which cells can flow to BOTH oceans?
// Pacific ocean touches top/left border. Atlantic touches bottom/right border.
// Time: O(m*n), Space: O(m*n)
//
//  REVERSE THINKING: Instead of simulating water flow downward,
//  do BFS/DFS UPWARD from ocean borders (water flowing backward).
//  Find all cells reachable from Pacific, and all reachable from Atlantic.
//  Intersection = answer.

function pacificAtlantic(heights) {
  // YOUR CODE HERE
  const m = heights.length, n = heights[0].length;
  const pacReach = Array.from({length:m}, () => new Array(n).fill(false));
  const atlReach = Array.from({length:m}, () => new Array(n).fill(false));
  // BFS helper: start from border cells, expand to equal-or-higher neighbors.
  function bfs(queue, reach) { /* ... */ }
  // Return cells where both pacReach and atlReach are true.
}

assert(
  pacificAtlantic([[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]),
  [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]],
  "pacificAtlantic"
);

console.log("=== Sheet 7 complete! Move to dsa_08_binary_search.js ===\n");
