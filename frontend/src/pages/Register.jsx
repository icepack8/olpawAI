import { useState } from "react";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useReadContracts,
  useWriteContract,
} from "wagmi";
import { keccak256, stringToHex } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI, CONTRACT_DEPLOYED } from "../contract";
import { saveCatPayload } from "../lib/store";
import { BSCSCAN, addBscTestnet } from "../lib/utils";

const STEPS = [
  "Basic Information",
  "Bio Profile",
  "DNA Profile",
  "Health Report",
  "Owner Data",
  "Family Tree",
];

const BREEDS = [
  "Maine Coon", "Ragdoll", "British Shorthair", "Siamese", "Bengal",
  "Persian", "Sphynx", "Domestic Shorthair", "Other",
];
const TRAITS = ["Playful", "Friendly", "Curious", "Independent", "Calm"];

const initialForm = {
  name: "", dob: "", gender: "Male", photo: null,
  breed: "", coatColor: "", coatLength: "Long Hair", eyeColor: "Green",
  earType: "Pointed", bodySize: "Medium", traits: [], notes: "",
  dnaSkipped: false, purityScore: 85,
  health: {
    vaccinations: [
      { name: "FVRCP", date: "" },
      { name: "Rabies", date: "" },
    ],
    medicalHistory: "",
    checkup: { date: "", vet: "", weight: "", status: "Healthy" },
  },
  owner: {
    name: "", email: "", phone: "", country: "", city: "",
    address: "", type: "Individual Cat Lover",
    regNumber: "", organization: "", regStatus: "",
  },
  family: { motherId: 0, fatherId: 0, generations: "" },
};

export default function Register({ setPage }) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending } = useWriteContract();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [txHash, setTxHash] = useState("");
  const [newCatId, setNewCatId] = useState(0);
  const [error, setError] = useState("");

  const contractCfg = CONTRACT_DEPLOYED ? { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI } : {};
  const { data: catIds } = useReadContract({
    ...contractCfg,
    functionName: "getCatsByOwner",
    args: [address],
    query: { enabled: CONTRACT_DEPLOYED && !!address },
  });
  const { data: parentsRaw } = useReadContracts({
    contracts: (catIds || []).map((id) => ({ ...contractCfg, functionName: "getCat", args: [id] })),
    query: { enabled: CONTRACT_DEPLOYED && (catIds || []).length > 0 },
  });
  const parentOptions = (parentsRaw || [])
    .map((r) => r?.result)
    .filter(Boolean);

  const up = (patch) => setForm((f) => ({ ...f, ...patch }));
  const upHealth = (patch) => setForm((f) => ({ ...f, health: { ...f.health, ...patch } }));
  const upCheckup = (patch) => upHealth({ checkup: { ...form.health.checkup, ...patch } });
  const upOwner = (patch) => setForm((f) => ({ ...f, owner: { ...f.owner, ...patch } }));
  const upFamily = (patch) => setForm((f) => ({ ...f, family: { ...f.family, ...patch } }));

  const toggleTrait = (t) =>
    setForm((f) => ({
      ...f,
      traits: f.traits.includes(t) ? f.traits.filter((x) => x !== t) : [...f.traits, t],
    }));

  const setVacc = (i, patch) =>
    upHealth({
      vaccinations: form.health.vaccinations.map((v, idx) => (idx === i ? { ...v, ...patch } : v)),
    });

const onPhoto = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) return setError("Foto maksimal 5MB");
  setError("");
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const MAX = 512;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        const r = Math.min(MAX / w, MAX / h);
        w = Math.round(w * r);
        h = Math.round(h * r);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      up({ photo: canvas.toDataURL("image/jpeg", 0.72) });
    };
    img.onerror = () => setError("Foto tidak bisa dibaca");
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
};
  function validate() {
    if (step === 0 && !form.name.trim()) return "Cat Name wajib diisi";
    if (step === 0 && !form.dob) return "Date of Birth wajib diisi";
    if (step === 4) {
      const o = form.owner;
      if (!o.name.trim()) return "Owner Name wajib diisi";
      if (!o.email.trim()) return "Email wajib diisi";
      if (!o.phone.trim()) return "Phone Number wajib diisi";
      if (!o.country.trim()) return "Country wajib diisi";
      if (!o.city.trim()) return "City / Province wajib diisi";
      if (!o.address.trim()) return "Address wajib diisi";
    }
    return null;
  }

  async function submit() {
      if (!address) {
  setError("Wallet belum terhubung. Klik Connect Wallet dulu.");
  return;
        }
  try {
    setError("");

    const payload = {
      ...form,
      registeredBy: address,
      registeredAt: new Date().toISOString(),
    };

    if (form.photo) payload.photo = form.photo;

    const dataHash = keccak256(stringToHex(JSON.stringify(payload)));

    const count = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "catCount",
    });

    const dobTs = form.dob
      ? Math.floor(new Date(form.dob).getTime() / 1000)
      : 0;

    // ============================================================
    // REGISTER CAT — hanya 1 transaksi blockchain
    // ============================================================
    const tx = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "registerCat",
      args: [
        form.name,
        form.breed || "Unknown",
        form.gender,
        BigInt(dobTs),
        "",
        dataHash,
        BigInt(Number(form.family.motherId) || 0),
        BigInt(Number(form.family.fatherId) || 0),
      ],
    });

    // Simpan hash transaksi
    setTxHash(tx);

    // Tunggu transaksi selesai
    await publicClient.waitForTransactionReceipt({
      hash: tx,
    });

    // ID cat setelah register
    const id = Number(count) + 1;

    // Simpan data lengkap secara off-chain/local
    saveCatPayload(id, payload);

    // Tampilkan halaman sukses
    setNewCatId(id);

  } catch (e) {
    console.error(e);
    setError(e.shortMessage || e.message || "Transaksi gagal");
  }
  }
   const next = async () => {
  const err = validate();
  if (err) return setError(err);

  setError("");

  if (step < 5) {
    setStep(step + 1);
  } else {
    await submit();
  }
};
  // ---------------- SUCCESS SCREEN ----------------
  if (newCatId > 0) {
    return (
      <div className="page">
        <div className="header"><span className="brand">🐾 OLPaw</span></div>
        <div className="card success-card">
          <div className="success-icon">🎉</div>
          <h2>Cat Registered!</h2>
          <p className="muted">
            <b>{form.name}</b> berhasil didaftarkan on-chain
            {form.dnaSkipped ? "" : " dengan DNA Verified ✅"}.
          </p>
          <p className="muted small">Cat ID: <b>#{newCatId}</b></p>
          {txHash && (
            <a className="link-btn" href={`${BSCSCAN}/tx/${txHash}`} target="_blank" rel="noreferrer">
              Lihat transaksi di BscScan ↗
            </a>
          )}
          <div className="btn-row">
            <button className="btn btn-outline" onClick={() => setPage("home")}>← Home</button>
            <button className="btn btn-primary" onClick={() => setPage("cats")}>View My Cats</button>
          </div>
        </div>
      </div>
    );
  }

  const pct = Math.round(((step + 1) / 6) * 100);

  return (
    <div className="page no-pad">
      <div className="reg-header">
        <button className="back-btn light" onClick={() => (step === 0 ? setPage("home") : setStep(step - 1))}>←</button>
        <span className="brand">🐾 OLPaw</span>
        <h2>Register Your Cat</h2>
        <p>Step {step + 1} of 6: {STEPS[step]}</p>
      </div>

      <div className="reg-body">
        <div className="progress-row">
          <span>{pct}%</span>
          <div className="progress-track"><div className="progress-fill" style={{ width: pct + "%" }} /></div>
          <span>{step + 1}/6</span>
        </div>

        {error && (
          <div className="error-box">
            ❌ {error}
            {(error.includes("chain") || error.includes("network") || error.includes("Chain")) && (
              <button className="btn btn-small" onClick={addBscTestnet}>Add BSC Testnet</button>
            )}
          </div>
        )}

        {/* STEP 1 — BASIC */}
        {step === 0 && (
          <>
            <label className="field-label">Cat Name *</label>
            <div className="input-wrap"><span>🐾</span>
              <input value={form.name} onChange={(e) => up({ name: e.target.value })} placeholder="e.g. Luna" />
            </div>

            <label className="field-label">Date of Birth *</label>
            <div className="input-wrap"><span>📅</span>
              <input type="date" value={form.dob} onChange={(e) => up({ dob: e.target.value })} />
            </div>
            {form.dob && (
              <p className="muted small">📋 Age: {Math.max(0, Math.floor((Date.now() - new Date(form.dob)) / 31557600000))} years</p>
            )}

            <label className="field-label">Gender *</label>
            <div className="pill-row">
              {["Male", "Female"].map((g) => (
                <button key={g} className={"pill" + (form.gender === g ? " active" : "")}
                  onClick={() => up({ gender: g })}>
                  {g === "Male" ? "♂" : "♀"} {g}
                </button>
              ))}
            </div>

            <label className="field-label">Photo</label>
            <div className="photo-row">
              <label className="photo-drop">
                ☁️<span>Drag &amp; drop a photo here<br /><small>or tap to browse · JPG, PNG up to 5MB</small></span>
                <input type="file" accept="image/*" hidden onChange={onPhoto} />
              </label>
              {form.photo && (
                <div className="photo-preview">
                  <img src={form.photo} alt="cat" />
                  <button className="photo-del" onClick={() => up({ photo: null })}>🗑</button>
                </div>
              )}
            </div>
          </>
        )}

        {/* STEP 2 — BIO */}
        {step === 1 && (
          <>
            <label className="field-label">1. Breed</label>
            <select value={form.breed} onChange={(e) => up({ breed: e.target.value })}>
              <option value="">Select breed...</option>
              {BREEDS.map((b) => <option key={b}>{b}</option>)}
            </select>

            <label className="field-label">2. Coat Color</label>
            <input value={form.coatColor} onChange={(e) => up({ coatColor: e.target.value })} placeholder="e.g. Brown Tabby" />

            <label className="field-label">3. Coat Length</label>
            <div className="pill-row">
              {["Long Hair", "Medium Hair", "Short Hair"].map((c) => (
                <button key={c} className={"pill" + (form.coatLength === c ? " active" : "")}
                  onClick={() => up({ coatLength: c })}>{c}</button>
              ))}
            </div>

            <label className="field-label">4. Eye Color</label>
            <select value={form.eyeColor} onChange={(e) => up({ eyeColor: e.target.value })}>
              {["Green", "Blue", "Yellow", "Amber", "Copper"].map((c) => <option key={c}>{c}</option>)}
            </select>

            <label className="field-label">5. Ear Type</label>
            <div className="pill-row">
              {["Pointed", "Rounded", "Folded"].map((c) => (
                <button key={c} className={"pill" + (form.earType === c ? " active" : "")}
                  onClick={() => up({ earType: c })}>{c}</button>
              ))}
            </div>

            <label className="field-label">6. Body Size</label>
            <div className="pill-row">
              {["Small", "Medium", "Large"].map((c) => (
                <button key={c} className={"pill" + (form.bodySize === c ? " active" : "")}
                  onClick={() => up({ bodySize: c })}>{c}</button>
              ))}
            </div>

            <label className="field-label">7. Personality Traits <small>({form.traits.length}/5)</small></label>
            <div className="check-grid">
              {TRAITS.map((t) => (
                <label key={t} className={"check-chip" + (form.traits.includes(t) ? " active" : "")}>
                  <input type="checkbox" checked={form.traits.includes(t)} onChange={() => toggleTrait(t)} />
                  {t}
                </label>
              ))}
            </div>

            <label className="field-label">8. Additional Notes</label>
            <textarea rows="3" maxLength="300" value={form.notes}
              onChange={(e) => up({ notes: e.target.value })}
              placeholder="Any additional information about your cat..." />
          </>
        )}

        {/* STEP 3 — DNA */}
        {step === 2 && (
          <>
            <div className="info-banner">ℹ️ This section is optional. You can skip and add it later.</div>
            <div className="card">
              <h4>🧬 DNA Summary</h4>
              <div className="kv"><span>Cat Name</span><b>{form.name || "-"}</b></div>
              <div className="kv"><span>Breed</span><b>{form.breed || "Unknown"}</b></div>
              <div className="kv"><span>Traits</span><b>{form.traits.length} detected</b></div>
            </div>
            <div className="card">
              <h4>🎯 Purity Score</h4>
              <div className="purity-row">
                <b className="purity-val">{form.purityScore}%</b>
                <input type="range" min="0" max="100" value={form.purityScore}
                  onChange={(e) => up({ purityScore: e.target.value })} />
              </div>
              <div className="purity-track"><div className="purity-fill" style={{ width: form.purityScore + "%" }} /></div>
            </div>
            <p className="muted small">
              💾 DNA profile akan di-hash (keccak256) dan disimpan permanen di BNB Testnet —
              Immutable Record · Permanent Verification · Transparent History.
            </p>
            <div className="btn-row">
              <button className="btn btn-outline" disabled={isPending}
                onClick={() => { up({ dnaSkipped: true }); setStep(3); }}>
                ⏭ Skip
              </button>
              <button className="btn btn-primary" disabled={isPending}
                onClick={() => { up({ dnaSkipped: false }); setStep(3); }}>
                ⛓️ Save to Blockchain
              </button>
            </div>
          </>
        )}

        {/* STEP 4 — HEALTH */}
        {step === 3 && (
          <>
            <div className="card">
              <h4>🛡️ 1. Vaccinations</h4>
              {form.health.vaccinations.map((v, i) => (
                <div key={i} className="vacc-row">
                  <input value={v.name} onChange={(e) => setVacc(i, { name: e.target.value })} placeholder="Vaccine name" />
                  <input type="date" value={v.date} onChange={(e) => setVacc(i, { date: e.target.value })} />
                  <button className="icon-btn" onClick={() => upHealth({ vaccinations: form.health.vaccinations.filter((_, idx) => idx !== i) })}>🗑</button>
                </div>
              ))}
              <button className="btn btn-dashed btn-block" onClick={() => upHealth({ vaccinations: [...form.health.vaccinations, { name: "", date: "" }] })}>
                ＋ Add Vaccination
              </button>
            </div>

            <div className="card">
              <h4>🩺 2. Medical History</h4>
              <textarea rows="2" value={form.health.medicalHistory}
                onChange={(e) => upHealth({ medicalHistory: e.target.value })}
                placeholder="Past illnesses, conditions and treatments" />
            </div>

            <div className="card">
              <h4>💚 3. Last Veterinary Checkup</h4>
              <div className="two-col">
                <input type="date" value={form.health.checkup.date} onChange={(e) => upCheckup({ date: e.target.value })} />
                <input value={form.health.checkup.vet} onChange={(e) => upCheckup({ vet: e.target.value })} placeholder="Veterinarian" />
                <input value={form.health.checkup.weight} onChange={(e) => upCheckup({ weight: e.target.value })} placeholder="Weight (kg)" />
                <select value={form.health.checkup.status} onChange={(e) => upCheckup({ status: e.target.value })}>
                  <option>Healthy</option><option>Needs Attention</option><option>Under Treatment</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* STEP 5 — OWNER */}
        {step === 4 && (
          <>
            {[
              ["name", "Owner Name *", "Enter owner full name", "👤"],
              ["email", "Email Address *", "Enter email address", "✉️"],
              ["phone", "Phone Number *", "Enter phone number", "📞"],
              ["country", "Country *", "Enter country", "🌐"],
              ["city", "City / Province *", "Enter city or province", "🏙"],
            ].map(([key, label, ph, icon]) => (
              <div key={key}>
                <label className="field-label">{label}</label>
                <div className="input-wrap"><span>{icon}</span>
                  <input type={key === "email" ? "email" : "text"} value={form.owner[key]}
                    onChange={(e) => upOwner({ [key]: e.target.value })} placeholder={ph} />
                </div>
              </div>
            ))}
            <label className="field-label">Address *</label>
            <textarea rows="2" value={form.owner.address} onChange={(e) => upOwner({ address: e.target.value })} placeholder="Enter complete address" />

            <label className="field-label">Owner Type *</label>
            <div className="pill-row">
              {["Individual Cat Lover", "Individual Breeder"].map((t) => (
                <button key={t} className={"pill" + (form.owner.type === t ? " active" : "")}
                  onClick={() => upOwner({ type: t })}>
                  {t === "Individual Breeder" ? "🏅" : "😺"} {t}
                </button>
              ))}
            </div>

            {form.owner.type === "Individual Breeder" && (
              <div className="card breeder-box">
                <h4>🏅 Breeder Registration Details</h4>
                <div className="two-col">
                  <input value={form.owner.regNumber} onChange={(e) => upOwner({ regNumber: e.target.value })} placeholder="Registration Number *" />
                  <input value={form.owner.organization} onChange={(e) => upOwner({ organization: e.target.value })} placeholder="Organization / Authority *" />
                  <select value={form.owner.regStatus} onChange={(e) => upOwner({ regStatus: e.target.value })}>
                    <option value="">Select status *</option>
                    <option>Active</option><option>Pending</option><option>Expired</option>
                  </select>
                </div>
              </div>
            )}
          </>
        )}

        {/* STEP 6 — FAMILY TREE */}
        {step === 5 && (
          <>
            <div className="info-banner">ℹ️ This section is optional. You can skip or fill in as much as you know.</div>

            <div className="card">
              <h4>🌸 Mother Information</h4>
              <select value={form.family.motherId} onChange={(e) => upFamily({ motherId: e.target.value })}>
                <option value={0}>Select from your cats (or unknown)...</option>
                {parentOptions.filter((c) => c.gender === "Female").map((c) => (
                  <option key={c.id.toString()} value={Number(c.id)}>#{Number(c.id)} — {c.name} ({c.breed || "Unknown"})</option>
                ))}
              </select>
            </div>

            <div className="card">
              <h4>🌀 Father Information</h4>
              <select value={form.family.fatherId} onChange={(e) => upFamily({ fatherId: e.target.value })}>
                <option value={0}>Select from your cats (or unknown)...</option>
                {parentOptions.filter((c) => c.gender === "Male").map((c) => (
                  <option key={c.id.toString()} value={Number(c.id)}>#{Number(c.id)} — {c.name} ({c.breed || "Unknown"})</option>
                ))}
              </select>
            </div>

            <div className="card">
              <h4>📜 Pedigree Document <small className="muted">(Optional)</small></h4>
              <p className="muted small">Dokumen &amp; jumlah generasi disimpan off-chain di profil kucing.</p>
              <select value={form.family.generations} onChange={(e) => upFamily({ generations: e.target.value })}>
                <option value="">Select generations covered...</option>
                <option>2 generations (Parents)</option>
                <option>3 generations (+ Grandparents)</option>
                <option>4 generations (+ Great-grandparents)</option>
              </select>
            </div>
          </>
        )}

        <div className="btn-row sticky-actions">
          <button className="btn btn-outline" disabled={isPending}
            onClick={() => (step === 0 ? setPage("home") : setStep(step - 1))}>
            ← Back
          </button>
          <button className="btn btn-primary" disabled={isPending} onClick={next}>
            {isPending ? "⏳ Processing..." : step === 5 ? "✓ Submit" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
