/*
Encryption II: Vigenère Cipher
contract-705352.cct 

Vigenère cipher is a type of polyalphabetic substitution. It uses the Vigenère square to encrypt and 
decrypt plaintext with a keyword.

  Vigenère square:
         A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
       +----------------------------------------------------
     A | A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
     B | B C D E F G H I J K L M N O P Q R S T U V W X Y Z A
     C | C D E F G H I J K L M N O P Q R S T U V W X Y Z A B
     D | D E F G H I J K L M N O P Q R S T U V W X Y Z A B C
     E | E F G H I J K L M N O P Q R S T U V W X Y Z A B C D
                ...
     Y | Y Z A B C D E F G H I J K L M N O P Q R S T U V W X
     Z | Z A B C D E F G H I J K L M N O P Q R S T U V W X Y

For encryption each letter of the plaintext is paired with the corresponding letter of a repeating keyword. 
For example, the plaintext DASHBOARD is encrypted with the keyword LINUX:
   Plaintext: DASHBOARD
   Keyword:   LINUXLINU
So, the first letter D is paired with the first letter of the key L. Therefore, row D and column L of the 
Vigenère square are used to get the first cipher letter O. This must be repeated for the whole ciphertext.

You are given an array with two elements:
  ["EMAILMOUSEENTERPRINTTRASH", "DYNAMIC"]
The first element is the plaintext, the second element is the keyword.

Return the ciphertext as uppercase string.
HKNIXUQXQREZBGUNEIZBVUYFH
---
This seems complicated at first, but it's actually just an alphabetical offset. 
If we think about the keyword as offset values, it's pretty easy to achieve.

Assign A = 0, Z = 25
For any values greater than 25 at the end, reduce by 26 until <= 25

create an array with the alphabet in order. Use find to get index 

set keywordIndex = 0
For each letter in the input string: 
- use find to get original letter number
- get the keyword letter with keywordIndex
- sum the two, and subtract until < 26
- add letter from that index in the alphabet array to result
- increment keywordIndex
- if index>length(keyword), index = 0

return result
*/


/** @param {NS} ns */
export async function main(ns) {
  // expects the inputString and keyword as inputs

  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
    'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  let inputString = ns.args[0];
  let keyword = ns.args[1];

  let keywordIndex = 0;
  let result = new String;


  for (let input = 0; input < inputString.length; input++) {
    let letter = inputString[input];
    let letterNum = alphabet.indexOf(letter);
    let offsetLetter = keyword[keywordIndex];
    let offsetNum = alphabet.indexOf(offsetLetter);

    // ns.tprint("keywordIndex: ", keywordIndex);
    // ns.tprint("Letter: ", letter);
    // ns.tprint("letterNum: ", letterNum);
    // ns.tprint("offsetLetter: ", offsetLetter);
    // ns.tprint("offsetNum: ", offsetNum);

    let resultNum = letterNum + offsetNum;
    resultNum = resultNum > 25 ? resultNum - 26 : resultNum;
    // ns.tprint("resultNum: ", resultNum);

    let resultLetter = alphabet[resultNum];
    // ns.tprint("resultLetter: ", resultLetter);

    result += resultLetter;
    // ns.tprint("result: ", result);

    keywordIndex = keywordIndex == keyword.length-1 ? 0 : keywordIndex+1;

  }

  ns.tprint("Result: ", result);

}