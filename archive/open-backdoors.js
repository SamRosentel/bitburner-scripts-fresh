/** @param {NS} ns */
export async function main(ns) {
  let hackLevel = ns.getHackingLevel()
  let hostNames = getAllHosts()

  // ns.tprint(hostNames.toString())

  // returns a 2D array with [reqHackLevel, hostname]
  let noBackdoor = findBackdoorByHost(hostNames, false).sort(compareRequiredLevel)
  let readyForBackdoor = []

  // for (let i = 0; i < noBackdoor.length; i++) {
  //   ns.tprint("server details: ", noBackdoor[i][0], ", ", noBackdoor[i][1])
  // }


  let index = 0
  while (index < noBackdoor.length) {
    hackLevel = ns.getHackingLevel()
    let serverName = noBackdoor[index][1]
    let serverLevel = noBackdoor[index][0]
    // ns.tprint("My hack level: ", hackLevel, ", serverName: ", serverName, " , serverLevel: ", serverLevel)

    if (Number(hackLevel) > Number(serverLevel)) {
      readyForBackdoor.push(serverName)
      // await ns.sleep(1000)
    } else {
      //break;
    }
    index++
  }

  ns.tprint("Backdoors to open: ", readyForBackdoor.length)
  if(readyForBackdoor.length > 0)
    ns.tprint(readyForBackdoor.sort().toString())

  //
  // Functions
  //

  function findBackdoorByHost(hostNamesList, hasBackdoor) {
    let backdoorInstalled = [[]];

    for (let i = 0; i < hostNamesList.length; i++) {
      let serverObj = ns.getServer(hostNamesList[i]);

      if (serverObj.backdoorInstalled == hasBackdoor) {
        let requiredLevel = serverObj.requiredHackingSkill
        // ns.tprint('hostname: ', serverObj.hostname)
        // ns.tprint('level: ', requiredLevel)
        let newServer = [Number(requiredLevel), serverObj.hostname]
        // ns.tprint(newServer.toString())
        if(serverObj.hostname != "home" && serverObj.hostname != 'darkweb')
          backdoorInstalled.push(newServer)
      }
    }

    return backdoorInstalled
  }

  function compareRequiredLevel(a, b) {
    if (Number(a[0]) < Number(b[0])) {
      return -1;
    } else {
      return 1
    }
  }


  function getAllHosts() {
    let hostnames = ns.scan("home")
    let visited = []
    let target = ""

    while (hostnames.length > 0) {
      target = hostnames.pop()
      while (visited.includes(target) && hostnames.length > 0) {
        target = hostnames.pop()
      }

      if (!target.endsWith('GB')) {
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
}