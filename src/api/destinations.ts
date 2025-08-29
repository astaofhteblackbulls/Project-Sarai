// Destinations API functions
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Destination {
  id: string;
  name: string;
  location: string;
  image: string;
  description: string;
  rating: number;
  duration: string;
  visitors: string;
  highlights: string[];
  vrAvailable: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  isActive: boolean;
}

export interface CreateDestinationData {
  name: string;
  location: string;
  image: string;
  description: string;
  rating: number;
  duration: string;
  visitors: string;
  highlights: string[];
  vrAvailable: boolean;
  createdBy: string;
}

export interface UpdateDestinationData extends Partial<CreateDestinationData> {
  updatedBy: string;
}

// Create new destination
export const createDestination = async (data: CreateDestinationData): Promise<string> => {
  try {
    const destinationData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true
    };
    
    const docRef = await addDoc(collection(db, 'destinations'), destinationData);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create destination');
  }
};

// Update destination
export const updateDestination = async (
  id: string,
  data: UpdateDestinationData
): Promise<void> => {
  try {
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(doc(db, 'destinations', id), updateData);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update destination');
  }
};

// Delete destination
export const deleteDestination = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'destinations', id));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete destination');
  }
};

// Get all destinations
export const getDestinations = async (): Promise<Destination[]> => {
  try {
    const q = query(
      collection(db, 'destinations'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const destinations: Destination[] = [];
    
    querySnapshot.forEach((doc) => {
      destinations.push({
        id: doc.id,
        ...doc.data()
      } as Destination);
    });
    
    return destinations;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch destinations');
  }
};

// Get single destination
export const getDestination = async (id: string): Promise<Destination | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'destinations', id));
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Destination;
    }
    
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch destination');
  }
};

// Real-time listener for destinations
export const subscribeToDestinations = (
  callback: (destinations: Destination[]) => void,
  onError?: (error: Error) => void
) => {
  const q = query(
    collection(db, 'destinations'),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(
    q,
    (querySnapshot) => {
      const destinations: Destination[] = [];
      
      querySnapshot.forEach((doc) => {
        destinations.push({
          id: doc.id,
          ...doc.data()
        } as Destination);
      });
      
      callback(destinations);
    },
    (error) => {
      console.error('Error in destinations subscription:', error);
      if (onError) {
        onError(new Error(error.message || 'Failed to subscribe to destinations'));
      }
    }
  );
};

// Get destinations by location
export const getDestinationsByLocation = async (location: string): Promise<Destination[]> => {
  try {
    const q = query(
      collection(db, 'destinations'),
      where('location', '==', location),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const destinations: Destination[] = [];
    
    querySnapshot.forEach((doc) => {
      destinations.push({
        id: doc.id,
        ...doc.data()
      } as Destination);
    });
    
    return destinations;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch destinations by location');
  }
};

// Search destinations
export const searchDestinations = async (searchTerm: string): Promise<Destination[]> => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation - consider using Algolia or similar for production
    const querySnapshot = await getDocs(
      query(
        collection(db, 'destinations'),
        where('isActive', '==', true),
        orderBy('name')
      )
    );
    
    const destinations: Destination[] = [];
    const searchLower = searchTerm.toLowerCase();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Destination;
      const destination = { id: doc.id, ...data };
      
      // Simple text matching
      if (
        destination.name.toLowerCase().includes(searchLower) ||
        destination.location.toLowerCase().includes(searchLower) ||
        destination.description.toLowerCase().includes(searchLower) ||
        destination.highlights.some(h => h.toLowerCase().includes(searchLower))
      ) {
        destinations.push(destination);
      }
    });
    
    return destinations;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to search destinations');
  }
};

// Toggle destination active status
export const toggleDestinationStatus = async (
  id: string,
  isActive: boolean,
  updatedBy: string
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'destinations', id), {
      isActive,
      updatedAt: serverTimestamp(),
      updatedBy
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to toggle destination status');
  }
};