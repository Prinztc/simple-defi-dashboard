// Import Ethers.js from CDN (already in HTML)
const connectButton = document.getElementById("connectButton");
const dashboard = document.getElementById("dashboard");
const walletAddressEl = document.getElementById("walletAddress");

const ethBalanceEl = document.getElementById("ethBalance");
const daiBalanceEl = document.getElementById("daiBalance");
const usdcBalanceEl = document.getElementById("usdcBalance");

// ERC-20 contract ABI (just balanceOf + decimals for simplicity)
const erc20ABI = [
  "function balanceOf(address) view returns (uint)",
  "function decimals() view returns (uint8)"
];

// Mainnet token contract addresses
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606EB48";

let provider;
let signer;

connectButton.addEventListener("click", async () => {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask is not installed!");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const address = await signer.getAddress();

    walletAddressEl.textContent = address;
    dashboard.classList.remove("hidden");

    await loadBalances(address);
  } catch (err) {
    console.error("Connection error:", err);
    alert("Failed to connect wallet.");
  }
});

async function loadBalances(userAddress) {
  try {
    // ETH Balance
    const ethBalance = await provider.getBalance(userAddress);
    ethBalanceEl.textContent = parseFloat(ethers.utils.formatEther(ethBalance)).toFixed(4);

    // DAI Balance
    const dai = new ethers.Contract(DAI_ADDRESS, erc20ABI, provider);
    const daiRaw = await dai.balanceOf(userAddress);
    const daiDecimals = await dai.decimals();
    daiBalanceEl.textContent = (daiRaw / Math.pow(10, daiDecimals)).toFixed(2);

    // USDC Balance
    const usdc = new ethers.Contract(USDC_ADDRESS, erc20ABI, provider);
    const usdcRaw = await usdc.balanceOf(userAddress);
    const usdcDecimals = await usdc.decimals();
    usdcBalanceEl.textContent = (usdcRaw / Math.pow(10, usdcDecimals)).toFixed(2);

  } catch (err) {
    console.error("Balance fetch error:", err);
  }
}
