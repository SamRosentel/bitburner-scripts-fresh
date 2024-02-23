/** @param {NS} ns */
export async function main(ns) {
  // const filesToCopy = ["mid-hack-script.js", "hacker-helper.js"];
  const serverLimit = ns.getPurchasedServerLimit();

  // inputs: number of servers to buy, ram per server
  let serversToBuy = ns.args[0];
  let requestedRAM = ns.args[1];

  // optional param: sleep seconds
  let sleepSeconds = ns.args.length > 2 ? ns.args[2] : 1;

  let purchasedServers = ns.getPurchasedServers();
  let countServers = purchasedServers.length;

  do {
    let moneyAvail = ns.getServerMoneyAvailable("home")
    let serverCost = ns.getPurchasedServerCost(requestedRAM)

    if (moneyAvail > serverCost) {

      let hostname = ns.purchaseServer("p-" + countServers + "-" + requestedRAM + "GB", requestedRAM)
      if (hostname == '') {
        hostname = ns.purchaseServer("p-" + countServers + "-" + requestedRAM + "GB-1", requestedRAM)
      }
      purchasedServers.push(hostname)
      ns.tprint("New server  ", hostname, " purchased at cost $", serverCost.toLocaleString('en-US'))
      serversToBuy--;
      countServers++;
    }
    await ns.sleep(sleepSeconds * 1000);
  } while (countServers < serverLimit && serversToBuy > 0)

  purchasedServers = ns.getPurchasedServers();

  for(let index = 0; index < purchasedServers.length; index++){
    let server = ns.getServer(purchasedServers[index])
    ns.renamePurchasedServer(server.hostname, "p-" + index + "-" + server.maxRam + "GB")
  }

  ns.tprint("Servers: ", ns.getPurchasedServers())

}