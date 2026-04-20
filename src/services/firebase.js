// src/services/firebase.js

export const mockDelay = (ms = 500) => new Promise(res => setTimeout(res, ms));

const getStorage = (key) => JSON.parse(localStorage.getItem(key) || 'null');
const setStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// Auth Mock
export const auth = {};
export const signInWithEmailAndPassword = async (auth, email, password) => {
  await mockDelay();
  // Fixed logic ensuring completely isolated local storage chunks based on the email login
  const uid = email.toLowerCase().replace(/[^a-z0-9]/g, '');
  const user = { uid, email, displayName: email.split('@')[0] };
  setStorage('mock_user', user);
  return { user };
};

export const createUserWithEmailAndPassword = async (auth, email, password) => {
  await mockDelay();
  const uid = email.toLowerCase().replace(/[^a-z0-9]/g, '');
  const user = { uid, email, displayName: email.split('@')[0] };
  setStorage('mock_user', user);
  return { user };
};

export const signOut = async (auth) => {
  await mockDelay();
  localStorage.removeItem('mock_user');
};

export const onAuthStateChanged = (auth, callback) => {
  const user = getStorage('mock_user');
  callback(user);
  return () => {};
};

// Firestore Mock (simplistic)
export const db = {};

export const collection = (db, path) => path;
export const doc = (db, path, id) => ({ path, id });

const generateId = () => Math.random().toString(36).substr(2, 9);

export const addDoc = async (collPath, data) => {
  await mockDelay(300);
  const items = getStorage(collPath) || [];
  const newItem = { id: generateId(), ...data, createdAt: new Date().toISOString() };
  items.push(newItem);
  setStorage(collPath, items);
  return { id: newItem.id };
};

export const updateDoc = async (docRef, data) => {
  await mockDelay(300);
  const items = getStorage(docRef.path) || [];
  const index = items.findIndex(i => i.id === docRef.id);
  if (index > -1) {
    items[index] = { ...items[index], ...data };
    setStorage(docRef.path, items);
  }
};

export const deleteDoc = async (docRef) => {
  await mockDelay(300);
  const items = getStorage(docRef.path) || [];
  const filtered = items.filter(i => i.id !== docRef.id);
  setStorage(docRef.path, filtered);
};

export const getDocs = async (collPathOrQuery) => {
  await mockDelay(300);
  const path = typeof collPathOrQuery === 'string' ? collPathOrQuery : collPathOrQuery.path;
  const items = getStorage(path) || [];
  return {
    docs: items.map(item => ({ id: item.id, data: () => item }))
  };
};

export const getDoc = async (docRef) => {
    await mockDelay(300);
    const items = getStorage(docRef.path) || [];
    const item = items.find(i => i.id === docRef.id);
    if (item) {
        return { exists: () => true, id: item.id, data: () => item }
    }
    return { exists: () => false };
}

export const query = (collPath, ...constraints) => ({ path: collPath, constraints });
export const where = (field, op, value) => ({ type: 'where', field, op, value });
export const orderBy = (field, direction) => ({ type: 'orderBy', field, direction });
