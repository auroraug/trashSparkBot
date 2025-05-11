// Mock user wallet
const balance = await userWallet.getBalance();

// Get Issuer wallet receiving address for user to send tokens to
const address = await wallet.getSparkAddress();
console.log("Send to this address: ", address);

// Send from the users wallet 
  const transfer = await userWallet.transferTokens({
    tokenPublicKey: balance.tokenbalance.keys().next().value;      
    receiverSparkAddress: sparkAddress,
    tokenAmount: 1n,  // 1000 sats
  });
console.log("Transfer details:", transfer);

// Once transaction completes issuer wallet balance
const issuerBalance = await wallet.getBalance();
console.log("Issuer balance: ", issuerBalance);

// Burn token
const burn = await wallet.burnTokens({
  tokenAmount: 1n
});

const finalIssuerBalance = await wallet.getBalance();
console.log("Final Issuer balance: ", finalIssuerBalance);