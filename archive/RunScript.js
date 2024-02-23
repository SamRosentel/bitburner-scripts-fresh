/** @param {NS} ns */
import { GetAllServers } from "./GetAllServers";
// export async function main(ns) { }

export async function RunScript(ns, scriptName, threads, target) {
  if (threads < 1) {
    return
  }

  // Find all servers
  let allServers = GetAllServers(ns);
  // allServers = allServers.filter((server) => server != "home")

  // Sort by maximum memory
  allServers = allServers.sort(RamSort);
  function RamSort(a, b) {
    if (ns.getServerMaxRam(a) > ns.getServerMaxRam(b)) return -1;
    if (ns.getServerMaxRam(a) < ns.getServerMaxRam(b)) return 1;
    return 0;
  }

  // Find script RAM usage
  let ramPerThread = ns.getScriptRam(scriptName);

  // Find usable servers
  let usableServers = allServers.filter(
    (p) => ns.hasRootAccess(p) && ns.getServerMaxRam(p) > 0
  );

  // Fired threads counter
  let fired = 0;

  for (const server of usableServers) {
    // Determine how many threads we can run on target server for the given script
    let so = ns.getServer(server)
    let availableRam = so.maxRam - ns.getServerUsedRam(server);
    availableRam = server == 'home' ? availableRam - 32 : availableRam;
    let possibleThreads = Math.floor(availableRam / ramPerThread);

    // Check if server is already at max capacity
    if (possibleThreads <= 0) continue;

    // Lower thread count if we are over target
    if (possibleThreads > threads) possibleThreads = threads;

    // Copy script to the server
    if (server != "home") await ns.scp(scriptName, server);

    // Fire the script with as many threads as possible
    await ns.print(
      `Starting script ${scriptName} on ${server} with ${possibleThreads} threads`
    );

    await ns.exec(scriptName, server, possibleThreads, target);
    fired += possibleThreads;
    if (fired >= threads) break;
  }
}


