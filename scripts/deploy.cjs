// Deploy OLPawRegistry ke Ethereum Sepolia
// Chain ID 11155111
// Otomatis menulis alamat + ABI ke frontend/src/contract.js

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying from :", deployer.address);

  const bal = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance        :", hre.ethers.formatEther(bal), "Sepolia ETH");

  const OLPaw = await hre.ethers.getContractFactory("OLPawRegistry");
  const contract = await OLPaw.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("OLPawRegistry deployed to:", address);
  console.log(
    "Explorer: https://sepolia.etherscan.io/address/" + address
  );

  // Auto-update frontend config
  const artifact = await hre.artifacts.readArtifact("OLPawRegistry");

  const content =
    "// ============================================================\n" +
    "// AUTO-GENERATED oleh scripts/deploy.cjs - JANGAN EDIT MANUAL\n" +
    "// Deployed on Ethereum Sepolia (Chain ID 11155111)\n" +
    "// ============================================================\n" +
    "export const CONTRACT_DEPLOYED = true;\n" +
    'export const CONTRACT_ADDRESS = "' +
    address +
    '";\n' +
    "export const CONTRACT_ABI = " +
    JSON.stringify(artifact.abi, null, 2) +
    ";\n" +
    "export const SEPOLIA_CHAIN_ID = 11155111;\n";

  const target = path.join(
    __dirname,
    "..",
    "frontend",
    "src",
    "contract.js"
  );

  fs.writeFileSync(target, content);

  console.log("frontend/src/contract.js updated ✅");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});