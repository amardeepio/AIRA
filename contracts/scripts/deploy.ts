import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const PropertyToken = await ethers.getContractFactory("PropertyToken");
  const propertyToken = await upgrades.deployProxy(PropertyToken, [deployer.address]);
  await propertyToken.waitForDeployment();
  console.log("PropertyToken deployed to:", await propertyToken.getAddress());

  const usdcTokenAddress = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // Base Sepolia USDC
  const platformFeeBps = 50; // 0.5%

  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await upgrades.deployProxy(Marketplace, [deployer.address, await propertyToken.getAddress(), usdcTokenAddress, platformFeeBps]);
  await marketplace.waitForDeployment();
  console.log("Marketplace deployed to:", await marketplace.getAddress());

  const YieldDistributor = await ethers.getContractFactory("YieldDistributor");
  const yieldDistributor = await upgrades.deployProxy(YieldDistributor, [deployer.address, await propertyToken.getAddress(), usdcTokenAddress]);
  await yieldDistributor.waitForDeployment();
  console.log("YieldDistributor deployed to:", await yieldDistributor.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
