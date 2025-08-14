const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("🎯 Soulbound Identity Suite", function () {
  async function deployFixture() {
    const [deployer, user1, user2] = await ethers.getSigners();

    // Deploy NFT
    const NFT = await ethers.getContractFactory("SoulboundNFT");
    const nft = await NFT.deploy();
    await nft.waitForDeployment();

    // Deploy Reputation
    const Reputation = await ethers.getContractFactory("SoulboundReputation");
    const reputation = await Reputation.deploy(nft.target);
    await reputation.waitForDeployment();

    // Deploy Registration
    const Registration = await ethers.getContractFactory("UserRegistration");
    const registration = await Registration.deploy(nft.target);
    await registration.waitForDeployment();

    // Grant mint roles
    await nft.connect(deployer).grantMinterRole(registration.target);
    await nft.connect(deployer).grantMinterRole(reputation.target);

    return { deployer, user1, user2, nft, reputation, registration };
  }

  it("should allow user1 to register and get achievement + log event", async () => {
    const { user1, registration, nft } = await loadFixture(deployFixture);

    const tx = await registration.connect(user1).register();
    const receipt = await tx.wait();

    // print logs
    console.log("\n📋 Logs from registration:");
    for (const log of receipt.logs) {
      console.log(`- ${log.fragment?.name || "Unknown"}:`, log.args);
    }

    expect(await registration.isRegistered(user1.address)).to.equal(true);

    const hasAchiev = await nft.hasAchievement(
      user1.address,
      await nft.REGISTRATION_ACHIEVEMENT()
    );
    expect(hasAchiev).to.equal(true);

    // check event explicitly
    const event = receipt.logs.find(l => l.fragment?.name === "UserRegistered");
    expect(event).to.not.be.undefined;
    expect(event.args.user).to.equal(user1.address);
  });

  it("should award FIRST_RATE_ACHIEVEMENT to rater and REP to target + log events", async () => {
    const { user1, user2, reputation, nft } = await loadFixture(deployFixture);

    const tx = await reputation.connect(user1).rate(user2.address);
    const receipt = await tx.wait();

    console.log("\n📋 Logs from rating:");
    for (const log of receipt.logs) {
      console.log(`- ${log.fragment?.name || "Unknown"}:`, log.args);
    }

    const repBalance = await reputation.balanceOf(user2.address);
    expect(repBalance).to.equal(ethers.parseEther("1"));

    const hasAchiev = await nft.hasAchievement(
      user1.address,
      await nft.FIRST_RATE_ACHIEVEMENT()
    );
    expect(hasAchiev).to.equal(true);
  });

  it("should prevent user1 from rating user2 twice", async () => {
    const { user1, user2, reputation } = await loadFixture(deployFixture);

    await reputation.connect(user1).rate(user2.address);

    await expect(reputation.connect(user1).rate(user2.address)).to.be.revertedWith(
      "Already rated this user"
    );
  });

  it("should prevent user1 from registering twice", async () => {
    const { user1, registration } = await loadFixture(deployFixture);

    await registration.connect(user1).register();

    await expect(registration.connect(user1).register()).to.be.revertedWith(
      "Already registered"
    );
  });
});
