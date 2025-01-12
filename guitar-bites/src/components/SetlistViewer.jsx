
import './SetlistViewer.css';
import Guitar from 'react-guitar'
import React from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { fetchSetlistData } from '../fetchSetlistData';




function SetlistViewer() {
    const { setlistKey } = useParams();  
    const [setlist, setSetlist] = React.useState(null);
    const [setlistName, setSetlistName] = React.useState("");
  
    React.useEffect(() => {
      const getSetlistData = async () => {
        try {
          const setlists = await fetchSetlistData();
          const foundSetlist = setlists[setlistKey];
          setSetlist(foundSetlist);
        } catch (error) {
          console.error('Error fetching song data:', error);
          setSetlist(null);  // Optional: Handle error by showing a message or similar
        }
      };
  
      getSetlistData();
    }, [setlistKey]);
  

     
  
  
    if (setlist === null) {
      return  <div className="setlist-viewer-container"><div>Loading...</div></div>;
    }
  
    if (!setlist) {
      return  <div className="setlist-viewer-container"><div>Song not found</div></div>;
    }
  
    
  
    return (
      <div className="setlist-viewer-container">
        <div id="setlist-display-viewer">

            <h3 className="setlist-display-title">{setlistKey}</h3>
            <h4 className="setlist-display-length">Length: {setlist.length} songs</h4>

            <div id="setlist-display-songs">
                {setlist.map((song, index) => {
                    return (
                        <div className="setlist-display-song" key={index}>
                            <a href={song.link}>{song.title}</a>
                        </div>
                    )
                })}
            </div>
        </div>
      </div>
    );
}

export default SetlistViewer;
