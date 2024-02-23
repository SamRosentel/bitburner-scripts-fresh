/** @param {NS} ns */
export async function main(ns) {
  /*
    (Currently on server foodstuff)
    HammingCodes: Encoded Binary to Integer
    
    You are given the following encoded binary string:
    '0010000000110010000011100101111001100111011110011111001001011110'

    Treat it as an extended Hamming code with 1 'possible' error at a random index.
    Find the 'possible' wrong bit, fix it and extract the decimal value, which is hidden inside the string.

    Note: The length of the binary string is dynamic, but its encoding/decoding follows Hamming's 'rule'
    Note 2: Index 0 is an 'overall' parity bit. Watch the Hamming code video from 3Blue1Brown for more information
    Note 3: There's a ~55% chance for an altered Bit. So... MAYBE there is an altered Bit 😉
    Note: The endianness of the encoded decimal value is reversed in relation to the endianness of the Hamming code. Where the Hamming code is expressed as little-endian (LSB at index 0), the decimal value encoded in it is expressed as big-endian (MSB at index 0).
    Extra note for automation: return the decimal value as a string
  */

  let fullInput = '0010000000110010000011100101111001100111011110011111001001011110'
  let extendedParity = fullInput[0]

  // how many parity checks do we have?
  let numChecks = 1
  do{
    numChecks++
  } while(numChecks * 2 < fullInput.length)

  // run each parity check, in order
  let parityIndex = 1;
  for(let i=1; i < numChecks; i++){
    let parityBit = fullInput[parityIndex]
    if(parityBit = )
  }

  // concat the final string

  function getStringParity(inputString) {
    let count = 0
    for (let i = 0; i < inputString.length; i++) {
      count += inputString[i] == '1' ? 1 : 0
    }
    return count%2
  }

}