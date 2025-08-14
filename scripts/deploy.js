const { ethers, run, network } = require("hardhat");
require("dotenv").config();

async function sendTxWithDelay(txPromise, delayMs = 5000) {
  console.log(`⏳ Waiting ${delayMs / 1000} seconds before sending tx…`);
  await new Promise(res => setTimeout(res, delayMs));

  const tx = await txPromise;
  const receipt = await tx.wait();
  return receipt;
}

async function main() {
  const deployer = new ethers.Wallet(process.env.TESTNET_PRIVATE_KEY, ethers.provider);
  console.log(`👷 Deploying contracts with: ${deployer.address}`);

  const verify = async (address, constructorArgs = []) => {
    console.log(`🔍 Verifying ${address}…`);
    try {
      await run("verify:verify", {
        address,
        constructorArguments: constructorArgs,
      });
      console.log(`✅ Verified: ${address}`);
    } catch (err) {
      if (err.message.includes("Already Verified")) {
        console.log(`ℹ️ Already Verified: ${address}`);
      } else {
        console.error(`❌ Verification failed: ${err}`);
      }
    }
  };

  // 🚀 Deploy SoulboundNFT
  const NFT = await ethers.getContractFactory("SoulboundNFT", deployer);
  const nft = await NFT.deploy();
  await nft.waitForDeployment();
  console.log(`🏷️ SoulboundNFT deployed at: ${nft.target}`);

  // 🚀 Deploy SoulboundReputation with NFT address
  const Reputation = await ethers.getContractFactory("SoulboundReputation", deployer);
  const reputation = await Reputation.deploy(nft.target);
  await reputation.waitForDeployment();
  console.log(`🏷️ SoulboundReputation deployed at: ${reputation.target}`);

  // 🚀 Deploy UserRegistration with NFT address
  const Registration = await ethers.getContractFactory("UserRegistration", deployer);
  const registration = await Registration.deploy(nft.target);
  await registration.waitForDeployment();
  console.log(`🏷️ UserRegistration deployed at: ${registration.target}`);

  // Grant Minter Roles
  await sendTxWithDelay(
    nft.connect(deployer).grantMinterRole(registration.target)
  );
  console.log(`✅ Minter role granted to UserRegistration.`);

  await sendTxWithDelay(
    nft.connect(deployer).grantMinterRole(reputation.target)
  );
  console.log(`✅ Minter role granted to SoulboundReputation.`);

  // Verify on Etherscan if not localhost
  if (network.name !== "localhost" && network.name !== "hardhat") {
    console.log(`⏳ Waiting 10s before verification…`);
    await new Promise(r => setTimeout(r, 10000));
    await verify(nft.target);
    await verify(reputation.target, [nft.target]);
    await verify(registration.target, [nft.target]);
  }

  console.log(`🎯 Deployment complete.`);
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });