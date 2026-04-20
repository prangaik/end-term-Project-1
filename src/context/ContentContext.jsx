import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDocs, addDoc, updateDoc as fbUpdateDoc, deleteDoc as fbDeleteDoc } from '../services/firebase';
import { useAuth } from './AuthContext';

const ContentContext = createContext();

export function ContentProvider({ children }) {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [calendarActivities, setCalendarActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
        setIdeas([]);
        setPipeline([]);
        setCalendarActivities([]);
        return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
          const ideasRes = await getDocs(`users_${user.uid}_ideas`);
          const pipelineRes = await getDocs(`users_${user.uid}_pipeline`);
          const calendarRes = await getDocs(`users_${user.uid}_calendar`);
          
          setIdeas(ideasRes.docs.map(d => d.data()));
          setPipeline(pipelineRes.docs.map(d => d.data()));
          setCalendarActivities(calendarRes.docs.map(d => d.data()));
      } catch (err) {
          console.error("Failed to load content", err);
      } finally {
          setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const addIdea = async (ideaData) => {
    const res = await addDoc(`users_${user.uid}_ideas`, ideaData);
    setIdeas(prev => [...prev, { id: res.id, ...ideaData }]);
    return res.id;
  };

  const updateIdea = async (id, data) => {
    await fbUpdateDoc({ path: `users_${user.uid}_ideas`, id }, data);
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
  };

  const deleteIdea = async (id) => {
    await fbDeleteDoc({ path: `users_${user.uid}_ideas`, id });
    setIdeas(prev => prev.filter(i => i.id !== id));
  };

  const addPipelineItem = async (itemData) => {
    const res = await addDoc(`users_${user.uid}_pipeline`, itemData);
    setPipeline(prev => [...prev, { id: res.id, ...itemData }]);
    return res.id;
  };

  const updatePipelineItem = async (id, data) => {
    await fbUpdateDoc({ path: `users_${user.uid}_pipeline`, id }, data);
    setPipeline(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
  };

  const deletePipelineItem = async (id) => {
    await fbDeleteDoc({ path: `users_${user.uid}_pipeline`, id });
    setPipeline(prev => prev.filter(i => i.id !== id));
  };

  const addCalendarActivity = async (activityData) => {
    const res = await addDoc(`users_${user.uid}_calendar`, activityData);
    setCalendarActivities(prev => [...prev, { id: res.id, ...activityData }]);
    return res.id;
  };

  const updateCalendarActivity = async (id, data) => {
    await fbUpdateDoc({ path: `users_${user.uid}_calendar`, id }, data);
    setCalendarActivities(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
  };

  const deleteCalendarActivity = async (id) => {
    await fbDeleteDoc({ path: `users_${user.uid}_calendar`, id });
    setCalendarActivities(prev => prev.filter(i => i.id !== id));
  };

  return (
    <ContentContext.Provider value={{ 
      ideas, addIdea, updateIdea, deleteIdea, 
      pipeline, addPipelineItem, updatePipelineItem, deletePipelineItem, setPipeline,
      calendarActivities, addCalendarActivity, updateCalendarActivity, deleteCalendarActivity,
      loading 
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContent = () => useContext(ContentContext);
