/** @param {NS} ns */
export async function main(ns) {
  const hackfile = "mid-hack-script.js"
  const hackhelper = "hacker-helper.js"
  const openablePortsNum = getOpenablePorts()
  let allServers = getAllServers()
  let allServerObjects = allServers[0]
  let allHostnames = allServers[1]
  let rootHostnames = allServers[2]

  ns.tprint("Opening ports ...")
  let newlyRootedServers = rootNewServers(allServerObjects, allHostnames, rootHostnames, openablePortsNum)

  ns.tprint("Copying hack scripts to root hosts ", newlyRootedServers.toString())
  copyScriptToRootHosts(newlyRootedServers, [hackfile, hackhelper])

  hostnames += newlyRootedServers

  let bestHackServer = getBestServerFromList(hostnames)

  ns.tprint("Updating hack targets ...")
  let override = ns.args.length > 0 ? ns.args[0] : false

  updateHackTarget(hostnames, bestHackServer, hackfile, hackhelper, override)
}


function updateHackTarget(hostnames, bestHackServer, hackfile, hackhelper, override) {

  let server = getBestServerFromList(hostnames)

  const reqHackRam = ns.getScriptRam(hackfile)
  const reqHelperRam = ns.getScriptRam(hackhelper)

  let minMoney = ns.getServerMoneyAvailable(server)
  let minSecurity = ns.getServerSecurityLevel(server) + 5

  if (ns.isRunning(hackhelper, "home", server)) {
    ns.tprint("Best server already running on home")
  }
  else {
    ns.tprint("New best server: ", server)
  }

  hostnames.push("home")


  while (hostnames.length > 0) {
    let host = hostnames.pop()

    if (!ns.isRunning(hackhelper, host, server) || override) {
      ns.scriptKill(hackfile, host)
      ns.scriptKill(hackhelper, host)

      let availRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host)

      if (host == "home") {
        availRam -= 12
      }

      let maxThreads = Math.floor(availRam / (2 * reqHelperRam))


      if (maxThreads >= 1) {
        ns.exec(hackfile, host, maxThreads, server, minMoney, minSecurity);
        availRam -= maxThreads * reqHackRam;
        ns.exec(hackhelper, host, maxThreads, server);
        availRam -= maxThreads * reqHelperRam;
        ns.tprint("Created ", maxThreads, " hack threads and ", maxThreads, " helper threads on host ", host)
      } else if (maxThreads * 2 >= 1) {
        ns.exec(hackfile, host, maxThreads * 2, server, minMoney, minSecurity);
        availRam -= maxThreads * 2 * reqHackRam;
        ns.tprint("Created ", maxThreads * 2, " hack threads on host ", host);
      }
    }
  }
}

function copyScriptToRootHosts(hostnames, filename) {
  let copyHostnames = hostnames
  while (copyHostnames.length > 0) {
    let host = copyHostnames.pop()
    copyFile(filename, host)
  }
}

function getAllRootHosts() {
  let hostnames = ns.scan("home")
  let visited = serversToSkip()
  let target = 'home'

  while (hostnames.length > 0) {
    target = hostnames.pop()
    while (visited.includes(target) && hostnames.length > 0) {
      target = hostnames.pop()
    }

    let hasroot = ns.hasRootAccess(target)

    if (hasroot) {
      visited.push(target)
      let newservers = ns.scan(target)
      while (newservers.length > 0) {
        let server = newservers.pop()
        if (!visited.includes(server))
          hostnames.push(server)
      }
    }

  }

  return visited
}

function copyFile(file, hostname) {
  if (!ns.hasRootAccess(hostname)) return

  if (ns.hasRootAccess(hostname)) {
    let success = ns.scp(file, hostname)
    if (!success) {
      ns.tprint("Copy failed to host ", hostname)
    }
  }

  return
}

function getBestServerFromList(hostnames) {
  // returns the most profitable server to start hacking threads on

  const currentHackLevel = ns.getHackingLevel()

  let serverList = hostnames
  let bestServer = "n00dles"
  let maxMoney = 0

  while (serverList.length > 0) {
    let target = serverList.pop()
    let hackable = ns.getServerRequiredHackingLevel(target) <= currentHackLevel / 2
    if (hackable) {
      let serverMoney = ns.getServerMaxMoney(target)

      if (serverMoney > maxMoney) {
        maxMoney = serverMoney
        bestServer = target
      }
    }
  }

  return bestServer
}

function rootNewServers(allServerObjects, openablePortsNum) {
  // returns list of newly rooted hostnames

  let serversToVisit = allServerObjects
  let visited = serversToSkip()
  let newRootServers = []

  while (serversToVisit.length > 0) {
    let targetServer = serversToVisit.pop()

    while (visited.includes(targetServer.hostname) && serversToVisit.length > 0) {
      targetServer = serversToVisit.pop()
    }

    if (!targetServer.hasRootAccess && targetServer.numOpenPortsRequired <= openablePortsNum) {
      let success = getRoot(targetServer.hostname, openablePortsNum)
      if (success) {
        newRootServers.push(targetServer.hostname)
      }
    }

    visited.push(targetServer.hostname)

    let newservers = ns.scan(targetServer.hostname)
    while (newservers.length > 0) {
      let unvisitedServer = newservers.pop()
      if (!visited.includes(unvisitedServer))
        serversToVisit.push(unvisitedServer)
    }
  }

  return newRootServers
}


function getRoot(serverName, openablePorts) {
  // attempts to get root access to a given server
  // returns true if root access acquired, false otherwise

  let serverObj = ns.getServer(serverName)

  if (serverObj.hasRootAccess) {
    ns.tprint("Server ", serverName, " already has root access.")
    return true
  }

  if (!serverObj.hasRootAccess && serverObj.numOpenPortsRequired <= openablePorts) {
    switch (openablePorts) {
      case 5: ns.sqlinject(serverName)
      case 4: ns.httpworm(serverName)
      case 3: ns.relaysmtp(serverName)
      case 2: ns.ftpcrack(serverName)
      case 1: ns.brutessh(serverName)
    }

    ns.nuke(serverName)
    ns.tprint("Nuked server ", serverName)

    return true
  }
  else {
    return false
  }
}

function getAllServers() {
  // returns
  // [ 
  //    allServers: a map of all servers key = hostname
  //    rootHosts: a map of all servers with root access key = hostname
  // ]

  let allServers = new Map()
  let rootHosts = new Map()
  let target = 'home'

  // servers to visit is a list of hostnames
  let serversToVisit = ns.scan(target)  
  let visited = serversToSkip()
  serversToVisit = serversToVisit.filter((hostname) => !visited.includes(hostname))

  while (serversToVisit.length > 0) {
    targetHostname = serversToVisit.pop()

    while (visited.includes(targetHostname) && serversToVisit.length > 0) {
      targetHostname = serversToVisit.pop()
    }

    let serverObject = ns.getServer(targetHostname)

    visited.push(targetHostname)
    allServers.set(targetHostname, serverObject)

    if(serverObject.hasRootAccess){
      rootHosts.set(targetHostname, serverObject)
    }

    let newServers = ns.scan(targetHostname)
    while (newServers.length > 0) {
      let unvisitedServer = newServers.pop()
      if (!visited.includes(unvisitedServer))
        serversToVisit.push(unvisitedServer)
    }
  }

  return [allServers, rootHosts]

}

// -----------------------------------------------------
// Helper functions
// -----------------------------------------------------


function serversToSkip() {
  // returns a list of purchased servers and home
  // used to filter lists of servers

  let skip = ns.getPurchasedServers()
  skip.push("home")

  return skip
}

function getOpenablePorts() {
  // returns number of port opening programs on home server

  const portOpeningScripts = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"]

  let openablePortsNum = 0
  for (let i = 0; i < portOpeningScripts.length; i++) {
    if (ns.fileExists(portOpeningScripts[i], "home")) {
      openablePortsNum += 1
    }
  }

  // ns.tprint("Openable ports: ", openablePortsNum)
  return openablePortsNum
}