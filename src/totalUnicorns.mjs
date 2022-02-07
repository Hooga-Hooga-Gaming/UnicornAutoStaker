import {ethers} from "ethers";
import DarkForestAbiJson from "./dark_forest_abi.json";

const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/", 137);

// https://polygonscan.com/address/0x8d528e98a69fe27b11bb02ac264516c4818c3942
const DARK_FOREST_CONTRACT = "0x8d528e98a69fe27b11bb02ac264516c4818c3942";
// https://polygonscan.com/token/0xdc0479cc5bba033b3e7de9f178607150b3abce1f
const UNICORN_NFT_CONTRACT = "0xdc0479cc5bba033b3e7de9f178607150b3abce1f";

async function main() {
    const DarkForestContract = new ethers.Contract(DARK_FOREST_CONTRACT, DarkForestAbiJson, provider);
    let totalCount = 0;
    let addressObj = {};
    for(let i = 0; i < 10000; i++) {
        const address = await DarkForestContract.staker(i);
        if(address !== "0x0000000000000000000000000000000000000000") {
            addressObj[address] = addressObj[address] ? addressObj[address] + 1 : 1;
            console.log(i);
        }
    }
    const addressArr = Object.keys(addressObj);
    const totalUnicornsStaked = addressArr.reduce((a, b) => a + addressObj[b], 0);
    console.log(JSON.stringify(addressObj, {}, 2))
    console.log(`Total Unique Unicorns Staker: ${addressArr.length}`);
    console.log(`Total Unicorn Staked: ${totalUnicornsStaked}`);
}

main();