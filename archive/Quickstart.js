/** @param {NS} ns */

import { GetRankedServers } from "./GetBestServer";
import { RunScript } from "./RunScript";
// import { Weight } from "./Weight";
// import { StartThread } from "./start-threads";
// import { GetAllServers } from "./GetAllServers";

export async function main(ns) {
  while (true) {
    let topServers = GetRankedServers(ns)
    ns.print(topServers)
    for (let i = 0; i < 5; i++) {
      ns.print(topServers[i][1])
      if (!ns.isRunning("secondThreads.js", "home", topServers[i][1])) {
        await RunScript(ns, "secondThreads.js", topServers[i][1]);
      }
    }
    await ns.sleep(5000)
  }

}