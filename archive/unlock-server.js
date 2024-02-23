/** @param {NS} ns */
const readline = require("readline")

export async function main(ns) {
  const rl =
    readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

  let targetServer = "";

  // question user to enter name
  rl.question("servername:\n", function (string) {
    targetServer = string;

    // close input stream
    rl.close();
  });
  ns.brutessh(targetServer)
  ns.nuke(targetServer)
}