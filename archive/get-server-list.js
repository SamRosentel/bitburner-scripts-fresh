/** @param {NS} ns */
export async function main(ns) {
  // function getServerList() {
  let hostnames = ns.scan("home")
  hostnames.concat(ns.getPurchasedServers())

  for (let i = 0; i < hostnames.length; i++) {
    let newservers = ns.scan(hostnames[i])
    while (newservers.length > 0) {
      let server = newservers.pop()
      if (!hostnames.includes(server))
        hostnames.push(server)
    }
  }

  ns.tprint(hostnames.toString())

  return hostnames
}
