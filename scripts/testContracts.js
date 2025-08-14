const { ethers, network } = require("hardhat");
require("dotenv").config();

async function sendTxWithDelay(txPromise, delayMs = 3000) {
  await new Promise(res => setTimeout(res, delayMs));
  const tx = await txPromise;
  const receipt = await tx.wait();
  console.log(`📋 Tx mined: ${receipt.hash}`);
  return receipt;
}

async function wait(delayMs = 3000) {
  console.log(`⏳ Waiting ${delayMs / 1000}s for confirmations/indexing…`);
  return new Promise(res => setTimeout(res, delayMs));
}

async function main() {
  const chainId = (await ethers.provider.getNetwork()).chainId;

  const deployer = new ethers.Wallet(process.env.TESTNET_PRIVATE_KEY, ethers.provider);
  const user1 = new ethers.Wallet(process.env.USER1_PRIVATE_KEY, ethers.provider);
  const user2 = new ethers.Wallet(process.env.USER2_PRIVATE_KEY, ethers.provider);

  console.log(`👷 Deployer: ${deployer.address}`);
  console.log(`🎮 User1: ${user1.address}`);
  console.log(`🎮 User2: ${user2.address}`);
  console.log(`🔗 Network: ${network.name} (chainId: ${chainId})`);

  const nftAddr = process.env.NFT_ADDRESS;
  const reputationAddr = process.env.REPUTATION_ADDRESS;
  const registrationAddr = process.env.REGISTRATION_ADDRESS;

  if (!nftAddr || !reputationAddr || !registrationAddr) {
    throw new Error("❌ Missing NFT_ADDRESS, REPUTATION_ADDRESS, or REGISTRATION_ADDRESS in .env");
  }

  const nft = await ethers.getContractAt("SoulboundNFT", nftAddr, deployer);
  const reputation = await ethers.getContractAt("SoulboundReputation", reputationAddr);
  const registration = await ethers.getContractAt("UserRegistration", registrationAddr);

  console.log(`🏷️ SoulboundNFT: ${nftAddr}`);
  console.log(`🏷️ SoulboundReputation: ${reputationAddr}`);
  console.log(`🏷️ UserRegistration: ${registrationAddr}`);

  //
  // 🔷 User1 registers
  //
  console.log(`📝 User1 registering…`);
  await sendTxWithDelay(registration.connect(user1).register());

  await wait(4000);

  const isUser1Registered = await registration.isRegistered(user1.address);
  console.log(`✅ User1 registered: ${isUser1Registered}`);

  const hasRegAchiev = await nft.hasAchievement(
    user1.address,
    await nft.REGISTRATION_ACHIEVEMENT()
  );
  console.log(`🏆 User1 has REGISTRATION_ACHIEVEMENT: ${hasRegAchiev}`);

  //
  // 🔷 User1 rates User2
  //
  console.log(`📝 User1 rating User2…`);
  await sendTxWithDelay(reputation.connect(user1).rate(user2.address));

  await wait(4000);

  const user2Rep = await reputation.balanceOf(user2.address);
  console.log(`💯 User2 REP balance: ${ethers.formatEther(user2Rep)} REP`);

  const hasRateAchiev = await nft.hasAchievement(
    user1.address,
    await nft.FIRST_RATE_ACHIEVEMENT()
  );
  console.log(`🏆 User1 has FIRST_RATE_ACHIEVEMENT: ${hasRateAchiev}`);

//   //
//   // 🔷 Check double registration prevention
//   //
//   console.log(`🛑 Trying to register User1 again (should fail)…`);
//   try {
//     await sendTxWithDelay(registration.connect(user1).register());
//   } catch (err) {
//     console.log(`✅ Reverted as expected: ${err.reason || err.message}`);
//   }

//   await wait(3000);

//   //
//   // 🔷 Check double rating prevention
//   //
//   console.log(`🛑 Trying to rate User2 again (should fail)…`);
//   try {
//     await sendTxWithDelay(reputation.connect(user1).rate(user2.address));
//   } catch (err) {
//     console.log(`✅ Reverted as expected: ${err.reason || err.message}`);
//   }

//   await wait(3000);

  //
  // 🔷 Final checks after all interactions
  //
  console.log(`🔍 Final state checks:`);

  console.log(`📄 User1 registered: ${await registration.isRegistered(user1.address)}`);
  console.log(
    `🏆 User1 has REGISTRATION_ACHIEVEMENT: ${await nft.hasAchievement(
      user1.address,
      await nft.REGISTRATION_ACHIEVEMENT()
    )}`
  );
  console.log(
    `🏆 User1 has FIRST_RATE_ACHIEVEMENT: ${await nft.hasAchievement(
      user1.address,
      await nft.FIRST_RATE_ACHIEVEMENT()
    )}`
  );
  console.log(
    `💯 User2 REP balance: ${ethers.formatEther(
      await reputation.balanceOf(user2.address)
    )} REP`
  );

  console.log(`🎯 Test complete.`);
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
