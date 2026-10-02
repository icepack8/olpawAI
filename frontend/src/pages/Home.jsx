import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI, CONTRACT_DEPLOYED } from "../contract";
import { formatDate, shortAddr } from "../lib/utils";
import { getCatPayload } from "../lib/store";

export default function Home({ setPage }) {
  const { address } = useAccount();
  const contractCfg = CONTRACT_DEPLOYED ? { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI } : {};

  const { data: catIds } = useReadContract({
    ...contractCfg,
    functionName: "getCatsByOwner",
    args: [address],
    query: { enabled: CONTRACT_DEPLOYED && !!address },
  });

  const ids = catIds || [];
  const { data: catsRaw } = useReadContracts({
    contracts: ids.map((id) => ({
      ...contractCfg,
      functionName: "getCat",
      args: [id],
    })),
    query: { enabled: CONTRACT_DEPLOYED && ids.length > 0 },
  });

  const myCats = (catsRaw || [])
    .map((r) => r?.result)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="page">
      <div className="header"><span className="brand">🐾 OLPaw</span></div>

      <h2 className="welcome">Welcome, {shortAddr(address)} 👋</h2>
      <p className="muted">You have {ids.length} cat{ids.length === 1 ? "" : "s"} registered.</p>

      <div className="stats-grid">
        <div className="stat"><span>🐱</span><b>{ids.length}</b><small>Cat Registered</small></div>
        <div className="stat"><span>🛍️</span><b>0</b><small>Marketplace Listings</small></div>
        <div className="stat"><span>💬</span><b>2</b><small>New Messages</small></div>
        <div className="stat"><span>🔔</span><b>1</b><small>Appointment</small></div>
      </div>

      <div className="section-head">
        <h3>My Cats</h3>
        <button className="link-btn" onClick={() => setPage("cats")}>+ Add New Cat</button>
      </div>

      {myCats.length === 0 ? (
        <div className="card empty-card">
          <p>Belum ada kucing terdaftar.</p>
          <button className="btn btn-primary" onClick={() => setPage("register")}>
            + Register Your First Cat
          </button>
        </div>
      ) : (
        myCats.map((cat) => {
          const payload = getCatPayload(Number(cat.id));
          return (
            <button key={cat.id.toString()} className="card cat-row" onClick={() => setPage("cats")}>
              <div className="cat-avatar">
                {payload?.photo ? <img src={payload.photo} alt="" /> : "🐱"}
              </div>
              <div className="cat-row-info">
                <b>{cat.name}</b>
                <span className="muted">{cat.gender === "Female" ? "♀" : "♂"} {cat.breed || "Unknown"}</span>
                <small className="muted">Registered on {formatDate(cat.registeredAt)}</small>
              </div>
              <span className="chevron">›</span>
            </button>
          );
        })
      )}

      <div className="section-head">
        <h3>Pawrent Care <span className="badge-new">NEW</span></h3>
      </div>
      <p className="muted small">Pet Health &amp; Wellness</p>
      <div className="care-grid">
        <button className="care-card care-blue" onClick={() => setPage("doctors")}>
          <span className="care-icon">👨‍⚕️</span>
          <b>Ask Doctor</b>
          <small>Consult with veterinarians online →</small>
        </button>
        <button className="care-card care-purple" onClick={() => setPage("pharmacy")}>
          <span className="care-icon">💊</span>
          <b>Pharmacy</b>
          <small>Order pet medicines and supplements →</small>
        </button>
        <button className="care-card care-green" onClick={() => setPage("clinics")}>
          <span className="care-icon">🏥</span>
          <b>Clinic</b>
          <small>Find and book nearby clinics →</small>
        </button>
      </div>
    </div>
  );
}
