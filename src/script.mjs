import { ethers } from "ethers";
import DarkForestAbiJson from "./dark_forest_abi.json";
import ERC721AbiJson from "./erc_721_abi.json";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/", 137);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);


// https://polygonscan.com/address/0x8d528e98a69fe27b11bb02ac264516c4818c3942
const DARK_FOREST_CONTRACT = "0x8d528e98a69fe27b11bb02ac264516c4818c3942";
// https://polygonscan.com/token/0xdc0479cc5bba033b3e7de9f178607150b3abce1f
const UNICORN_NFT_CONTRACT = "0xdc0479cc5bba033b3e7de9f178607150b3abce1f";


async function main() {
    const DarkForestContract = new ethers.Contract(DARK_FOREST_CONTRACT, DarkForestAbiJson, wallet);
    const UnicornNFTContract = new ethers.Contract(UNICORN_NFT_CONTRACT, ERC721AbiJson, wallet);
    const address = wallet.address;

    console.log("Your address: ", address);


    // 1. Find out how many unicorns are being staked
    const numStaked = (await DarkForestContract.numStaked(address)).toNumber();
    if (numStaked > 0) {
        // Assuming user wanna unstake
        for (let i = 0; i < numStaked; i++) {
            const tokenId = (await DarkForestContract.tokenOfStakerByIndex(address, i)).toNumber();
            const unstakedAt = (await DarkForestContract.unstakesAt(tokenId)).toNumber();
            const timeNow = Math.floor(Date.now() / 1000);
            const canUnstake = timeNow > unstakedAt;

            if (canUnstake) {
                console.log(`Unstaking Unicorn $${tokenId}...`)
                // Unstake
                try {
                    const tx = await DarkForestContract.exitForest(tokenId);
                    console.log(`https://polygonscan.com/tx/${tx.hash}`)
                    await tx.wait();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    } else {
        // Assuming user wanna stake
        const balanceOf = (await UnicornNFTContract.balanceOf(address)).toNumber();
        if (balanceOf === 0) {
            throw new Error("No Unicorns NFT Found in both wallet and Dark Forest Contract")
        }
        for (let i = 0; i < balanceOf; i++) {
            const tokenId = (await UnicornNFTContract.tokenOfOwnerByIndex(address, i)).toNumber()
            console.log(`Staking Unicorn $${tokenId}...`)
            try {
                // Stake
                const tx = await UnicornNFTContract.safeTransferFrom(
                    address, // from
                    DARK_FOREST_CONTRACT, // to
                    tokenId, // tokenId
                );
                console.log(`https://polygonscan.com/tx/${tx.hash}`)
                await tx.wait();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


main()
    .then(() => {
        console.log("Done!")
    })