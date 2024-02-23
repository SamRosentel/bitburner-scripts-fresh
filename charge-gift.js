/** @param {NS} ns */
export async function main(ns) {

  const homeMaxRam = ns.getServerMaxRam("home") - 32;
  const scriptName = "gift-threads.js";
  const ramPerThread = ns.getScriptRam(scriptName);

  // if no arg passed in, default to 1
  let threads = ns.args[0] ? ns.args[0] : 1;
  let maxThreads = homeMaxRam/ramPerThread;

  // take the lower of threads and max threads
  threads = threads < maxThreads ? threads : maxThreads;

  // run that many threads on server "home"
  await ns.exec(scriptName, "home", threads);
}