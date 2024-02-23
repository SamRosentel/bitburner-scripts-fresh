/*
Total Ways to Sum
contract-939639

It is possible write four as a sum in exactly four different ways:

    3 + 1
    2 + 2
    2 + 1 + 1
    1 + 1 + 1 + 1

How many different distinct ways can the number 52 be written as a sum of at least two positive integers?

This sounds recursive to me? hmm. we could overflow the stack pretty easily with a big number, 
and they don't give an upper limit.

How many ways can we make 5? it's all the ways we could make 4 (4) with a one added to them, 
plus all the ways to make 3 with a 2 added to them, but we run into duplication pretty quickly.
Could do this as sets in a map?

ways to make 5:
1+1+1+1+1
2+1+1+1
2+2+1
3+1+1
3+2
4+1

I could think about it in terms of factors -- the only factors of 4 are 1,2,4?
Five is a prime number so that doesn't really help...
Thinking about how many of each number less than the current one... something factoral? 
I'll do this tomorrow in a fresh brain.

*/

/** @param {NS} ns */
export async function main(ns) {

}