## TL;DR

**Tip: This bot is for transferring sats and receiving tokens, not for issuing any tokens.**

```
bot
├── example
│   └── xxxxxx.ts --for manual test
├── src
│   ├── index.ts --main
│   └── msg.ts --msg format
├── test 
│   └── xxxxxxx.ts --for Bitcoin Regtest
├── package.json
├── package-lock.json
└── .env --configuration (privatekey, bot token etc..)
```

How to play:
If you don't issue tokens, you don't need to use an issuer wallet.
Just create a wallet for transferring and receiving tokens in spark, transfer the specified sats to the dev's wallet (destination spark address) and wait for the dev to transfer the minted tokens to your spark address (not automatic, depends on the dev's reputation).

大概玩法是：
如果不发币则不需要用issuer wallet
直接创建一个钱包spark用来转账和接收代币即可，需要打哪个就向目标spark地址转账指定sats，等待对方转币给你（非自动打币，取决于dev信誉）



pre-requirement: create a telegram bot & api token & node.js

**Installation**

```
git clone https://github.com/auroraug/trashSparkBot.git
```

```
npm install
ts-node src/index.ts
```

