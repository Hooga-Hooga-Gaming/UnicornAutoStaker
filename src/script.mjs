import { ethers } from "ethers";
import DarkForestAbiJson from "./dark_forest_abi.json";
import ERC721AbiJson from "./erc_721_abi.json";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/", 137);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);


// https://polygonscan.com/address/0x8d528e98a69fe27b11bb02ac264516c4818c3942
const DARK_FOREST_CONTRACT = "0x8d528e98a69fe27b11bb02ac264516c4818c3942";
// https://polygonscan.com/token/0xdc0479cc5bba033b3e7de9f178607150b3abce1f
const UNICORN_NFT_CONTRACT = "0xdc0479cc5bba033b3e7de9f178607150b3abce1f";


async function main() {
    const DarkForestContract = new ethers.Contract(DARK_FOREST_CONTRACT, DarkForestAbiJson, provider);
    const UnicornNFTContract = new ethers.Contract(UNICORN_NFT_CONTRACT, ERC721AbiJson, provider);
    const unicornsNFT = [];
    const address = signer.address;
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
                // Unstake
                const DarkForestContractWithSigner = DarkForestContract.connect(signer);
                const tx = await DarkForestContractWithSigner.exitForest(tokenId);
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
            // Stake
            const UnicornNFTContractWithSigner = UnicornNFTContract.connect(signer);
            const tx = await UnicornNFTContractWithSigner.safeTransferFrom(
                address, // from
                DARK_FOREST_CONTRACT, // to
                tokenId, // tokenId
                "" // _data
            );
        }
    }
}

main()
    .then(() => {
        console.log("Done!")
    })