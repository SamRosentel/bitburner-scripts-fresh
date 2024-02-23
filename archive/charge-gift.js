/** @param {NS} ns */
export async function main(ns) {
  let fragments = ns.stanek.activeFragments()

  for (let i = 0; i < fragments.length; i++) {
    let fragment = fragments[i]
    ns.tprint("Fragment:", fragment)
    if (fragment.effect.search('djacent') == -1) {
      while (fragment.numCharge < fragment.power) {
        await ns.stanek.chargeFragment(fragment.x, fragment.y)
        fragment = ns.stanek.getFragment(fragment.x, fragment.y)
      }
    }
  }
}