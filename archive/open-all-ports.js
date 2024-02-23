/** @param {NS} ns */
export async function main(ns) {
  function openAllPorts() {
    const openablePortsNum = getOpenablePorts()

    let servers = ns.scan()
    let visited = serversToSkip()
    let target = ''

    while (servers.length > 0) {
      while (visited.includes(target) && servers.length > 0) {
        target = servers.pop()
      }

      visited.push(target)

      if (!ns.hasRootAccess(target) && ns.getServerNumPortsRequired <= openablePortsNum) {
        getRoot(target, openablePortsNum)
      }

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

}