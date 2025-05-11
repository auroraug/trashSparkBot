import { SparkWallet } from "@buildonspark/spark-sdk";
import { getLatestDepositTxId } from "@buildonspark/spark-sdk/utils";

async function generate() {
    const { wallet, mnemonic } = await SparkWallet.initialize({
        options: {
            network: "MAINNET",
        },
    });
    console.log("Wallet mnemonic:", mnemonic);
}

async function getWalletInfos() {
    const { wallet } = await SparkWallet.initialize({
        mnemonicOrSeed: process.env.mnemonic,
        options: {
            network: "MAINNET",
        },
    });
    const pubkey = await wallet.getIdentityPublicKey()
    const l1Address = await wallet.getTokenL1Address()
    const sparkAddress = await wallet.getSparkAddress()
    /*
        pubkey: 03beac388a4008a2a3d67e470c8c1f156ff0eb36b733284b6f8cbf17c550f29f44
        l1Address: bc1ql4q4dtkkv6edccn8fzcyvynlq79tfzra6fafkx
        sparkAddress: 
        sp1pgss804v8z9yqz9z50t8u3cv3s032mlsavmtwvegfdhce0chc4g0986yerj6w7
        sp1pgssx95a30ukcewkdlnz0d2dljxwqemwwsyxpfjypuu89ef8rsjl32j59y2x0t
    */
    console.log(`pubkey: ${pubkey}`)
    console.log(`l1Address: ${l1Address}`)
    console.log(`sparkAddress: ${sparkAddress}`)
}

export async function generateDepositAddress() {
    const { wallet } = await SparkWallet.initialize({
        mnemonicOrSeed: process.env.mnemonic,
        options: {
            network: "MAINNET",
        },
    });
    // Generate a L1 deposit address
    const depositAddress = await wallet.getSingleUseDepositAddress();
    console.log(`depositAddress: ${depositAddress}`)
}

async function claimDeposit(depositAddress: string) {
    const { wallet } = await SparkWallet.initialize({
        mnemonicOrSeed: process.env.mnemonic,
        options: {
            network: "MAINNET",
        },
    });
    // Claim L1 deposit
    const result = await getLatestDepositTxId(depositAddress);

    if (result) {
        console.log("Transaction ID: ", result);
        const tx = await wallet.claimDeposit(result);
        console.log("Deposit TX: ", tx);
    }

    // Check Wallet balance
    const balance = await wallet.getBalance();
    console.log(`balance: ${balance}`)
}

// generate()
// getWalletInfos()
// generateDepositAddress()
claimDeposit('bc1p9qtmsv5vxwvcxs0vg8znxm888wgj0z5gj93yrclx60zl4k0e8mkqlrl6pk')