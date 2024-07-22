import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from './firebaseConfig';

export const fetchSongsData = async () => {
  try {
    const songsRef = ref(storage, 'songs.json');
    const url = await getDownloadURL(songsRef);
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching songs data:', error);
    return [];
  }
};
