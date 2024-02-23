/** @param {NS} ns */
export async function main(ns) {
  const openablePortsNum = getOpenablePorts();

  let serverMap = getAllServers();
  serverMap.set("openablePorts", openablePortsNum)

  // let roothostnames = serverMap.get("roothostnames");
  // ns.tprint("serverMap size: ", serverMap.size)
  // ns.tprint("roothostnames: ", roothostnames.toString())

  ns.tprint("Finding servers to root...")
  serverMap.forEach(getRoot)

  ns.tprint("Copying scripts to hosts...")
  serverMap.forEach(copyFiles)

  let bestServer = getBestServerInMap(serverMap)
  ns.tprint("best hack server: ", bestServer.hostname)

  ns.tprint("Updating hack targets ...")
  let override = ns.args.length > 0 ? true : false

  // updateHackTarget(bestHackServer, serverMap, "hacker-helper.js", override)

  const hackhelper = "hacker-helper.js";
  const minRam = Math.max(ns.getScriptRam(hackhelper));

  let minMoney = (bestServer.moneyMax) * 0.7
  let minSecurity = (bestServer.minDifficulty) * 1.5;
  let rootHostsList = serverMap.get("roothostnames");

  let totalThreads = 0;
  let purchasedServers = ns.getPurchasedServers

  for (let i = 0; i < rootHostsList.length; i++) {
    let hostname = rootHostsList[i]

    let server = ns.getServer(hostname);
    let maxRam = server.maxRam === undefined ? 0 : server.maxRam;
    let ramUsed = server.ramUsed === undefined ? maxRam : server.ramUsed;

    let availRam = Number(maxRam) - Number(ramUsed);

    if (hostname == "home") {
      availRam -= 20;
    }

    let maxThreads = Math.floor(availRam / minRam)

    if (override) {
      ns.killall(hostname, true)
      ns.tprint("killing all scripts on ", hostname)
      await ns.asleep(1000)
    }

    // kill running scripts on host if running a different hostname
    if (!ns.isRunning(hackhelper, hostname, bestServer.hostname, minMoney, minSecurity)) {
      ns.scriptKill(hackhelper, hostname)
    }

    server = ns.getServer(hostname);
    maxRam = server.maxRam;
    ramUsed = server.ramUsed === undefined ? maxRam : server.ramUsed;
    availRam = Number(maxRam) - Number(ramUsed)
    // ns.tprint("available ram: ", availRam)

    maxThreads = Math.floor(availRam / minRam)

    if (maxThreads >= 1) {
      // ns.tprint('updating hostname: ', hostname)
      // ns.tprint("maxThreads: ", maxThreads)
      ns.exec(hackhelper, hostname, maxThreads, bestServer.hostname, minMoney, minSecurity);

      totalThreads += maxThreads;
    }

  }

  ns.tprint("Total threads created: ", totalThreads)



  // -----------------------------------------------------
  // FUNCTIONS
  // -----------------------------------------------------

  function getAllServers() {
    // returns allServers: a map of all servers key = hostname

    let allServers = new Map()
    let rootHosts = new Array()
    let serversToVisit = ns.scan("home")
    let visited = serversToSkip()

    serversToVisit = serversToVisit.filter((hostname) => !visited.includes(hostname))

    while (serversToVisit.length > 0) {
      let targethostname = serversToVisit.pop()

      // in case we got any already visited hosts, keep popping
      while (visited.includes(targethostname) && serversToVisit.length > 0) {
        targethostname = serversToVisit.pop()
      }

      let serverObject = ns.getServer(targethostname)
      visited.push(targethostname)

      allServers.set(targethostname, serverObject)

      if (serverObject.hasAdminRights && !rootHosts.includes(targethostname)) {
        rootHosts.push(targethostname)
      }

      // find any unvisited servers from here and add them to the list of ones to visit
      let newServers = ns.scan(targethostname)
      while (newServers.length > 0) {
        let unvisitedServer = newServers.pop()
        if (!visited.includes(unvisitedServer)) {
          serversToVisit.push(unvisitedServer)
        }
      }
    }

    allServers.set("roothostnames", rootHosts)

    return allServers
  }

  function getRoot(value, key, map) {
    // expected to be called on each key of a server map 
    // attempts to get root access to a given server

    // ns.tprint("get root called for key: ", key)
    let rootedHosts = map.get("roothostnames")

    if (key == "roothostnames" || value.hasAdminRights || rootedHosts.includes(key)) {
      return
    }

    let openablePorts = map.get("openablePorts")
    let portsRequired = value.numOpenPortsRequired
    // ns.tprint("openablePorts: ", openablePorts)
    // ns.tprint("portsRequired: ", portsRequired)
    if (portsRequired != undefined && portsRequired <= openablePorts) {
      // ns.tprint("Attempting...")
      switch (openablePorts) {
        case 5: ns.sqlinject(key)
        case 4: ns.httpworm(key)
        case 3: ns.relaysmtp(key)
        case 2: ns.ftpcrack(key)
        case 1: ns.brutessh(key)
      }

      ns.nuke(key)
      let newServerDetails = ns.getServer(key)
      if (newServerDetails.hasAdminRights) {
        // ns.tprint("got root on server ", key)
        map.set(key, newServerDetails)
        Array(rootedHosts).push(key)
        map.set("roothostnames", key)
      }
    }

    return

  }

  function getBestServerInMap(serverMap) {
    // returns bestServer -- a server object

    const currentHackLevel = ns.getHackingLevel();

    ns.tprint("CurrentHackLevel: ", currentHackLevel)

    let maxMoney = 0;
    let bestServer = "home";

    let rootHostsList = serverMap.get("roothostnames");

    ns.tprint("rootHostsList: ", rootHostsList)

    for (let i = 0; i < rootHostsList.length; i++) {
      let hostname = rootHostsList[i].toString();
      // ns.tprint("hostname: ", hostname)

      let server = serverMap.get(hostname);
      if (server !== undefined) {
        let serverMaxMoney = server.moneyMax === undefined ? 0 : server.moneyMax;
        let requiredHackingSkill = server.requiredHackingSkill === undefined ? -1 : server.requiredHackingSkill;

        // ns.tprint("moneyMax: ", serverMaxMoney, "     reqHackSkill: ", requiredHackingSkill)

        if (requiredHackingSkill != -1 && serverMaxMoney != undefined
          && requiredHackingSkill <= currentHackLevel / 2
          && serverMaxMoney > maxMoney) {
          bestServer = hostname
          maxMoney = serverMaxMoney > maxMoney ? serverMaxMoney : maxMoney
        }
      }
    }

    return serverMap.get(bestServer)
  }

  // -----------------------------------------------------
  // HELPER FUNCTIONS
  // -----------------------------------------------------

  function serversToSkip() {
    // returns a list of purchased servers and home
    // used to filter lists of servers

    let skip = new Array()

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

    return openablePortsNum
  }

  function copyFiles(value, key, map) {
    if (key == "roothostnames" || key == "openablePorts") {
      return
    }

    const files = ["hacker-helper.js"]
    ns.scp(files, key)
  }
}