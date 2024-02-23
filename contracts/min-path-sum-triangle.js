/** @param {NS} ns */

/// WARNING: THIS SCRIPT CAUSES AN INFINITE LOOP ABOVE LEN = 7

/*
  Minimum Path Sum in a Triangle
  contract-823796.cct

  Given a triangle, find the minimum path sum from top to bottom. 
  In each step of the path, you may only move to adjacent numbers in the row below. 
  The triangle is represented as a 2D array of numbers:

  
  [
          [8],
         [7,1],
        [1,1,2],
       [8,8,4,1],
      [3,1,3,1,9],
     [9,6,6,3,6,1],
    [5,3,5,8,2,8,9],
   [4,4,9,6,9,7,7,7],
  [1,3,9,1,6,1,8,5,7]
  ]

  Example: If you are given the following triangle:

  [
      [2],
      [3,4],
    [6,5,7],
    [4,1,8,3]
  ]

  The minimum path sum is 11 (2 -> 3 -> 5 -> 1).

  ---
  this looks like a tree traversal to me, which means queues and stacks
  we start at the top, queue the available options, and pop the stack
  working through the example, minSum starts at 2. queue 3 and 4. 
  I can't think right now. Depth first search for sure, can't remember if that's queue or stack.

*/

export async function main(ns) {
  // let input =
  //   [
  //     [8],
  //     [7, 1],
  //     [1, 1, 2],
  //     [8, 8, 4, 1],
  //     [3, 1, 3, 1, 9],
  //     [9, 6, 6, 3, 6, 1],
  //     [5, 3, 5, 8, 2, 8, 9],
  //     [4, 4, 9, 6, 9, 7, 7, 7],
  //     [1, 3, 9, 1, 6, 1, 8, 5, 7]
  //   ]

  let test_input = [
    [2],
    [3, 4],
    [6, 5, 7],
    [4, 1, 8, 3],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1]
    // ,[1, 1, 1, 1, 1, 1, 1, 1]
    // this is where it starts to be an infinite loop
    // I'd bet we're getting a stack overflow error
  ]
  let input = test_input

  ns.tprint('Expected output: 14')

  ns.tprint('Input: ')

  for (let row = 0; row < input.length; row++) {
    ns.tprint(input[row].toString())
  }

  let result = shortest_path_triangle(ns, input)

  ns.tprint('Actual output: ', result)

}

 function shortest_path_triangle(ns, input) {
  ns.tprint('debug: you are here -- fn shortest_path_triangle')

  let height = input.length
  ns.tprint('height = ', height)

  // if height = 0, return 0
  if (height == 0) {
    ns.tprint('height = 0')
    return 0
  }

  // return if height = 1
  if (height == 1) {
    ns.tprint('height = 1, returning ', input[0][0])
    return input[0][0]
  }

  // implied else that height > 1
  // set min path to the value of the top of the triangle
  let minPath = input[0][0];

  ns.tprint('minPath = ', minPath)

  // go to next row
  let row = 1
  let minFromHere = -1;

  // debug, print vars
  ns.tprint('row = ', row)
  ns.tprint('minFromHere = ', minFromHere)

  for (let col = 0; col < input[row].length; col++) {
    // debug
    ns.tprint('looping! col = ', col)

    // treat each element as a new triangle
    let new_triangle = create_subtriangle(ns, input, row, col)

    // debug, show the new triangle
    ns.tprint('new_triangle: ')
    for (let row = 0; row < new_triangle.length; row++) {
      ns.tprint(new_triangle[row].toString())
    }

    // get the min path from that triangle
    let new_min = shortest_path_triangle(ns, new_triangle)

    // debug, show the new_min and minFromHere
    ns.tprint('new_min: ', new_min)
    ns.tprint('minFromHere: ', minFromHere)

    // set the new minimum to either the first result or any other result that is lower
    if (minFromHere == -1 || new_min < minFromHere) {
      // debug, print the value
      ns.tprint('new min! setting minFromHere = ', new_min)
      minFromHere = new_min
    }
  }

  // if we hit this, we've gone wrong
  if (minFromHere == -1) {
    // debug
    ns.tprint('minFromHere still = -1 -- you fucked up')
    return -1
  }
  else {
    minPath += minFromHere
    // debug: print return value
    ns.tprint('minPath = ', minPath)
    return minPath
  }


}

function create_subtriangle(ns, input, row, column) {
  ns.tprint('debug: row = ', row, '    col = ', column)
  let new_triangle = [[input[row][column]]];

  // ns.tprint('new_triangle: ', new_triangle.toString())

  let column_min = column - 1;
  let column_max = column + 1;

  row++
  // for each row, add the columns that could be reached to the new triangle
  while (row < input.length) {
    let curr_row = input[row]

    // check for out of bounds exceptions
    if (column_min < 0) column_min = 0
    if (column_max >= curr_row.length) column_max = curr_row.length

    let new_row = []
    // add columns in range
    for (let col = column_min; col <= column_max; col++) {
      new_row.push(curr_row[col])
      // ns.tprint('new_row: ', new_row.toString())
    }

    new_triangle.push(new_row)

    // update values
    row++
    column_min -= 1
    column_max += 1

  }

  // for (let row = 0; row < new_triangle.length; row++) {
  //   ns.tprint(new_triangle[row].toString())
  // }

  return new_triangle

}