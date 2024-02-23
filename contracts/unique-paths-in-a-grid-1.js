/** @param {NS} ns */

/*
  Unique Paths in a Grid I
  You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.

  You are in a grid with 5 rows and 9 columns, and you are positioned in the top-left corner of that grid. You are trying to reach the bottom-right corner of the grid, but you can only move down or right on each step. Determine how many unique paths there are from start to finish.

  NOTE: The data returned for this contract is an array with the number of rows and columns:

  [5, 9]
*/

function GetNumPaths(ns, rows, columns) {
  // base cases
  if (rows <= 0 || columns <= 0) {
    // ns.tprint("base case: row or col = 0")
    return 0
  }

  if (rows == 1 || columns == 1) {
    // ns.tprint("base case: row or col = 1")
    return 1
  }

  // ns.tprint("rows and cols > 1")
  // implied else that rows and columns > 1
  let numPaths = 0

  // add up the paths for one less row (move down)
  // ns.tprint("moving down")
  numPaths += GetNumPaths(ns, rows - 1, columns)

  // add up the paths for one less column (move right)
  // ns.tprint("moving right")
  numPaths += GetNumPaths(ns, rows, columns - 1)

  return numPaths
}


export async function main(ns) {
  // let testCase1 = [2, 2]
  // ns.tprint("expected result = 2 ... ", GetNumPaths(ns, testCase1[0], testCase1[1]))

  // let testCase2 = [2,4]
  // ns.tprint("expected result = 4 ... ", GetNumPaths(ns, testCase2[0], testCase2[1]))

  let input = [12,8]
  ns.tprint("Actual: ", GetNumPaths(ns, input[0], input[1]))
}