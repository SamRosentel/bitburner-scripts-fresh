/** @param {NS} ns */
export async function main(ns) {
  let fragments = ns.stanek.activeFragments()

  while (true){
    for (let i = 0; i < fragments.length; i++) {
      let fragment = fragments[i]
      // ns.tprint(`charging fragment: ${fragment.effect}`)
      if (fragment.effect.search('djacent') == -1) {
        for (let j = 0; j < 20; j++){
          await ns.stanek.chargeFragment(fragment.x, fragment.y)
        }
      }
    }
  }
}