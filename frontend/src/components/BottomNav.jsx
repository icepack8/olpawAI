const items = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "market", icon: "🐾", label: "Market" },
  { id: "messages", icon: "💬", label: "Message" },
  { id: "notifications", icon: "🔔", label: "Notifications" },
  { id: "account", icon: "👤", label: "Account" },
];

export default function BottomNav({ page, setPage }) {
  return (
    <nav className="bottom-nav">
      {items.map((it) => (
        <button
          key={it.id}
          className={"nav-item" + (page === it.id ? " active" : "")}
          onClick={() => setPage(it.id)}
        >
          <span className="nav-icon">{it.icon}</span>
          <span className="nav-label">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}
