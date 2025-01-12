import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from './firebaseConfig';

export const fetchSetlistData = async () => {
    try {
      const songsRef = ref(storage, 'setlists.json');
      const url = await getDownloadURL(songsRef);
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching setlist data:', error);
      return [];
    }
  };
  