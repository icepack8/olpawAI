import { useState } from "react";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  CONTRACT_DEPLOYED,
} from "../contract";
import { getCatPayload, saveCatPayload } from "../lib/store";
import { ETHERSCAN, formatDate, shortAddr } from "../lib/utils";

function HealthRiskBadge({ risk }) {
  if (!risk) return null;

  const score = Number(risk.healthRiskScore ?? 0);
  const level = String(risk.riskLevel ?? "unknown").toLowerCase();

  let label = "Unknown";

  if (level === "low") {
    label = "Low Risk";
  } else if (level === "moderate") {
    label = "Moderate Risk";
  } else if (level === "high") {
    label = "High Risk";
  } else if (level === "critical") {
    label = "Critical Risk";
  }

  return (
    <div className="health-risk">
      <div className="health-risk-title">
        <span>Health Risk</span>
        <strong>{score}/100</strong>
      </div>

      <div className="health-risk-label">
        {label}
      </div>
    </div>
  );
}

function HealthRiskCard({ payload }) {
  const risk = payload?.healthRisk || {
    healthRiskScore: 8,
    riskLevel: "low",
    evidenceQuality: "high",
    riskFactors: [
      {
        category: "cardiac",
        description:
          "Genetic finding MYBPC3 p.A31P (heterozygous) is relevant to the cat breed with high evidence.",
        points: 8,
      },
    ],
    recommendations: [
      "Discuss cardiovascular evaluation with a qualified veterinarian.",
      "Monitor resting respiratory rate and document persistent changes.",
    ],
    requiresVeterinaryReview: false,
    demo: true,
  };

  const score = Number(risk.healthRiskScore ?? 0);
  const level = String(risk.riskLevel ?? "unknown").toLowerCase();

  let label = "Unknown";

  if (level === "low") label = "LOW RISK";
  if (level === "moderate") label = "MODERATE RISK";
  if (level === "high") label = "HIGH RISK";
  if (level === "critical") label = "CRITICAL RISK";

  return (
    <div className="health-risk-card">
      <div className="health-risk-title">
        <span>AI Health Risk Score</span>
        <strong>{score}/100</strong>
      </div>

      <div className={`health-risk-badge risk-${level}`}>
        {label}
      </div>

      <div className="kv">
        <span>Evidence Quality</span>
        <b>{risk.evidenceQuality}</b>
      </div>

      {risk.demo && (
        <div className="chainlink-credit">
          Powered by Chainlink CRE
        </div>
      )}

      {risk.riskFactors?.length > 0 && (
        <div className="risk-factors">
          <b>Detected Risk Factor</b>

          {risk.riskFactors.map((factor, index) => (
            <div className="risk-factor" key={index}>
              <span>
                {factor.category} (+{factor.points})
              </span>
              <small>{factor.description}</small>
            </div>
          ))}
        </div>
      )}

      {risk.recommendations?.length > 0 && (
        <div className="recommendations">
          <b>Personalized Care Recommendations</b>

          <ul>
            {risk.recommendations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {risk.requiresVeterinaryReview && (
        <div className="error-box">
          Veterinary review recommended.
        </div>
      )}
    </div>
  );
}

export default function MyCats({ setPage }) {
  const { address } = useAccount();
  const [openId, setOpenId] = useState(null);
  const [, setPhotoVersion] = useState(0);

const handleCatPhoto = (catId, file) => {
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    alert("Foto maksimal 5MB");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const img = new Image();

    img.onload = () => {
      const MAX = 512;

      let w = img.width;
      let h = img.height;

      if (w > MAX || h > MAX) {
        const ratio = Math.min(MAX / w, MAX / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);

      const photo = canvas.toDataURL("image/jpeg", 0.72);

      const oldPayload = getCatPayload(catId) || {};

      saveCatPayload(catId, {
        ...oldPayload,
        photo,
      });

      setPhotoVersion((v) => v + 1);
    };

    img.onerror = () => {
      alert("Foto tidak bisa dibaca.");
    };

    img.src = reader.result;
  };

  reader.readAsDataURL(file);
};

  const contractCfg = CONTRACT_DEPLOYED
    ? {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
      }
    : {};

  const { data: catIds } = useReadContract({
    ...contractCfg,
    functionName: "getCatsByOwner",
    args: [address],
    query: {
      enabled: CONTRACT_DEPLOYED && !!address,
    },
  });

  const { data: catsRaw } = useReadContracts({
    contracts: (catIds || []).map((id) => ({
      ...contractCfg,
      functionName: "getCat",
      args: [id],
    })),
    query: {
      enabled:
        CONTRACT_DEPLOYED &&
        (catIds || []).length > 0,
    },
  });

  const cats = (catsRaw || [])
    .map((result) => result?.result)
    .filter(Boolean);

  return (
    <div className="page">
      <div className="header">
        <span className="brand">OLPaw</span>
      </div>

      <h2 className="page-title">My Cats</h2>

      {!CONTRACT_DEPLOYED && (
        <div className="error-box">
          Contract belum dideploy.
        </div>
      )}

      {CONTRACT_DEPLOYED && cats.length === 0 && (
        <div className="card empty-card">
          <p>
            Belum ada kucing. Daftarkan kucing pertamamu!
          </p>
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
                {payload?.photo ? (
                  <img
                    src={payload.photo}
                    alt=""
                  />
                ) : (
                  "CAT"
                )}
              </div>
              
              <label
                className="btn btn-outline"
                style={{
                  display: "inline-block",
                  marginTop: "8px",
                  cursor: "pointer",
                  fontSize: "12px",
                  padding: "6px 10px",
                }}
               >
                ?? {payload?.photo ? "Change Photo" : "Upload Photo"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={(e) => {
                    handleCatPhoto(id, e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>

              <div className="cat-row-info">
                <b>{cat.name}</b>

                <span className="muted">
                  {cat.breed || "Unknown"}
                </span>

                <small className="muted">
                  ID: PC-
                  {String(id).padStart(4, "0")}
                </small>
              </div>
            </div>

            <div className="badge-row">
              {cat.dnaVerified ? (
                <span className="badge verified">
                  DNA Verified
                </span>
              ) : (
                <span className="badge pending">
                  Pending Verification
                </span>
              )}
            </div>

            <HealthRiskCard payload={payload} />

            <div className="btn-row">
              <button
                className="btn btn-outline"
                onClick={() =>
                  setOpenId(open ? null : id)
                }
              >
                {open ? "Hide" : "View Profile"}
              </button>

              <button
                className="btn btn-outline"
                onClick={() =>
                  alert(
                    "Data on-chain bersifat immutable.\nUntuk memperbarui data, daftarkan profil baru."
                  )
                }
              >
                Edit
              </button>
            </div>

            {open && (
              <div className="profile-detail">
                <div className="kv">
                  <span>Gender</span>
                  <b>{cat.gender}</b>
                </div>

                <div className="kv">
                  <span>Date of Birth</span>
                  <b>{formatDate(cat.dateOfBirth)}</b>
                </div>

                <div className="kv">
                  <span>Purity Score</span>
                  <b>
                    {cat.purityScore || "-"}%
                  </b>
                </div>

                <div className="kv">
                  <span>Mother</span>
                  <b>
                    {cat.motherId
                      ? "#" + Number(cat.motherId)
                      : "-"}
                  </b>
                </div>

                <div className="kv">
                  <span>Father</span>
                  <b>
                    {cat.fatherId
                      ? "#" + Number(cat.fatherId)
                      : "-"}
                  </b>
                </div>

                <div className="kv">
                  <span>Owner</span>
                  <b>{shortAddr(cat.owner)}</b>
                </div>

                <div className="kv">
                  <span>Registered</span>
                  <b>
                    {formatDate(cat.registeredAt)}
                  </b>
                </div>

                <div className="kv hash">
                  <span>Data Hash</span>
                  <code>
                    {cat.dataHash?.slice(0, 18)}...
                  </code>
                </div>

                {cat.dnaHash &&
                  cat.dnaHash !==
                    "0x0000000000000000000000000000000000000000000000000000000000000000" && (
                    <div className="kv hash">
                      <span>DNA Hash</span>
                      <code>
                        {cat.dnaHash.slice(0, 18)}...
                      </code>
                    </div>
                  )}

                {payload?.traits && (
                  <div className="kv">
                    <span>Traits</span>
                    <b>
                      {payload.traits.join(", ")}
                    </b>
                  </div>
                )}

                {payload?.health?.vaccinations?.some(
                  (v) => v.name
                ) && (
                  <div className="kv">
                    <span>Vaccines</span>
                    <b>
                      {payload.health.vaccinations
                        .filter((v) => v.name)
                        .map((v) => v.name)
                        .join(", ")}
                    </b>
                  </div>
                )}

                <a
                  className="link-btn"
                  href={
                    ETHERSCAN +
                    "/token/" +
                    CONTRACT_ADDRESS +
                    "?a=" +
                    id
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Verify on ETHERSCAN
                </a>
              </div>
            )}
          </div>
        );
      })}

      <button
        className="add-cat-card"
        onClick={() => setPage("register")}
      >
        <span className="plus">+</span>

        <b>Add New Cat</b>

        <small>
          Register your cat to unlock DNA verification
          and health analysis.
        </small>
      </button>
    </div>
  );
}
