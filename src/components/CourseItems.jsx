import { stringToHex } from '/src/utils/colors';

export default function CourseItems({ 
  courses, 
  hiddenCourses, 
  onToggle, 
  onDelete, 
  onAdd, 
  handleColorChange 
}) {
  if (!courses) return null;

  return (
    <div className="mb-4">
      {/* Header Area */}
      <div className="d-flex justify-content-between align-items-center mb-3">
         <span className="text-muted small fw-bold text-uppercase">Courses</span>
         <button className="btn btn-sm btn-outline-primary" onClick={onAdd}>
           <i className="bi bi-plus-lg me-1"></i> Add Course
         </button>
      </div>

      {/* Grid Layout */}
      <div className="row g-3">
        {courses.map(c => {
          const isHidden = hiddenCourses.has(c.id);
          const displayColor = c.color || stringToHex(c.name);

          return (
            // Responsive Columns: 1 col on mobile, 2 on tablet, 3 on desktop
            <div key={c.id} className="col-12 col-md-6 col-lg-4">
              
              <div className={`card h-100 shadow-sm border-0 ${isHidden ? 'bg-light opacity-75' : ''}`}>
                <div className="card-body d-flex align-items-center p-3">
                  
                  {/* Visibility Toggle */}
                  <button
                    onClick={() => onToggle(c.id)}
                    className={`btn me-3 d-flex align-items-center justify-content-center shadow-none ${
                      isHidden ? 'btn-outline-secondary' : 'btn-success'
                    }`}
                    style={{ width: '40px', height: '40px', borderRadius: '4px' }}
                    title={isHidden ? 'Show course' : 'Hide course'}
                  >
                    {isHidden ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                  </button>

                  {/* Color Indicator / Picker */}
                  <div className="me-3 position-relative" style={{ width: '40px', height: '40px' }}>
                    <input
                      type="color"
                      value={displayColor}
                      onChange={(e) => handleColorChange(c.id, e.target.value)}
                      className="form-control form-control-color p-1"
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        borderRadius: '8px', 
                        cursor: 'pointer' 
                      }}
                      title="Change Color"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="flex-grow-1 overflow-hidden">
                    <h6 className={`mb-0 text-truncate fw-bold ${isHidden ? 'text-decoration-line-through text-muted' : ''}`}>
                      {c.name}
                    </h6>
                  </div>

                  {/* Delete Action */}
                  <div className="border-start ps-2 ms-2">
                    <button 
                      className="btn btn-link text-danger p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        if(confirm(`Delete ${c.name}?`)) onDelete(c.id);
                      }}
                      title="Delete Course"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
        
        {/* Empty State Helper */}
        {courses.length === 0 && (
          <div className="col-12 text-center text-muted py-4">
            No courses added yet.
          </div>
        )}
      </div>
    </div>
  );
}