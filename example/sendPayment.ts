import { SparkWallet } from "@buildonspark/spark-sdk";

(async() => {
    const { wallet } = await SparkWallet.initialize({
        mnemonicOrSeed: process.env.mnemonic,
        options: {
        network: "MAINNET",
        },
    });

    // Create a mock receiver wallet
    const { wallet: receiverWallet, mnemonic: receiverMnemonic } =
    await SparkWallet.initialize({
        options: {
        network: "MAINNET",
        },
    });

    // Generate the receiver wallet Spark address
    const sparkAddress = await receiverWallet.getSparkAddress();
    console.log("Receiving wallet Spark address:", sparkAddress);

    // Send a payment to the receiver wallet
    const transfer = await wallet.transfer({
        receiverSparkAddress: sparkAddress,
        amountSats: 1000, // 1000 sats
    });
    console.log("Transfer details:", transfer);

    // Update balance when payment is received
    receiverWallet.on("transfer:claimed", (transferId: string, balance: number) => {
    console.log(`Transfer ${transferId} claimed. New balance: ${balance}`);
    });
})