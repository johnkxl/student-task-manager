export default function StatusTabs({ activeTab, onTabChange }) {
  const tabs = ['pending', 'completed', 'all'];
  
  return (
    <ul className="nav nav-tabs mb-3">
      {tabs.map(s => (
        <li key={s} className="nav-item">
          <a 
            className={`nav-link ${activeTab === s ? 'active' : ''}`} 
            href="#" 
            onClick={(e) => { e.preventDefault(); onTabChange(s); }}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </a>
        </li>
      ))}
    </ul>
  );
}