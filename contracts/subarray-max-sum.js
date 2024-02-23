/** @param {NS} ns */
/*
  Subarray with Maximum Sum
  
  Given the following integer array, find the contiguous subarray (containing at least one number) 
  which has the largest sum and return that sum. 
  
  'Sum' refers to the sum of all the numbers in the subarray.
  -10,-3,-1,8,-2,-1,-4,0,-5,-3,-6,7,0,3,-1,1,3,8,6,-1,9,-4,-9,5,3,0,-3,-4,-8


*/

function SumArray(ns, input) {
  let total = 0

  for (let i = 0; i < input.length; i++) {
    // ns.tprint("total = ", total)
    total += input[i]
    // ns.tprint("input at index ", i, " = ", input[i], "... total = ", total)
  }

  return total
}


function FindMaxSubarray(ns, input) {
  let maxSum = input[0]

  // start with full length
  let subLength = input.length

  while (subLength > 0) {
    // check all possible subarrays for max sum
    for (let i = 0; i <= input.length - subLength; i++) {
      // ns.tprint("subLength = ", subLength, "... startIndex = ", i)
      let currSum = SumArray(ns, input.slice(i, i + subLength + 1))

      // ns.tprint("SumArray = ", currSum)
      if (currSum > maxSum) {
        maxSum = currSum
      }
    }
    subLength--
  }

  return maxSum
}

export async function main(ns) {

  let input = [4,-9,-6,5,5,-10,-1,10,-1,0,9,-4,7,10,-6,0,9,-4,3,-8,3,4,-6,7,-3,10,-4,8,4,8,7,1,-4,0,3,-10,4,-9,0,2]

  // let testInput1 = [0, 1, 2, 3]
  // let testInput2 = [-3, -2, -1, 0]
  // let testInput3 = [1, 9, -7, -6, 4, 5, 3, -1, 5]

  // ns.tprint("Expected output = 6 ... ", FindMaxSubarray(ns, testInput1))
  // ns.tprint("Expected output = 0 ... ", FindMaxSubarray(ns, testInput2))
  // ns.tprint("Expected output = 16 ... ", FindMaxSubarray(ns, testInput3))

  ns.tprint("Actual input: ", FindMaxSubarray(ns, input))

}