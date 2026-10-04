export const BSCSCAN = "https://testnet.bscscan.com";

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

export function addBscTestnet() {
  return window.ethereum?.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0x61",
        chainName: "BNB Smart Chain Testnet",
        nativeCurrency: {
          name: "tBNB",
          symbol: "tBNB",
          decimals: 18,
        },
        rpcUrls: ["https://data-seed-prebsc-1-s1.bnbchain.org"],
        blockExplorerUrls: ["https://testnet.bscscan.com"],
      },
    ],
  });
}