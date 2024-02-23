/** @param {NS} ns */
function decodeLZ(ns, encodedString) {
  // init values
  let decoded = ''
  let chunkType = true
  let index = 0

  ns.tprint("Encoded String: ", encodedString)

  while (index < encodedString.length) {
    let lempel = Number(encodedString[index])

    ns.tprint("Index: ", index)

    if (lempel == 0) {
      index++
    }
    // type 1: copy the characters
    else if (chunkType) {
      ns.tprint("Lempel: ", lempel)
      decoded += encodedString.substring(index + 1, lempel + index + 1)
      index += lempel + 1 // move index forward L+1 characters
    } else {
      let x = encodedString[index + 1]
      // type 2: each of the L output characters is a copy of the character X places before it in the uncompressed data.
      for (let i = 0; i < lempel; i++) {
        let endIndex = decoded.length
        decoded += decoded[endIndex - x]
      }

      index += 2
    }

    chunkType = !chunkType

  }

  ns.tprint("Decoded string: ", decoded)

}

export async function main(ns) {
  /*
    Compression II: LZ Decompression
    Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to 
    earlier parts of the data. In this variant of LZ, data is encoded in two types of chunk. 
    Each chunk begins with a length L, encoded as a single ASCII digit from 1 to 9, followed by the chunk data, 
    which is either:
  
    1. Exactly L characters, which are to be copied directly into the uncompressed data.
    2. A reference to an earlier part of the uncompressed data. 
      To do this, the length is followed by a second ASCII digit X: 
      each of the L output characters is a copy of the character X places before it in the uncompressed data.
  
    For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character is the 
    start of a new chunk. 
    
    The two chunk types alternate, starting with type 1, and the final chunk may be of either type.
  */

  let encodedString = ns.args[0];

  decodeLZ(ns, encodedString)

}