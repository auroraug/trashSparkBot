import { IssuerSparkWallet } from "@buildonspark/issuer-sdk";
import { SparkWallet } from "@buildonspark/spark-sdk";
import { getLatestDepositTxId } from "@buildonspark/spark-sdk/utils";

// Create the Issuer Spark wallet
const { wallet, mnemonic } = await IssuerSparkWallet.initialize({
  mnemonicOrSeed:
    "aware envelope rich yard strike bunker cancel like life add couch sun",
  options: {
    network: "MAINNET",
  },
});

// Fund Issuer Wallet to fund token announcement on L1
const l1Address = wallet.getTokenL1Address();
console.log("Fund this address:", l1Address);
const result = await getLatestDepositTxId(address);
if (result) {
  console.log("Transaction ID: ", result);
  const tx = await wallet.claimDeposit(result);
  console.log("Deposit tx:", tx);
}

// Announce the token on L1
await wallet.announceTokenL1({
  tokenName: "Your Stable Token",
  tokenTicker: "MYUSD",
  maxSupply: 1_000_000_000_000n,
  decimals: 6,
  isFreezeable: true,
});

// Mint tokens to the issuer wallet
const transaction = await wallet.mintTokens(1n);
const balance = await wallet.getBalance();
console.log("Sat and token balance: ", balance);