/** @param {NS} ns */
export async function main(ns) {
  // prints the best server to put in the early hacking script

  // initialize variables
  const currentHackLevel = ns.getHackingLevel()

  // how many ports are we able to open?
  const openablePortsNum = getOpenablePorts()

  let bestServer = ""
  let maxMoney = 0

  let servers = ns.scan()
  let visited = serversToSkip()


  while (servers.length > 0) {
    ns.tprint("servers length: ", servers.length)
    ns.tprint("Servers: ", servers.toString())

    let target = servers.pop()
    ns.tprint("Target: ", target)

    while (visited.includes(target) && servers.length > 0) {
      ns.tprint("Already visited ", target)
      target = servers.pop()
      ns.tprint("New Target: ", target)
    }

    visited.push(target)
    ns.tprint("Visiting: ", target)

    let hasroot = ns.hasRootAccess(target)
    // attempt to gain root access if not already true
    hasroot = !hasroot ? getRoot(target, openablePortsNum) : hasroot
    ns.tprint("hasroot: ", hasroot)

    if (hasroot) {
      let hackable = ns.getServerRequiredHackingLevel(target) <= currentHackLevel / 2
      ns.tprint("hackable? ", hackable)

      if (hackable) {
        let serverMoney = ns.getServerMaxMoney(target)
        ns.tprint(serverMoney)

        if (serverMoney > maxMoney) {
          maxMoney = serverMoney
          ns.tprint("new max money: ", maxMoney)
          bestServer = target
          ns.tprint("new best target: ", bestServer)
        }
      }

      let newservers = ns.scan(target)
      while (newservers.length > 0) {
        let server = newservers.pop()
        if (!visited.includes(server))
          servers.push(server)
      }

    }
  }

  ns.tprint("best server: ", bestServer)
  ns.tprint("max money: ", maxMoney)
  ns.tprint("Current security: ", ns.getServerSecurityLevel(bestServer))
  ns.tprint("All servers: ", visited.toString())


  // functions
  function getRoot(serverName, openablePorts) {
    if (ns.getServerNumPortsRequired(serverName) <= openablePorts) {
      if (ns.fileExists("BruteSSH.exe", "home")) {
        ns.brutessh(serverName);
      }

      if (ns.fileExists("FTPCrack.exe", "home")) {
        ns.ftpcrack(serverName);
      }

      ns.nuke(serverName)
      ns.tprint("got root on server: ", serverName)

      return true
    }
    else {
      return false
    }
  }

  function getOpenablePorts() {
    const portOpeningScripts = ["BruteSSH.exe", "FTPCrack.exe"]
    let openablePortsNum = 0
    for (let i = 0; i < portOpeningScripts.length; i++) {
      if (ns.fileExists(portOpeningScripts[i], "home")) {
        openablePortsNum += 1
      }
    }
    return openablePortsNum
  }

  function serversToSkip() {
    let skip = ns.getPurchasedServers()
    skip.push("home")
    return skip
  }

}