import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSongsData } from './fetchSongsData'; // Adjust the import path as needed

const SongDetail = () => {
  const { songKey } = useParams();  // Get the songKey from the URL parameters
  const [song, setSong] = useState(null);

  useEffect(() => {
    const getSongData = async () => {
      try {
        const songs = await fetchSongsData();
        // Access the song directly by its key
        const foundSong = songs[songKey];
        setSong(foundSong);
      } catch (error) {
        console.error('Error fetching song data:', error);
        setSong(null);  // Optional: Handle error by showing a message or similar
      }
    };

    getSongData();
  }, [songKey]);


  let spacing = 2;
  const [displayedNotes, setDisplayedNotes] = React.useState([]);
  function renderStrings(){
    if (song == null)  return;
    let display = [];

      for (let i = 0; i < 6; i++){
        let temp = `${['e','B','G','D','A','E'][i]}|` + "-".repeat(spacing)


        for (let j = 0; j < song.Song.length; j++){
            temp += (song.Song[j].string == i ? song.Song[j].fret.toString() : '-') + "-".repeat(spacing - 1);
        }

        display.push(temp);
      }

    setDisplayedNotes(display);
  }

  React.useEffect(() => {
    renderStrings();
  }, [song])

  if (song === null) {
    return <div>Loading...</div>;
  }

  if (!song) {
    return <div>Song not found</div>;
  }

  

  return (
    <div className="song-display">

      <h3>{song.Name}</h3>
      <div id="note-display-list">
                {displayedNotes.map((str, index) => (
                    <div className="tab-string" key={index}>
                    {str}
                    </div>
                ))}
                </div>
    </div>
  );
};

export default SongDetail;
