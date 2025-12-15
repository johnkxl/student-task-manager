import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useFirestore } from './hooks/useFirestore';

import Auth from './components/Auth';
import TaskModal from './components/TaskModal';
import Sidebar from './components/Sidebar';
import { TaskList } from './components/TaskList';
import StatusTabs from './components/StatusTabs';
import CourseItems from './components/CourseItems';

function App() {
  const [user, setUser] = useState(null);
  
  const { 
    tasks, views, courses, loading, 
    addTask, updateTask, deleteTask, 
    addView, deleteView, 
    addCourse, updateCourse, deleteCourse 
  } = useFirestore(user?.uid);

  // UI State
  const [activeViewId, setActiveViewId] = useState('all');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [hiddenCourses, setHiddenCourses] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (!user) return <Auth />;
  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary"></div>
    </div>
  );

  // Logic Controllers 
  const toggleCourse = (id) => {
    const next = new Set(hiddenCourses);
    if (next.has(id)) next.delete(id); else next.add(id);
    setHiddenCourses(next);
  };

  const filteredTasks = tasks.filter(t => {
    if (statusFilter === 'pending' && t.complete) return false;
    if (statusFilter === 'completed' && !t.complete) return false;
    
    if (activeViewId !== 'all') {
      const course = courses.find(c => c.id === t.courseId);
      if (!course || course.viewId !== activeViewId) return false;
      if (hiddenCourses.has(course.id)) return false;
    }
    return true;
  }).sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));

  const handleSaveTask = async (data) => {
    if (editingTask) await updateTask(editingTask.id, data);
    else await addTask(data);
    setShowModal(false);
  };

  const handleCreateView = async () => {
    const name = prompt("View Name:");
    if(name) await addView(name);
  }

  const handleCreateCourse = async () => {
    const name = prompt("Course Name:");
    let targetView = activeViewId === 'all' ? views[0]?.id : activeViewId;
    if(name && targetView) await addCourse(name, targetView);
  }

  const handleColorChange = async (courseId, newColor) => {
    await updateCourse(courseId, { color: newColor });
  };

  return (
    <div className="container main-container">
      <div className="row h-100">
        
        <Sidebar 
          user={user}
          views={views}
          activeViewId={activeViewId}
          onViewSelect={setActiveViewId}
          onDeleteView={deleteView}
          onCreateView={handleCreateView}
        />

        <div className="col-md-9">
          {/* Header Area */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              {
              activeViewId === 'all' 
              ? 'All Tasks' 
              : views.find(v => v.id === activeViewId)?.name
              }
              </h2>
            <button 
              className="btn btn-primary" 
              onClick={() => { setEditingTask(null); setShowModal(true); }}
            >
              <i className="bi bi-plus-lg"></i> Add Task
            </button>
          </div>

          {activeViewId !== 'all' && (
            <CourseItems
              courses={courses.filter( c => c.viewId === activeViewId)}
              hiddenCourses={hiddenCourses}
              onToggle={toggleCourse}
              onDelete={deleteCourse}
              onAdd={handleCreateCourse}
              handleColorChange={handleColorChange}
            />
          )}

          <StatusTabs
            activeTab={statusFilter}
            onTabChange={setStatusFilter}
          />

          <TaskList 
            tasks={filteredTasks}
            courses={courses}
            onToggleComplete={(id, val) => updateTask(id, { complete: val })}
            onEdit={(task) => { setEditingTask(task); setShowModal(true); }}
            onDelete={deleteTask}
          />
        </div>
      </div>

      <TaskModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onSave={handleSaveTask}
        courses={courses}
        views={views}
        activeViewId={activeViewId}
        editingTask={editingTask}
      />
    </div>
  );
}

export default App;