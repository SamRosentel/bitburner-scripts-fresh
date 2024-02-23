/*
    Compression I: RLE Compression
    contract-812644.cct 
    Run-length encoding (RLE) is a data compression technique which encodes data as a 
    series of runs of a repeated single character. 
    
    Runs are encoded as a length, followed by the character itself. 
    Lengths are encoded as a single ASCII digit; runs of 10 characters or more are encoded 
    by splitting them into multiple runs.

    You are given the following input string:
        YYmlzzbV6hhhhhhhjj77uQQQQQQQQQee55aaaaaaaPPIIIIIIIIIIIIIWWJJJJJJJJJJJKc
    Encode it using run-length encoding with the minimum possible output length.

    Examples:
        aaaaabccc            ->  5a1b3c
        aAaAaA               ->  1a1A1a1A1a1A
        111112333            ->  511233
        zzzzzzzzzzzzzzzzzzz  ->  9z9z1z  (or 9z8z2z, etc.)

*/

/** @param {NS} ns */
export async function main(ns) {

  let encodedString = ns.args[0];
  let output_string = RLECompression(ns, encodedString)
  
  ns.tprint(output_string)
  
}


function RLECompression(ns, input) {
  // let input = 'tttttttttbbbb63888888888nvvvQmSkktYbbme66ssssssssQQQQQ3JJejjVVTTY'
  let output_string = ''
  let prev_char = ''
  let curr_counter = 0

  for(let i = 0; i < input.length; i++){
    if(prev_char == ''){
      prev_char = input[i]
      curr_counter = 1
    } else {
      if(input[i] == prev_char){
        curr_counter++
      } else {
        output_string += curr_counter.toString() + prev_char
        curr_counter = 1
        prev_char = input[i]
      }
    }
  }

  output_string += curr_counter.toString() + prev_char

  ns.print(output_string)
  return output_string

}