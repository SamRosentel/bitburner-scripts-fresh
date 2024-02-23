/** @param {NS} ns */
export async function main(ns) {
  // expects a single argument: host name
  let hostname = ns.args[0]

  ns.tprint("Servers owned: ",  ns.getPurchasedServers().toString())
  
  ns.killall(hostname)
  ns.deleteServer(hostname)
  ns.tprint("Deleting Server: ", hostname)


  ns.tprint("Servers owned: ",  ns.getPurchasedServers().toString())
}