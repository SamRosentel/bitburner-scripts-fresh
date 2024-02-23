/** @param {NS} ns */
export async function main(ns) {
  // TO DO
  // Add arg for levels away from current
  // Add arg for filename
  copyScriptToRootHosts()

  function copyScriptToRootHosts() {
    let hostnames = getAllRootHosts()

    const file = "early-hacking-script.js"
    let reqRam = ns.getScriptRam(file)

    while (hostnames.length > 0) {
      let host = hostnames.pop()
      copyFile(file, host)
    }
  }

  //
  // functions
  //
  function getAllRootHosts() {
    let hostnames = ns.scan("home")
    let visited = ns.getPurchasedServers()
    let target = ''

    while (hostnames.length > 0) {
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

      if (success) {
        if (ns.isRunning(file, hostname)) {
          ns.kill(file, hostname)
        }
        let availRam = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname)
        let maxthreads = Math.floor(availRam / reqRam)

        if (maxthreads <= 0) return

        ns.exec(file, hostname, maxthreads)
      }
      else {
        ns.tprint("COPY FAILED: ", hostname)
      }
    }
  }
}