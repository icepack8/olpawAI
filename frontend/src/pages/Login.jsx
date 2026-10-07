import { useConnect } from "wagmi";

export default function Login() {
  const { connect, connectors, isPending, error } = useConnect();
  const connector = connectors[0];

  return (
    <div className="login-page">
      <div className="hero-cards">
        <div className="hero-card">🧬<span>DNA Profile</span><b>✅</b></div>
        <div className="hero-card">🌳<span>Family Tree</span><b>✅</b></div>
        <div className="hero-card">💜<span>Health Report</span><b>✅</b></div>
      </div>
      <div className="logo-cat">🐱</div>
      <h1 className="logo">OLPaw</h1>
      <p className="tagline">Pet Identity &amp; DNA Verification Platform</p>
      <p className="sub">
        Secure your cat's identity, verify lineage, and unlock a healthier
        future with blockchain.
      </p>

      <div className="roles">
        <div className="role">
          <span className="role-icon">🏅</span>
          <b>Breeder</b>
          <small>Manage lineage &amp; registrations</small>
        </div>
        <div className="role">
          <span className="role-icon">💜</span>
          <b>Cat Lover</b>
          <small>Explore, verify &amp; connect</small>
        </div>
      </div>

      <button
        className="btn btn-primary btn-lg btn-block"
        disabled={isPending}
        onClick={() => connect({ connector })}
      >
        🦊 {isPending ? "Connecting..." : "Connect Wallet (MetaMask)"}
      </button>
      <p className="hint">⛓️ MetaMask / Web3 · Sepolia Testnet</p>
      {error && <p className="error-text">❌ {error.message}</p>}

      <p className="terms">
        🔒 Your data is secure and privacy is our priority.
        <br />
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
