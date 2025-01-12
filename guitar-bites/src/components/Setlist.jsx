
import './Setlist.css';
import Guitar from 'react-guitar'
import React from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 

function Setlist() {
    const navigate = useNavigate();
    const [setlist, setSetlist] = React.useState([]);
    const [songName, setSongName] = React.useState("");
    const [songLink, setSongLink] = React.useState("");
    const [setlistName, setSetlistName] = React.useState("")

    function handleSubmit(){
        if (songName === "") return;

        let songObject = {"title": songName, "link": songLink}

        setSetlist((oldSetlist) => [...oldSetlist, songObject]);
        

        setSongLink("");
        setSongName("")
    }

    function removeSong(song){
        setSetlist((oldSetList) => 
        {
            return oldSetList.filter(item => item.title !== song.title && item.link !== song.link);
        })
    }

    const redirectToSongPage = (setlistName) => {
        navigate(`/setlistViewer/${setlistName}`);
      };

    const submitSetlist = (event) => {
        event.preventDefault();
    
        if (setlistName === '') return;
        saveSetlist(setlist, setlistName);
        setSetlist([]);
      };


        const fetchSetlistJson = async () => {
          const songsRef = ref(storage, 'setlists.json');
          const url = await getDownloadURL(songsRef);
          const response = await fetch(url);
          const data = await response.json();
          return data;
        };
      const saveSetlist = async (newSetlist, setlistName) => {
          try {
            const songsData = await fetchSetlistJson();
            songsData[setlistName] = newSetlist;

            const blob = new Blob([JSON.stringify(songsData, null, 2)], { type: 'application/json' });
            const file = new File([blob], 'setlists.json', { type: 'application/json' });
      
            const storageRef = ref(storage, `setlists.json`);
            const uploadTask = uploadBytesResumable(storageRef, file);
      
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
              },
              (error) => {
                console.error('Upload failed', error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                  console.log('File available at', url);
                  redirectToSongPage(setlistName); 
      
                });
              }
            );
          } catch (error) {
            console.error('Error fetching or updating songs.json:', error);
          }
        };
      

  return (


    <div className="setlist-container">
        <div id="setlist-left-content">
            <div id="setlist-adder">
                

                    <div className="value-entry">
                        <h3>Name:</h3>
                        <input
                            className="song-entry"
                            type="text"
                            value={songName}
                            onChange={(e) => setSongName(e.target.value)}
                            placeholder="Enter song name"
                        />
                    </div>

                    <div className="value-entry">
                        <h3>Link:</h3>
                        <input
                        className="song-entry"
                        type="text"
                        value={songLink}
                        onChange={(e) => setSongLink(e.target.value)}
                        placeholder="Enter the Link"/>
                    </div>
            
                <button type="submit" onClick={() => handleSubmit()} className="button-30" id="save-button">Add Song</button>
        
            </div>
            <div id="setlist-publish">
                <form onSubmit={submitSetlist} id="submit-form">
                        <div className="value-entry">
                        <h3>Setlist Name:</h3>
                        <input
                            id="title-enter"
                            type="text"
                            value={setlistName}
                            onChange={(e) => setSetlistName(e.target.value)}
                            placeholder="Enter name for your setlist"
                        />
                        </div>

                <button type="submit" className="button-30" id="save-button">Save</button>
                </form>
            </div>

        </div>
        <div id="setlist-viewer">
                {setlist.map((song, index) => {
                    return (
                        <div className="singular-song-holder" key={index}>
                            <a className="singular-song-display"  href={song.link}><h2>{song.title}</h2></a>
                            <div className="remove-song-button" onClick={() => removeSong(song)}>X</div>
                        </div>
                    )
                })}
        </div>
 
    </div>
  );
}

export default Setlist;
