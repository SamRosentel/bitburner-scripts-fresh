/** @param {NS} ns */

/*
  Algorithmic Stock Trader II
  Given the following array of stock prices (which are numbers) 
  where the i-th element represents the stock price on day i:

  [12,188,164,186,4,198,42,198,31,91,130,75,151,87,106,103,97,39,115,73,185,136,57,185,55,111,155,171,115,157,76,71,53,176,98,170,165,116,113,144,187,17,54,58,195,71,193,182,91]

  Determine the maximum possible profit you can earn using as many transactions as you'd like. 
  A transaction is defined as buying and then selling one share of the stock. 
  Note that you cannot engage in multiple transactions at once. 
  In other words, you must sell the stock before you buy it again.

  If no profit can be made, then the answer should be 0
*/

function TradeStocks(ns, input) {
  let maxProfit = 0
  let buyPrice = 0
  let sellPrice = 0
  let currPrice = 0
  let prevPrice = 0

  // go backwards thru the array
  let index = input.length - 1
  while (index >= 0) {
    currPrice = input[index]
    if (index == 0) {
      prevPrice = currPrice + 1
    } else { prevPrice = input[index - 1] }

    // look for inflection points where the price hits a new low
    if (currPrice < prevPrice && sellPrice != 0) {
      buyPrice = currPrice
      let profit = sellPrice - buyPrice
      if (profit >= 0){ 
        ns.tprint("Sell price: ", sellPrice)
        ns.tprint("Buy price: ", buyPrice)
        ns.tprint("Profit: ", profit)

        maxProfit += profit
      }
      sellPrice = 0
      buyPrice = 0
    } else {
      if (currPrice > prevPrice && currPrice > sellPrice) {
        sellPrice = currPrice
      }
    }

    index--
  }


  return maxProfit
}

export async function main(ns) {
  // let testInput1 = [1, 10, 11, 12, 2, 6, 8, 7, 6, 5]
  // ns.tprint("Expected output = 17 ... ", TradeStocks(ns, testInput1))

  // let testInput2 = [5, 4, 3, 2, 1]
  // ns.tprint("Expected output = 0 ... ", TradeStocks(ns, testInput2))

  let input = [70,9,181,12,149,166,19,63,72,24,91,73,192,116,17,114,53,13,114,182,72,200]
  ns.tprint("Actual: ", TradeStocks(ns, input))
}