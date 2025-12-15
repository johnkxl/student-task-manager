import { useState, useEffect } from 'react';

export default function TaskModal({ show, onClose, onSave, views, courses, activeViewId, editingTask }) {
  const [formData, setFormData] = useState({
    title: '', type: 'Assignment', courseId: '', dueDate: '', description: ''
  });

  // Populate form when opening or switching to edit mode
  useEffect(() => {
    if (show) {
      if (editingTask) {
        setFormData(editingTask);
      } else {
        setFormData({
          title: '', type: 'Assignment', 
          courseId: '',
          dueDate: new Date().toISOString().split('T')[0], 
          description: ''
        });
      }
    }
  }, [show, editingTask]);

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editingTask ? 'Edit Task' : 'New Task'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Task Title</label>
              <input className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="row mb-3">
              <div className="col-6">
                <label className="form-label">Type</label>
                <select className="form-select" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    {['Assignment','Quiz','Test','Exam','Project','Other'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Course</label>
                <select className="form-select" value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})}>
                  <option value="">Select Course...</option>
                  {views.map(v => {
                    const groupCourses = courses.filter(c => c.viewId === v.id);
                    if(groupCourses.length === 0) return null;
                    return (
                      <optgroup key={v.id} label={v.name}>
                        {groupCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </optgroup>
                    )
                  })}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Due Date</label>
              <input type="date" className="form-control" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={() => onSave(formData)}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}