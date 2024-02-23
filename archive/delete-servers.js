/** @param {NS} ns */
export async function main(ns) {
  let servers = ns.getPurchasedServers()
  let numServersToDelete = ns.args[0]

  let index = 0
  while (index < numServersToDelete){
    let serverName = servers[index]
    ns.killall(serverName)
    let success = ns.deleteServer(servers[index])
    if(success){ ns.tprint("Deleted Server: ", servers[index]) }
    index++
  }

  ns.tprint("Servers owned: ",  ns.getPurchasedServers().toString())
}