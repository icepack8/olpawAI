export default function Header({ title, onBack }) {
  return (
    <div className="header">
      {onBack && (
        <button className="back-btn" onClick={onBack}>←</button>
      )}
      <span className="brand">🐾 OLPaw</span>
      {title && <span className="header-title">{title}</span>}
    </div>
  );
}
