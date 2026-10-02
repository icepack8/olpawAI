// Halaman mock (UI-only) sesuai demo video: Marketplace, Messages,
// Notifications, Ask Doctor, Pharmacy, Clinic.

export function Marketplace() {
  const cats = [
    { name: "Luna", breed: "Maine Coon", age: "6 months", price: "0.85 ETH", usd: "≈ $1,587", icon: "🐈" },
    { name: "Milo", breed: "Ragdoll", age: "8 months", price: "0.72 ETH", usd: "≈ $1,343", icon: "🐱" },
    { name: "Leo", breed: "Bengal", age: "5 months", price: "0.65 ETH", usd: "≈ $1,213", icon: "🐆" },
    { name: "Suki", breed: "Siamese", age: "4 months", price: "0.58 ETH", usd: "≈ $1,081", icon: "😺" },
  ];
  return (
    <div className="page">
      <div className="header"><span className="brand">🐾 OLPaw</span></div>
      <h2 className="page-title">Marketplace 🛍️</h2>
      <div className="input-wrap search"><span>🔍</span><input placeholder="Search cats..." /></div>
      <div className="chip-row">
        {["Verified", "Maine Coon", "Ragdoll", "Bengal"].map((c) => <span key={c} className="chip">{c}</span>)}
      </div>
      <div className="market-grid">
        {cats.map((c) => (
          <div key={c.name} className="card market-card">
            <div className="market-img">{c.icon}<span className="verified-tag">✅ Verified</span></div>
            <div className="market-info">
              <b>{c.name}</b>
              <small className="muted">{c.breed} · {c.age}</small>
              <span className="price">{c.price} <small>{c.usd}</small></span>
            </div>
          </div>
        ))}
      </div>
      <p className="muted small center">💡 Listing on-chain akan segera hadir di versi berikutnya.</p>
    </div>
  );
}

export function Messages() {
  const msgs = [
    { icon: "👩‍⚕️", name: "Dr. Sarah", role: "Doctor", text: "How is Luna's health?", time: "2:45pm", unread: 3 },
    { icon: "👨‍🌾", name: "John Breeder", role: "Breeder", text: "Hi, interested in Luna?", time: "1:30pm", unread: 2 },
    { icon: "💊", name: "PetMed Pharmacy", role: "Pharmacy", text: "Your order is ready", time: "Yesterday", unread: 1 },
    { icon: "🏥", name: "Happy Paws Clinic", role: "Clinic", text: "Appointment confirmed", time: "1 day", unread: 1 },
    { icon: "👩", name: "Emma Buyer", role: "Buyer", text: "Still interested?", time: "3 days", unread: 1 },
  ];
  return (
    <div className="page">
      <div className="header"><span className="brand">🐾 OLPaw</span></div>
      <h2 className="page-title">Messages 💬</h2>
      <div className="chip-row">
        {["All", "Breeder", "Doctor", "Pharmacy", "Clinic", "Buyer"].map((c, i) => (
          <span key={c} className={"chip" + (i === 0 ? " active" : "")}>{c}</span>
        ))}
      </div>
      {msgs.map((m) => (
        <button key={m.name} className="card msg-row" onClick={() => alert(`Chat dengan ${m.name} segera hadir`)}>
          <span className="msg-avatar">{m.icon}</span>
          <span className="msg-text">
            <b>{m.name} <small className="role-tag">{m.role}</small></b>
            <small className="muted">{m.text}</small>
          </span>
          <span className="msg-meta"><small className="muted">{m.time}</small><span className="unread-dot">{m.unread}</span></span>
        </button>
      ))}
    </div>
  );
}

export function Notifications() {
  const notifs = [
    { icon: "🎉", text: "John Breeder is interested in your cat Luna", time: "2 hours ago", isNew: true },
    { icon: "💬", text: "Sarah sent you a message", time: "1 hour ago", isNew: true },
    { icon: "✅", text: "Your cat Luna's DNA was verified on blockchain", time: "5 hours ago", isNew: false },
    { icon: "🔗", text: "New marketplace listing: Maine Coon - 0.75 ETH", time: "1 day ago", isNew: false },
    { icon: "ℹ️", text: "System maintenance notice", time: "2 days ago", isNew: false },
  ];
  return (
    <div className="page">
      <div className="header"><span className="brand">🐾 OLPaw</span></div>
      <h2 className="page-title">Notifications 🔔</h2>
      <div className="chip-row">
        {["All", "Unread", "Marketplace", "Messages", "System"].map((c, i) => (
          <span key={c} className={"chip" + (i === 0 ? " active" : "")}>{c}</span>
        ))}
      </div>
      {notifs.map((n, i) => (
        <div key={i} className="card notif-row">
          <span className="msg-avatar">{n.icon}</span>
          <span className="msg-text">
            {n.isNew && <span className="badge-new">NEW</span>}
            <small>{n.text}</small>
            <small className="muted">{n.time}</small>
          </span>
          <div className="notif-actions">
            <button className="btn btn-small btn-primary" onClick={() => alert("Detail notifikasi")}>View</button>
            <button className="btn btn-small btn-outline" onClick={() => alert("Notifikasi dihapus")}>Dismiss</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Doctors({ setPage }) {
  const docs = [
    { icon: "👩‍⚕️", name: "Dr. Sarah Johnson", spec: "Feline Specialist", rating: "★★★★★ 4.8", resp: "< 2 hours" },
    { icon: "👨‍⚕️", name: "Dr. Michael Chen", spec: "General Veterinarian", rating: "★★★★☆ 4.5", resp: "< 4 hours" },
    { icon: "👩‍⚕️", name: "Dr. Lisa Wong", spec: "Nutrition Specialist", rating: "★★★★★ 4.9", resp: "< 3 hours" },
  ];
  return (
    <div className="page">
      <div className="header"><button className="back-btn" onClick={() => setPage("home")}>←</button><span className="brand">🐾 OLPaw</span></div>
      <h2 className="page-title">Ask Doctor 👨‍⚕️</h2>
      {docs.map((d) => (
        <div key={d.name} className="card doctor-card">
          <span className="doctor-avatar">{d.icon}</span>
          <div className="msg-text">
            <b>{d.name}</b>
            <small className="role-tag">{d.spec}</small>
            <small className="star">{d.rating} · ⏱ {d.resp}</small>
          </div>
          <button className="btn btn-primary btn-block" onClick={() => alert(`Konsultasi dengan ${d.name} segera hadir`)}>
            Start Consultation
          </button>
        </div>
      ))}
    </div>
  );
}

export function Pharmacy({ setPage }) {
  const items = [
    { icon: "💊", name: "Amoxicillin 250mg", tag: "Antibiotic", price: "$12.99" },
    { icon: "🐟", name: "Omega-3 Supplement", tag: "Health Supplement", price: "$24.99" },
    { icon: "💊", name: "Ibuprofen 100mg", tag: "Pain Relief", price: "$8.99" },
  ];
  return (
    <div className="page">
      <div className="header"><button className="back-btn" onClick={() => setPage("home")}>←</button><span className="brand">🐾 OLPaw</span></div>
      <h2 className="page-title">Pharmacy 💊</h2>
      <div className="input-wrap search"><span>🔍</span><input placeholder="Search medications..." /></div>
      <div className="chip-row">
        {["Antibiotics", "Supplements", "Painkillers", "Skin Care"].map((c, i) => (
          <span key={c} className={"chip" + (i === 0 ? " active" : "")}>{c}</span>
        ))}
      </div>
      {items.map((it) => (
        <div key={it.name} className="card product-card">
          <span className="product-icon">{it.icon}</span>
          <div className="msg-text">
            <b>{it.name}</b>
            <small className="role-tag">{it.tag}</small>
            <small className="in-stock">✔ In Stock</small>
          </div>
          <div className="product-side">
            <b className="price">{it.price}</b>
            <button className="btn btn-primary btn-small" onClick={() => alert(`${it.name} ditambahkan ke keranjang 🛒`)}>Add to Cart</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Clinics({ setPage }) {
  const clinics = [
    { icon: "🏥", name: "Happy Paws Clinic", rating: "★★★★★ (4.9)", dist: "2.3 km away", hours: "9 AM - 6 PM", phone: "(555) 123-4567" },
    { icon: "🐾", name: "Whisker Wellness Center", rating: "★★★★☆ (4.6)", dist: "5.1 km away", hours: "8 AM - 8 PM", phone: "(555) 987-6543" },
    { icon: "🐱", name: "Paws & Claws Veterinary", rating: "★★★★★ (4.8)", dist: "7.2 km away", hours: "10 AM - 7 PM", phone: "(555) 246-8135" },
  ];
  return (
    <div className="page">
      <div className="header"><button className="back-btn" onClick={() => setPage("home")}>←</button><span className="brand">🐾 OLPaw</span></div>
      <h2 className="page-title">Clinic 🏥</h2>
      <div className="input-wrap search"><span>🔍</span><input placeholder="Search clinics..." /></div>
      <div className="chip-row"><span className="chip active">📍 Near Me</span><span className="chip">All</span></div>
      {clinics.map((c) => (
        <div key={c.name} className="card doctor-card">
          <span className="doctor-avatar">{c.icon}</span>
          <div className="msg-text">
            <b>{c.name}</b>
            <small className="star">{c.rating}</small>
            <small className="muted">📍 {c.dist} · 🕒 {c.hours}</small>
            <small className="muted">📞 {c.phone}</small>
          </div>
          <div className="btn-row">
            <button className="btn btn-primary" onClick={() => alert(`Booking di ${c.name} segera hadir`)}>📅 Book Appointment</button>
            <button className="btn btn-outline" onClick={() => alert(`Chat dengan ${c.name} segera hadir`)}>💬 Chat</button>
          </div>
        </div>
      ))}
    </div>
  );
}
