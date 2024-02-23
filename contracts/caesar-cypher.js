/** @param {NS} ns */
/*
  Encryption I: Caesar Cipher
  You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


  Caesar cipher is one of the simplest encryption technique. It is a type of substitution cipher in which each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet. For example, with a left shift of 3, D would be replaced by A, E would become B, and A would become X (because of rotation).

  You are given an array with two elements:
    ["MEDIA ARRAY LINUX SHELL EMAIL", 12]
  The first element is the plaintext, the second element is the left shift value.

  Return the ciphertext as uppercase string. Spaces remains the same.
*/

function EncodeCaesar(ns, input, shift) {
  let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  let outputString = ''
  let currLetterIndex = 0
  let newIndex = 0
  let currentLetter = ''

  for (let i = 0; i < input.length; i++) {
    currentLetter = input[i]
    // ns.tprint('i = ', i, '... currentLetter = ', currentLetter)
    if (currentLetter == ' ') {
      outputString += currentLetter
    } else {
      currLetterIndex = alphabet.indexOf(currentLetter)
      newIndex = currLetterIndex - shift
      if (newIndex < 0) {
        newIndex += 26
      }
      outputString += alphabet[newIndex]
      // ns.tprint('currentIndex = ', currLetterIndex, '... newIndex = ', newIndex)
      // ns.tprint('outputString = ', outputString)
    }
  }

  return outputString
}

export async function main(ns) {
  // let test_1 = ["ABCD EFG", 1]
  // let output_1 = "ZABC DEF"

  // ns.tprint("expected: ", output_1, "... actual: ", EncodeCaesar(ns, test_1[0], test_1[1]))
  let input = ns.args//["MEDIA ARRAY LINUX SHELL EMAIL", 12]
  ns.tprint("actual: ", EncodeCaesar(ns, input[0], input[1]))
}