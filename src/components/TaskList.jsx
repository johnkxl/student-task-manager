import { stringToHex } from "/src/utils/colors";

// Helper for relative date formatting (e.g. "In 3 days")
const getRelativeTime = (dateStr) => {
  if (!dateStr) return { text: "-", days: 0 };
  
  // Create "Today" at midnight for accurate day-diff
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Parse YYYY-MM-DD as local midnight to avoid timezone shifts
  const [year, month, day] = dateStr.split('-').map(Number);
  const due = new Date(year, month - 1, day);
  
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let text = "";
  if (diffDays < 0) text = `${Math.abs(diffDays)} days ago`;
  else if (diffDays === 0) text = "Today";
  else if (diffDays === 1) text = "Tomorrow";
  else text = `In ${diffDays} days`;

  return { text, days: diffDays };
};

export function TaskList({ tasks, courses, onToggleComplete, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle table-hover">
        <thead className="table-light">
          <tr>
            {/* Empty headers for Checkbox and Actions saves space + cleaner */}
            <th style={{width: '40px'}}></th> 
            <th>Course</th>
            <th>Task</th>
            <th>Type</th>
            <th>Due</th>
            <th className="text-end" style={{width: '100px'}}></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(t => {
            const course = courses.find(c => c.id === t.courseId) || { name: 'Unknown' };
            const color = course.color || stringToHex(course.name);
            const { text: relativeDate, days } = getRelativeTime(t.dueDate);
            
            // Logic for row styling: Red if overdue and incomplete
            const isOverdue = days < 0 && !t.complete;
            const rowClass = isOverdue ? 'table-danger' : ''; 
            
            return (
              <tr key={t.id} className={rowClass}>
                <td>
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    style={{cursor: 'pointer'}}
                    checked={t.complete} 
                    onChange={() => onToggleComplete(t.id, !t.complete)} 
                  />
                </td>
                
                <td>
                  <span className="badge group-badge text-truncate" style={{backgroundColor: color, maxWidth: '120px', display: 'inline-block'}}>
                    {course.name}
                  </span>
                </td>
                
                <td className={t.complete ? 'text-decoration-line-through text-muted' : 'fw-medium'}>
                  {t.title}
                </td>
                
                <td>
                  <span className="badge bg-white text-secondary border">{t.type}</span>
                </td>
                
                {/* Relative Date Column */}
                <td>
                  <div className="d-flex flex-column" style={{lineHeight: '1.2'}}>
                    <span className={`small fw-bold ${isOverdue ? 'text-danger' : ''}`}>
                      {relativeDate}
                    </span>
                    <small className="text-muted" style={{fontSize: '0.75rem'}}>
                      {t.dueDate}
                    </small>
                  </div>
                </td>
                
                {/* Right-Aligned Actions */}
                <td className="text-end">
                  <button 
                    className="btn btn-sm btn-link text-primary p-0 me-3" 
                    onClick={() => onEdit(t)}
                    title="Edit Task"
                  >
                    <i className="bi bi-pencil-square fs-5"></i>
                  </button>
                  <button 
                    className="btn btn-sm btn-link text-danger p-0" 
                    onClick={() => onDelete(t.id)}
                    title="Delete Task"
                  >
                    <i className="bi bi-trash fs-5"></i>
                  </button>
                </td>
              </tr>
            )
          })}
          
          {tasks.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-5 text-muted">
                <i className="bi bi-clipboard-check display-4 d-block mb-3 opacity-50"></i>
                No tasks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}