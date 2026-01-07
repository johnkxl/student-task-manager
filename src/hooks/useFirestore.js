import { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, writeBatch, where, getDocs } from 'firebase/firestore';
import { db, currentAppId } from '../firebase';

export function useFirestore(userId) {
  const [data, setData] = useState({ tasks: [], views: [], courses: [] });
  const [loading, setLoading] = useState(true);

  // Helper to get collection reference
  const getCol = (colName) => collection(db, 'artifacts', currentAppId, 'users', userId, colName);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Subscribe to Tasks, Views, and Courses in real-time
    const unsubTasks = onSnapshot(getCol('tasks'), (snap) => {
      setData(prev => ({ ...prev, tasks: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
    });
    const unsubViews = onSnapshot(getCol('views'), (snap) => {
      setData(prev => ({ ...prev, views: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
    });
    const unsubCourses = onSnapshot(getCol('courses'), (snap) => {
      setData(prev => ({ ...prev, courses: snap.docs.map(d => ({ id: d.id, ...d.data() })) }));
      setLoading(false);
    });

    return () => { unsubTasks(); unsubViews(); unsubCourses(); };
  }, [userId]);

  // Actions
  const addTask = (task) => addDoc(getCol('tasks'), { ...task, complete: false });
  const updateTask = (id, updates) => updateDoc(doc(getCol('tasks'), id), updates);
  const deleteTask = (id) => deleteDoc(doc(getCol('tasks'), id));
  
  const addView = (name) => addDoc(getCol('views'), { name });
  const deleteView = (id) => deleteDoc(doc(getCol('views'), id));
  
  const addCourse = (name, viewId) => addDoc(getCol('courses'), { name, viewId });
  const updateCourse = (id, updates) => updateDoc(doc(getCol('courses'), id), updates);

  // Delete all associated tasks when deleting a course
  const handleDeleteCourse = async (courseId) => {
    const batch = writeBatch(db);

    const taskRef = getCol('tasks');
    const q = query(taskRef, where("courseId", "==", courseId));
    const taskSnapshot = await getDocs(q);

    // Queue up the tasks for deletion in the batch
    taskSnapshot.forEach((taskDoc) => {
      batch.delete(taskDoc.ref);
    });

    const courseRef = doc(getCol('courses'), courseId);
    batch.delete(courseRef);

    await batch.commit();
  }

  return { ...data, loading, addTask, updateTask, deleteTask, addView, deleteView, addCourse, updateCourse, handleDeleteCourse };
}