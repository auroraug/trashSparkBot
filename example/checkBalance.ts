import { IssuerSparkWallet } from "@buildonspark/issuer-sdk";
import { SparkWallet } from "@buildonspark/spark-sdk";
import dotenv from 'dotenv'
dotenv.config()

// const mnemonic = process.env.mnemonic
// console.log(mnemonic)
const depositAddress = process.env.depositAddress
// console.log(depositAddress)

async function checkBalance() {
    // Create the Issuer Spark wallet
    const { wallet, mnemonic } = await IssuerSparkWallet.initialize({
    mnemonicOrSeed:
        process.env.mnemonic,
    options: {
        network: "MAINNET",
    },
    });
    // Fund Issuer Wallet to fund token announcement on L1
    const l1Address = await wallet.getTokenL1Address();
    console.log(l1Address)

    // Check Wallet balance after Receiving Spark Payments
    const balance = await wallet.getBalance();
    console.log(`balance: ${balance.balance}`)
    console.log(`Token balance: ${balance.tokenBalances.forEach(m => {
        `${m.tokenInfo}:${m.balance}`
    })}`)
}
checkBalance()