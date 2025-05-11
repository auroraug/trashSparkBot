import { IssuerSparkWallet } from "@buildonspark/issuer-sdk";
import { SparkWallet } from "@buildonspark/spark-sdk";
import dotenv from 'dotenv'
dotenv.config()

const test_mnemonic = process.env.mnemonic_test1

async function checkBalance() {
    // Create the Issuer Spark wallet
    const { wallet } = await IssuerSparkWallet.initialize({
    mnemonicOrSeed:
        test_mnemonic,
    options: {
        network: "REGTEST",
    },
    });
    // Fund Issuer Wallet to fund token announcement on L1
    const l1Address = await wallet.getTokenL1Address();
    
    console.log(l1Address)
    // Check Wallet balance
    const balance = await wallet.getBalance();
    console.log(`balance: ${balance.balance}`)
    console.log(`Token balance: ${balance.tokenBalances.forEach(m => {
        `${m.tokenInfo}:${m.balance}`
    })}`)
}
checkBalance()