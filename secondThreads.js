/** @param {NS} ns */
import { GetAllServers } from "./GetAllServers";
import { RunScript } from "./RunScript";
// import { GetBestServer } from "./GetBestServer";

export async function main(ns) {
  const hackfile = "hack.js";
  const growfile = "grow.js";
  const weakenfile = "weaken.js";

  // No point recalculating these in the loop, they are constant
  const hackRam = ns.getScriptRam(hackfile);
  const growRam = ns.getScriptRam(growfile);
  const weakenRam = ns.getScriptRam(weakenfile);

  let allServers = GetAllServers(ns);

  // ns.tprint(allServers.toString())

  // Infinite loop that continuously hacks/grows/weakens the target server
  while (true) {
    const homeMaxRam = ns.getServerMaxRam("home") - 32; // Doing it in the loop since we might update home ram while the script is running
    // set target to the input argument
    let target = ns.args[0]

    ns.tprint(`Target server: ${target}.`)

    let moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    let securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    // We recalculate times each loop, because the security will go up and down as we go, affecting those times
    const hackTime = ns.getHackTime(target);
    const growTime = ns.getGrowTime(target);
    const weakenTime = ns.getWeakenTime(target);

    // Weaken thread calculation:
    const minSec = ns.getServerMinSecurityLevel(target);
    const sec = ns.getServerSecurityLevel(target);
    let weakenThreads = Math.ceil((sec - minSec) / ns.weakenAnalyze(1));

    // Hack thread calculation:
    let money = ns.getServerMoneyAvailable(target);
    if (money <= 0) money = 1; // division by zero safety
    // ns.tprint(`Target: ${target}    Money: ${money}`)
    // ns.tprint(`Hack analyze threads: `, ns.hackAnalyzeThreads(target, money))
    let hackThreads = Math.ceil(ns.hackAnalyzeThreads(target, money));
    // ns.tprint(`HackThreads: ${hackThreads}`)

    // Grow thread calculation:
    let maxMoney = ns.getServerMaxMoney(target);
    let growThreads = Math.ceil(ns.growthAnalyze(target, maxMoney / money));

    if (ns.getServerSecurityLevel(target) > securityThresh) {
      // If the server's security level is above our threshold, weaken it
      ns.tprint(`Weaken threads: ${weakenThreads} -- Weaken Time: ${formatTime(weakenTime)}`)
      await RunScript(ns, weakenfile, weakenThreads, target);
      await ns.sleep(weakenTime);
    } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
      // If the server's money is less than our threshold, grow it
      ns.tprint(`Grow threads: ${growThreads}  -- Grow Time: ${formatTime(growTime)}`)
      await RunScript(ns, growfile, growThreads, target);
      await ns.sleep(growTime);
    } else {
      // Otherwise, hack it
      ns.tprint(`Hack threads: ${hackThreads}  -- Hack Time: ${formatTime(hackTime)}`)
      await RunScript(ns, hackfile, hackThreads, target);
      await ns.sleep(hackTime);
    }
  }
}

export function formatTime(raw){
  let seconds = Math.ceil(raw/1000)
  let minutesWhole = Math.floor(seconds / 60)
  let remainingSec = seconds % 60

  if(seconds <= 59){
    return `${seconds} seconds`
  } else {
    if(minutesWhole < 60){
      return `${minutesWhole} minutes and ${remainingSec} seconds`
    }
  }

  let hours = Math.floor(minutesWhole / 60)
  let minRem = minutesWhole % 60
  return `${hours} hours and ${minRem} minutes`

}
