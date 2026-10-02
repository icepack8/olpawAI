import { useState } from "react";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI, CONTRACT_DEPLOYED } from "../contract";
import { getCatPayload } from "../lib/store";
import { BSCSCAN, formatDate, shortAddr } from "../lib/utils";

export default function MyCats({ setPage }) {
  const { address } = useAccount();
  const [openId, setOpenId] = useState(null);

  const contractCfg = CONTRACT_DEPLOYED ? { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI } : {};
  const { data: catIds } = useReadContract({
    ...contractCfg,
    functionName: "getCatsByOwner",
    args: [address],
    query: { enabled: CONTRACT_DEPLOYED && !!address },
  });
  const { data: catsRaw } = useReadContracts({
    contracts: (catIds || []).map((id) => ({ ...contractCfg, functionName: "getCat", args: [id] })),
    query: { enabled: CONTRACT_DEPLOYED && (catIds || []).length > 0 },
  });

  const cats = (catsRaw || []).map((r) => r?.result).filter(Boolean);

  return (
    <div className="page">
      <div className="header"><span className="brand">🐾 OLPaw</span></div>
      <h2 className="page-title">My Cats 🐱</h2>

      {!CONTRACT_DEPLOYED && (
        <div className="error-box">⚠️ Contract belum dideploy. Jalankan deploy script dulu (lihat README Langkah 2).</div>
      )}

      {CONTRACT_DEPLOYED && cats.length === 0 && (
        <div className="card empty-card">
          <p>Belum ada kucing. Daftarkan kucing pertamamu! 🐾</p>
        </div>
      )}

      {cats.map((cat) => {
        const id = Number(cat.id);
        const payload = getCatPayload(id);
        const open = openId === id;
        return (
          <div key={id} className="card cat-card">
            <div className="cat-card-top">
              <div className="cat-avatar lg">
                {payload?.photo ? <img src={payload.photo} alt="" /> : "🐱"}
              </div>
              <div className="cat-row-info">
                <b>{cat.name}</b>
                <span className="muted">{cat.breed || "Unknown"}</span>
                <small className="muted">ID: PC-{String(id).padStart(4, "0")}</small>
              </div>
            </div>

            <div className="badge-row">
              {cat.dnaVerified ? (
                <span className="badge verified">✅ DNA Verified</span>
              ) : (
                <span className="badge pending">⏳ Pending Verification</span>
              )}
            </div>

            <div className="btn-row">
              <button className="btn btn-outline" onClick={() => setOpenId(open ? null : id)}>
                👁 {open ? "Hide" : "View Profile"}
              </button>
              <button className="btn btn-outline" onClick={() => alert(
                "Data on-chain bersifat immutable.\nUntuk memperbarui data, daftarkan profil baru (data lama tetap tersimpan sebagai riwayat)."
              )}>
                ✏️ Edit
              </button>
            </div>

            {open && (
              <div className="profile-detail">
                <div className="kv"><span>Gender</span><b>{cat.gender}</b></div>
                <div className="kv"><span>Date of Birth</span><b>{formatDate(cat.dateOfBirth)}</b></div>
                <div className="kv"><span>Purity Score</span><b>{cat.purityScore || "-"}%</b></div>
                <div className="kv"><span>Mother</span><b>{cat.motherId ? "#" + Number(cat.motherId) : "-"}</b></div>
                <div className="kv"><span>Father</span><b>{cat.fatherId ? "#" + Number(cat.fatherId) : "-"}</b></div>
                <div className="kv"><span>Owner</span><b>{shortAddr(cat.owner)}</b></div>
                <div className="kv"><span>Registered</span><b>{formatDate(cat.registeredAt)}</b></div>
                <div className="kv hash"><span>Data Hash</span><code>{cat.dataHash?.slice(0, 18)}...</code></div>
                {cat.dnaHash && cat.dnaHash !== "0x0000000000000000000000000000000000000000000000000000000000000000" && (
                  <div className="kv hash"><span>DNA Hash</span><code>{cat.dnaHash.slice(0, 18)}...</code></div>
                )}
                {payload?.traits && <div className="kv"><span>Traits</span><b>{payload.traits.join(", ")}</b></div>}
                {payload?.health?.vaccinations?.some((v) => v.name) && (
                  <div className="kv"><span>Vaccines</span>
                    <b>{payload.health.vaccinations.filter((v) => v.name).map((v) => v.name).join(", ")}</b>
                  </div>
                )}
                <a className="link-btn" href={`${BSCSCAN}/token/${CONTRACT_ADDRESS}?a=${id}`} target="_blank" rel="noreferrer">
                  Verify on BscScan ↗
                </a>
              </div>
            )}
          </div>
        );
      })}

      <button className="add-cat-card" onClick={() => setPage("register")}>
        <span className="plus">＋</span>
        <b>Add New Cat</b>
        <small>Register your cat to unlock DNA verification and more.</small>
      </button>
    </div>
  );
}
