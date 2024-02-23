/** @param {NS} ns */
import { Weight } from "./Weight"
import { GetAllServers } from "./GetAllServers"

export async function main(ns) {
  let servers = GetRankedServers(ns)
  let topIndex = ns.args.length > 0 ? ns.args[0] : 1

  //ns.tprint(servers.toString())

  for (var index = 0; index < topIndex; index++) {
    ns.tprint("Server ", servers[index][1], " weight = ", servers[index][0])
  }
}

export const GetBestServer = (ns) => {

  let maxWeight = 0;
  let bestServer = 'n00dles';

  let allServers = GetAllServers(ns);
  for (var server of allServers) {
    let weight = Weight(ns, server);
    if (weight > maxWeight) {
      bestServer = server;
      maxWeight = weight;
    }
  }

  return bestServer
}

export const GetRankedServers = (ns) => {
  let allServers = GetAllServers(ns);
  let serverWeights = [[]];
  for (var server of allServers) {
    let weight = Math.floor(Weight(ns, server));
    if (weight != 0)
      serverWeights.push([weight, server])
  }

  serverWeights.sort(compareFn)

  return serverWeights
}

export function compareFn(a, b) {
  if (a[0] < b[0]) {
    return 1
  } else {
    return -1
  }
}
