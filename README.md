# CryptoUnicorns Darkforest Auto Stake & Unstake Script

Official site: https://darkforest.cryptounicorns.fun/

**Use at your own risk, we're not responsible for loss of funds / nfts**

## Feature
- Detect all Unicorns NFTs being staked in Dark Forest and unstake it 
- Detect all Unicorns in the wallet and stake it

## Improvement
- Allow replacement of tx since polygon are super unstable in terms of gas price
- The script only work in a mode, if users got staked unicorn will unstaked all that is available; if user dont have staked unicorn, it will proceed to stake every single unicorn in the wallet.
- Make it into a cron job.

## Requirement
- Node.js

## Setup
- Setup `.env`

```
PRIVATE_KEY=<insert private key here>
```

- Change `src/config.mjs`, change gas price based on polygon chain.

```js
const config = {
    // Check gas price here https://polygonscan.com/gastracker
    GAS_PRICE: 30 // gas price in gwei
}

```

- Installation

```bash
npm install
npm run start
```

## How to use the script

Scenario 1:

When you got 5 unstaked unicorns, run `npm run start`, it will stake the unicorns one by one and make sure all tx fulfilled before sending another one, so make sure there is enough $MATIC and the gas fee is high enough.

Scenario 2:

When you got 5 staked unicorns, run `npm run start`, it will unstake all your unicorns, same as above, run `npm run start` again to stake all the unicorns again.

## About this script
Script created by [Johnson Lai](https://twitter.com/jlwhoo7) under MIT License
