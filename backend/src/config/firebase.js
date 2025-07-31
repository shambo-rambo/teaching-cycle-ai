import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

let app;
let db;

// For development, use a simple in-memory mock database
const createMockDB = () => {
  const mockData = new Map();
  const mockCollections = new Map();

  return {
    collection: (name) => ({
      add: async (data) => {
        const id = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        if (!mockCollections.has(name)) {
          mockCollections.set(name, new Map());
        }
        mockCollections.get(name).set(id, { ...data, id });
        console.log(`Mock DB: Added to ${name}:`, { id, ...data });
        return { id };
      },
      where: (field, op, value) => ({
        get: async () => {
          const collection = mockCollections.get(name) || new Map();
          const docs = Array.from(collection.values()).filter(doc => {
            if (op === '==') return doc[field] === value;
            return false;
          });
          return {
            empty: docs.length === 0,
            docs: docs.map(doc => ({
              id: doc.id,
              data: () => doc,
              ref: {
                update: async (updates) => {
                  Object.assign(doc, updates);
                  console.log(`Mock DB: Updated ${name}/${doc.id}:`, updates);
                }
              }
            }))
          };
        },
        orderBy: (field, direction = 'asc') => ({
          limit: (limitNum) => ({
            get: async () => {
              const collection = mockCollections.get(name) || new Map();
              let docs = Array.from(collection.values()).filter(doc => {
                if (op === '==') return doc[field] === value;
                return false;
              });
              
              // Sort by field
              docs.sort((a, b) => {
                let aVal = a[field];
                let bVal = b[field];
                
                // Handle Date objects
                if (aVal instanceof Date) aVal = aVal.getTime();
                if (bVal instanceof Date) bVal = bVal.getTime();
                
                if (direction === 'desc') {
                  return bVal > aVal ? 1 : -1;
                }
                return aVal > bVal ? 1 : -1;
              });
              
              // Apply limit
              docs = docs.slice(0, limitNum);
              
              return {
                empty: docs.length === 0,
                docs: docs.map(doc => ({
                  id: doc.id,
                  data: () => doc
                }))
              };
            }
          }),
          get: async () => {
            const collection = mockCollections.get(name) || new Map();
            let docs = Array.from(collection.values()).filter(doc => {
              if (op === '==') return doc[field] === value;
              return false;
            });
            
            // Sort by field
            docs.sort((a, b) => {
              let aVal = a[field];
              let bVal = b[field];
              
              // Handle Date objects
              if (aVal instanceof Date) aVal = aVal.getTime();
              if (bVal instanceof Date) bVal = bVal.getTime();
              
              if (direction === 'desc') {
                return bVal > aVal ? 1 : -1;
              }
              return aVal > bVal ? 1 : -1;
            });
            
            return {
              empty: docs.length === 0,
              docs: docs.map(doc => ({
                id: doc.id,
                data: () => doc
              }))
            };
          }
        })
      }),
      orderBy: () => ({
        limit: () => ({
          get: async () => {
            const collection = mockCollections.get(name) || new Map();
            const docs = Array.from(collection.values()).slice(0, 50);
            return {
              docs: docs.map(doc => ({
                id: doc.id,
                data: () => doc
              }))
            };
          }
        }),
        get: async () => {
          const collection = mockCollections.get(name) || new Map();
          const docs = Array.from(collection.values());
          return {
            docs: docs.map(doc => ({
              id: doc.id,
              data: () => doc
            }))
          };
        }
      }),
      doc: (id) => ({
        get: async () => {
          const collection = mockCollections.get(name) || new Map();
          const doc = collection.get(id);
          return {
            exists: !!doc,
            id,
            data: () => doc,
            ref: {
              collection: (subName) => ({
                add: async (data) => {
                  const subId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                  const subCollection = `${name}/${id}/${subName}`;
                  if (!mockCollections.has(subCollection)) {
                    mockCollections.set(subCollection, new Map());
                  }
                  mockCollections.get(subCollection).set(subId, { ...data, id: subId });
                  console.log(`Mock DB: Added to ${subCollection}:`, { id: subId, ...data });
                  return { id: subId };
                },
                orderBy: () => ({
                  get: async () => {
                    const subCollection = `${name}/${id}/${subName}`;
                    const collection = mockCollections.get(subCollection) || new Map();
                    const docs = Array.from(collection.values());
                    return {
                      docs: docs.map(doc => ({
                        id: doc.id,
                        data: () => doc
                      }))
                    };
                  }
                })
              })
            }
          };
        },
        set: async (data) => {
          if (!mockCollections.has(name)) {
            mockCollections.set(name, new Map());
          }
          mockCollections.get(name).set(id, { ...data, id });
          console.log(`Mock DB: Set ${name}/${id}:`, data);
        },
        update: async (updates) => {
          const collection = mockCollections.get(name) || new Map();
          const existing = collection.get(id) || {};
          const updated = { ...existing, ...updates };
          collection.set(id, updated);
          console.log(`Mock DB: Updated ${name}/${id}:`, updates);
        }
      })
    }),
    FieldValue: {
      increment: (value) => ({ _increment: value })
    }
  };
};

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Use real Firebase with service account
    console.log('Initializing real Firebase with service account...');
    app = initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
    });
    db = getFirestore(app);
    console.log('✅ Real Firebase/Firestore initialized successfully');
    console.log('⚠️  If you see permission errors, check IAM roles or generate new service account key');
  } else {
    // Development: Use mock database
    console.log('⚠️  No service account found, using mock database for development');
    db = createMockDB();
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  console.log('🔄 Falling back to mock database');
  db = createMockDB();
}

export { db };
export default app;