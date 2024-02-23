/** @param {NS} ns */
export async function main(ns) {
  /* 
    You are given the following array of stock prices (which are numbers) 
    where the i-th element represents the stock price on day i:
    48,146,4,139,185,62,111,153,63,188,184,67,196,133,7,121,52,32,168,69,106,186,124,95,84,57,163,118,32,199,111,158,105,49,135,160,189,129,28,179,21,133,45,88,133,44,128,82,142,164
   
    Determine the maximum possible profit you can earn using at most one transaction 
    (i.e. you can only buy and sell the stock once). Note that you have to buy the stock before you can sell it.
  
    If no profit can be made then the answer should be 0. 
  */
  let stockPrices = [
84,62,8,96,66,143,153,186,165,110,190,36,135,195,30,36,93,13,94,138,158,125,28,130,195,194,18,68,73,174,15,31,70,55,44,141,154,93,50,69,42,96,52,115]
  let minPrice = 0
  let maxPrice = 0
  let maxDifference = 0
  let minIndex = -1

  for (let i = 0; i < stockPrices.length; i++) {
    let price = stockPrices[i]

    if (price < minPrice || minPrice == 0) {
      minPrice = price
      maxPrice = 0
            ns.tprint("New minPrice: ", minPrice, " at index ", i)
    } else if (price > maxPrice || maxPrice == 0) {
      maxPrice = price
      ns.tprint("New maxPrice: ", maxPrice, " at index ", i)
      let difference = maxPrice - minPrice
      maxDifference = difference > maxDifference ? difference : maxDifference
    }

  }

  ns.tprint("Max Difference:", maxDifference)

}