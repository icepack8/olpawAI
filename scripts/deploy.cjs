// Deploy OLPawRegistry ke BNB Smart Chain TESTNET (Chain ID 97)
// Otomatis menulis alamat + ABI ke frontend/src/contract.js
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying from :", deployer.address);
  const bal = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance        :", hre.ethers.formatEther(bal), "tBNB");

  const OLPaw = await hre.ethers.getContractFactory("OLPawRegistry");
  const contract = await OLPaw.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("OLPawRegistry deployed to:", address);
  console.log("Explorer: https://testnet.bscscan.com/address/" + address);

  // Auto-update frontend config
  const artifact = await hre.artifacts.readArtifact("OLPawRegistry");
  const content =
    "// ============================================================\n" +
    "// AUTO-GENERATED oleh scripts/deploy.cjs - JANGAN EDIT MANUAL\n" +
    "// Deployed on BNB Smart Chain TESTNET (Chain ID 97)\n" +
    "// ============================================================\n" +
    'export const CONTRACT_DEPLOYED = true;\n' +
    'export const CONTRACT_ADDRESS = "' + address + '";\n' +
    "export const CONTRACT_ABI = " + JSON.stringify(artifact.abi, null, 2) + ";\n" +
    "export const BSC_TESTNET_CHAIN_ID = 97;\n";

  const target = path.join(__dirname, "..", "frontend", "src", "contract.js");
  fs.writeFileSync(target, content);
  console.log("frontend/src/contract.js updated ✅");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
