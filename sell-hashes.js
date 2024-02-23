/** @param {NS} ns */
export async function main(ns) {
    let totalHashes = await ns.hacknet.numHashes()
    
    // let upgradesAvail = ns.hacknet.getHashUpgrades()
    // ns.tprint(`Hash upgrades available: ${upgradesAvail}`)

    // let upgradesAvail =
    // [
    //     "Sell for Money",
    //     "Sell for Corporation Funds",
    //     "Reduce Minimum Security",
    //     "Increase Maximum Money",
    //     "Improve Studying",
    //     "Improve Gym Training",
    //     "Exchange for Corporation Research",
    //     "Exchange for Bladeburner Rank",
    //     "Exchange for Bladeburner SP",
    //     "Generate Coding Contract",
    //     "Company Favor"
    // ]

    while ( true){
        if (totalHashes > 4 ){
            // ns.tprint(`Total Hashes = ${totalHashes}`)
            ns.hacknet.spendHashes("Sell for Money","thisisneededforcount", 8) 
        } else { return; }

        totalHashes = ns.hacknet.numHashes()
        await ns.sleep(100)
    }
}