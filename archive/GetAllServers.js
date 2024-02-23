/** @param {NS} ns */

// Recursive way (the function calls itself until it runs out of paths to search)
export function GetAllServers(ns, root = "home", found = new Set()) {
  found.add(root);
  let serverList = ns.scan(root);
  for (var server of serverList) {
    if (!found.has(server)) GetAllServers(ns, server, found);
  }
  return [...found];
}