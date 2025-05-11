import { SparkWallet } from "@buildonspark/spark-sdk";
import { getLatestDepositTxId } from "@buildonspark/spark-sdk/utils";

async function generateTestWallet() {
    const { wallet, mnemonic } = await SparkWallet.initialize({
        options: {
            network: "REGTEST",
        },
    });
    console.log("Wallet mnemonic:", mnemonic);

    const sparkAddress = await wallet.getSparkAddress()
    console.log(`sparkAddress: ${sparkAddress}`)
}

async function getWalletInfos() {
    const { wallet } = await SparkWallet.initialize({
        mnemonicOrSeed: process.env.mnemonic_test,
        options: {
            network: "REGTEST",
        },
    });
    const pubkey = await wallet.getIdentityPublicKey()
    const l1Address = await wallet.getTokenL1Address()
    const sparkAddress = await wallet.getSparkAddress()
    /*
        pubkey: 029db9f5b04017083a1183b3ffa6e3d2a9f27181444f786789e3a685b8c0916b63
        l1Address: bcrt1q2tw7dv0v9r5j0apvmlc2g3vgxlxl9xc9c6ekqf
        sparkAddress: sprt1pgss98de7kcyq9cg8ggc8vll5m3a920jwxq5gnmcv7y78f59hrqfz6mrs6rajh
    */
    console.log(`pubkey: ${pubkey}`)
    console.log(`l1Address: ${l1Address}`)
    console.log(`sparkAddress: ${sparkAddress}`)
}

async function generateDepositAddress() {
    const { wallet } = await SparkWallet.initialize({
        mnemonicOrSeed: process.env.mnemonic_test,
        options: {
            network: "REGTEST",
        },
    });
    // Generate a L1 deposit address
    const depositAddress = await wallet.getSingleUseDepositAddress();
    console.log(`depositAddress: ${depositAddress}`)
}

async function claimDeposit(depositAddress: string) {
    const { wallet } = await SparkWallet.initialize({
        mnemonicOrSeed: process.env.mnemonic_test,
        options: {
            network: "REGTEST",
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
    console.log(`balance: ${balance.balance}`)
}

// getWalletInfos()
// generateTestWallet()
// generateDepositAddress()
// claimDeposit('bcrt1p5fxuea24x6egrhc2rkhnpumhnnwpukzarhxspxztltcxe5xhpmcslvhmy8')