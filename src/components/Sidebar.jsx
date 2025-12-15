import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Sidebar({ user, views, activeViewId, onViewSelect, onDeleteView, onCreateView }) {
  return (
    <div className="col-md-3 filter-sidebar">
      <div className="d-flex justify-content-between align-items-center mb-3">
         <h6 className="text-uppercase text-muted small fw-bold mb-0">Views</h6>
         <button className="btn btn-sm btn-outline-primary" onClick={onCreateView}>
           <i className="bi bi-plus-lg"></i>
         </button>
      </div>

      <div className="nav flex-column nav-pills">
        <div 
          className={`nav-link ${activeViewId === 'all' && 'active'}`} 
          onClick={() => onViewSelect('all')}
        >
          <i className="bi bi-grid-fill me-2"></i> All Tasks
        </div>
        
        {views.map(v => (
          <div 
            key={v.id} 
            className={`nav-link d-flex justify-content-between ${activeViewId === v.id && 'active'}`} 
            onClick={() => onViewSelect(v.id)}
          >
            <span><i className="bi bi-folder me-2"></i> {v.name}</span>
            <button 
              className="btn btn-sm btn-link text-danger p-0" 
              onClick={(e) => {
                e.stopPropagation(); 
                if(confirm('Delete view?')) onDeleteView(v.id)
              }}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-top">
        <small>{user?.email}</small> <br/>
        <button className="btn btn-sm btn-outline-secondary mt-2" onClick={() => signOut(auth)}>
          Sign Out
        </button>
      </div>
    </div>
  );
}