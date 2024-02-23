/*
  Find Largest Prime Factor
  contract-666947.cct 

  A prime factor is a factor that is a prime number. 
  What is the largest prime factor of 997565841?

  To know if a number is prime, loop through the numbers from 2 to sqrt n to know if something is prime.
  We can actually use this to break it into the factors themselves, I think.

  997,565,841 --> 697,111

*/

/** @param {NS} ns */
export async function main(ns) {

  let inputNum = ns.args[0];
  let checkFactor = 2;

  while(!isPrime(inputNum) && checkFactor < Math.sqrt(inputNum)){
    if(inputNum % checkFactor == 0){
      inputNum = inputNum / checkFactor;
      checkFactor = 2;
    } else {
      checkFactor++;
    }
  }

  ns.tprint(inputNum);

  // Function check whether a number
  // is prime or not
  function isPrime(n) {
    // Check if n=1 or n=0
    if (n <= 1)
      return false;
    // Check if n=2 or n=3
    if (n == 2 || n == 3)
      return true;
    // Check whether n is divisible by 2 or 3
    if (n % 2 == 0 || n % 3 == 0)
      return false;
    // Check from 5 to square root of n
    // Iterate i by (i+6)
    for (var i = 5; i <= Math.sqrt(n); i = i + 6)
      if (n % i == 0 || n % (i + 2) == 0)
        return false;

    return true;
  }

}