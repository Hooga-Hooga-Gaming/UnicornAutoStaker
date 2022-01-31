# Unicorn Darkforest Auto Stake + Claim

Official site: https://darkforest.cryptounicorns.fun/

**Use at your own risk, we're not responsible for loss of funds / nfts**

## Feature
- Detect all Unicorns NFTs being staked in Dark Forest and unstake it 
- Detect all Unicorns in the wallet and stake it

## Improvement
- Using a dumb delay to make sure all the txs go through, should check for whether the tx go through or not to send another tx
- The script only work in a mode, if users got staked unicorn will unstaked all that is available; if user dont have staked unicorn, it will proceed to stake every single unicorn in the wallet.

## Requirement
- Node.js

## Setup
- Setup `.env`

```
PRIVATE_KEY=<insert private key here>
```

- Installation

```bash
npm install
npm run start
```

## About this script
Script created by [Johnson Lai](https://twitter.com/jlwhoo7) under MIT License
