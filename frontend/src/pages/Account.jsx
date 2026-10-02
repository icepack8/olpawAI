import { useAccount, useBalance, useDisconnect } from "wagmi";
import { addBscTestnet, shortAddr } from "../lib/utils";

export default function Account({ setPage }) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  const menu = [
    { icon: "🐱", label: "My Cats", sub: "Manage registrations", action: () => setPage("cats") },
    { icon: "❤️", label: "My Favorites", sub: "Saved cats", action: () => alert("Favorites segera hadir") },
    { icon: "⚙️", label: "Settings", sub: "Notifications, Privacy, Language", action: () => alert("Settings segera hadir") },
    { icon: "🛡️", label: "Security", sub: "Change Password, Two-Factor Auth", action: () => alert("Security segera hadir") },
    { icon: "ℹ️", label: "About & Help", sub: "Help & FAQ, Terms, Privacy Policy", action: () => alert("OLPaw v1.0 · BSC Testnet") },
  ];

  return (
    <div className="page">
      <div className="header"><span className="brand">🐾 OLPaw</span></div>

      <div className="card profile-card">
        <div className="profile-avatar">😺</div>
        <div>
          <b>Cat Lover</b>
          <p className="muted small">{shortAddr(address)}</p>
        </div>
      </div>

      {menu.slice(0, 1).map((m) => (
        <button key={m.label} className="card menu-row" onClick={m.action}>
          <span className="menu-icon">{m.icon}</span>
          <span className="menu-text"><b>{m.label}</b><small className="muted">{m.sub}</small></span>
          <span className="chevron">›</span>
        </button>
      ))}

      <div className="card wallet-card">
        <div className="kv"><span>👛 Connected Wallet</span><code>{shortAddr(address)}</code></div>
        <div className="kv"><span>Balance</span><b>{balance ? balance.formatted.slice(0, 6) : "0"} tBNB</b></div>
        <button className="btn btn-outline btn-block" onClick={addBscTestnet}>⛓️ Add / Switch BSC Testnet</button>
      </div>

      {menu.slice(1).map((m) => (
        <button key={m.label} className="card menu-row" onClick={m.action}>
          <span className="menu-icon">{m.icon}</span>
          <span className="menu-text"><b>{m.label}</b><small className="muted">{m.sub}</small></span>
          <span className="chevron">›</span>
        </button>
      ))}

      <button className="logout-btn" onClick={() => disconnect()}>➡️ Logout</button>
      <p className="terms small">OLPaw v1.0.0 · BNB Smart Chain Testnet (Chain ID 97)</p>
    </div>
  );
}
