/** @param {NS} ns */

/*
    Compression III: LZ Compression

    Lempel-Ziv (LZ) compression is a data compression technique which encodes data using 
    references to earlier parts of the data. In this variant of LZ, 
    data is encoded in two types of chunk. 

    Each chunk begins with a length L, encoded as a single ASCII digit from 1 to 9, 
    followed by the chunk data, which is either:
    1. Exactly L characters, which are to be copied directly into the uncompressed data.
    2. A reference to an earlier part of the uncompressed data. To do this, the length is followed by a second ASCII digit X: each of the L output characters is a copy of the character X places before it in the uncompressed data.

    For both chunk types, a length of 0 instead means the chunk ends immediately, 
    and the next character is the start of a new chunk. 
    
    The two chunk types alternate, starting with type 1, and the final chunk may be of either type.

    You are given the following input string:
        aLv7j572P7UIjW7HW7HW7HWwpWwpWwpobOWwpobO3FovJX3zxJrCvJXJXXJXXJLrgXJJ35q435q435q4iRE76m
    Encode it using Lempel-Ziv encoding with the minimum possible output length.

    Examples (some have other possible encodings of minimal length):
        abracadabra     ->  7abracad47
        mississippi     ->  4miss433ppi
        aAAaAAaAaAA     ->  3aAA53035
        2718281828      ->  627182844
        abcdefghijk     ->  9abcdefghi02jk
        aaaaaaaaaaaa    ->  3aaa91
        aaaaaaaaaaaaa   ->  1a91031
        aaaaaaaaaaaaaa  ->  1a91041
*/

function EncodeLZ(ns, input) {
  let output = ''
  let chunk_type = 1
  let index = 0

  ns.tprint('input length: ', input.length)

  while (index < 10) {
    ns.tprint('index: ', index)
    ns.tprint('chunk_type: ', chunk_type)
    if (chunk_type == 1) {
      // look for up to 9 different letters
      let chunk_len = 1
      let chunk = input[index]
      let flag = true
      while (chunk_len < 9 && flag) {
        if ((index < input.length - 1 && input[index] != input[index + 1]) || index == input.length - 1) {
          chunk += input[index]
          chunk_len++
          index++
        } else {
          flag = false
        }
      }

      output += chunk_len.toString() + chunk
      chunk_type = 2
    } else {
      let currChar = input[index]
      let existingIndex = output.indexOf(currChar)

      // is this char in the string already?
      if (existingIndex == -1) {
        output += '01'
      } else {
        // how many times does this character repeat?
        let chunk_len = 1
        let chunk = input[index]
        let flag = true
        while (chunk_len <= 9 && flag) {
          if ((index < input.length - 1 && input[index] == input[index + 1]) || index == input.length - 1) {
            chunk += input[index]
            chunk_len++
            index++
          } else {
            flag = false
          }
        }
        output += chunk_len.toString() + chunk
        chunk_type = 1
      }
    }

  }


  return output
}

export async function main(ns) {
  // abracadabra     ->  7abracad47
  // mississippi     ->  4miss433ppi
  // aAAaAAaAaAA     ->  3aAA53035
  // 2718281828      ->  627182844
  // abcdefghijk     ->  9abcdefghi02jk
  // aaaaaaaaaaaa    ->  3aaa91
  // aaaaaaaaaaaaa   ->  1a91031
  // aaaaaaaaaaaaaa  ->  1a91041

  let input = "c5I5I5Ixhz5I5GAyZez5I5Gj5Gk0HXXXXX0ww4XX3oTO6HssIWO6HssIWO6Hso8u24N24N24N"

  let test1 = 'abracadabra'
  let result1 = '7abracad47'
  ns.tprint('expected: ', result1, '... actual: ', EncodeLZ(ns, test1))

  // let test2 = 'mississippi'
  // let result2 = '4miss433ppi'
  // ns.tprint('expected: ', result2, '... actual: ', EncodeLZ(ns, test2))

  // let test3 = 'aaaaaaaaaaaa'
  // let result3 = '3aaa91'
  // ns.tprint('expected: ', result3, '... actual: ', EncodeLZ(ns, test3))

  // let test4 = 'aaaaaaaaaaaaa'
  // let result4 = '1a91031'
  // ns.tprint('expected: ', result4, '... actual: ', EncodeLZ(ns, test4))

}