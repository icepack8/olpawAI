export const ETHERSCAN = "https://sepolia.etherscan.io";

export function formatDate(date) {
  if (!date) return "-";
  // Kalau timestamp dari smart contract (detik), ubah ke milidetik
  const d =
    typeof date === "number" && date < 1e12
      ? new Date(date * 1000)
      : typeof date === "bigint"
      ? new Date(Number(date) * 1000)
      : new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function shortAddr(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function addSepolia() {
  return window.ethereum?.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0xaa36a7",
        chainName: "Sepolia Testnet",
        nativeCurrency: {
          name: "SepoliaETH",
          symbol: "SepoliaETH",
          decimals: 18,
        },
        rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
        blockExplorerUrls: ["https://sepolia.etherscan.io"],
      },
    ],
  });
}
