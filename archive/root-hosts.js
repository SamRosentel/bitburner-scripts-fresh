/** @param {NS} ns */
import { GetAllServers } from "./GetAllServers"

export async function main(ns) {
  let ports = getOpenablePorts(ns);
  let servers = GetAllServers(ns);
  let rootHosts = Array(getRoot(ns, servers, ports)).toString();

  ns.tprint(`Root hosts: ${rootHosts}`)

}


// -----------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------

export function getOpenablePorts(ns) {
  // returns number of port opening programs on home server
  const portOpeningScripts = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"]
  let openablePortsNum = 0
  for (let i = 0; i < portOpeningScripts.length; i++) {
    if (ns.fileExists(portOpeningScripts[i], "home")) {
      openablePortsNum += 1
    }
  }
  return openablePortsNum
}

export function getRoot(ns, serverList, openablePorts) {
  let rootedHosts = []
  for (var server of serverList) {
    let serverObject = ns.getServer(server)

    if (serverObject.hasAdminRights) {
      rootedHosts.push(serverObject.hostname)
    }
    else {
      let portsRequired = serverObject.numOpenPortsRequired
      if (portsRequired != undefined && portsRequired <= openablePorts) {

        switch (openablePorts) {
          case 5: ns.sqlinject(server)
          case 4: ns.httpworm(server)
          case 3: ns.relaysmtp(server)
          case 2: ns.ftpcrack(server)
          case 1: ns.brutessh(server)
        }

        ns.nuke(server)
        rootedHosts.push(server)
      }
    }
  }

  return rootedHosts
}
