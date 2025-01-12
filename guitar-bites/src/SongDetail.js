import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSongsData } from './fetchSongsData'; 
import { Helmet } from 'react-helmet-async';

const SongDetail = () => {
  const { songKey } = useParams(); 
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

    // First find if there are hammer on, slides, or pull offs in certain locations
    let specialCharacters = [];
    for (let j = 0; j < song.Song.length; j++){
      if (["h","p","/"].includes(song.Song[j].fret)){
        specialCharacters.push(j - 1);
        specialCharacters.push(j);
      }
    }
  
    // Initalize each string
    for (let i = 0; i < 6; i++){
      display.push(`${['e','B','G','D','A','E'][i]}|` + "-".repeat(spacing));
    }

    let chordLine = 0;
    let chordStarted = false;
    let fretsSeen = []
      for (let j = 0; j < song.Song.length; j++){
        if (song.Song[j].multistring && !chordStarted){
          chordStarted = true;
          chordLine = display[0].length;
          fretsSeen = []
        }

        // End of chord
        if (chordStarted && !song.Song[j].multistring){
          chordStarted = false;

          for (let i = 0; i < 6; i++){

              display[i] += "-".repeat(spacing - (fretsSeen.includes(i) ? 1 : 0));
          }

        }

        for (let i = 0; i < 6; i++){

          if (chordStarted && song.Song[j].string == i && !fretsSeen.includes(i)){
            fretsSeen.push(i)
            display[i] += (song.Song[j].string == i ? song.Song[j].fret.toString() : '') + "";
          }else if(chordStarted){

          }
          else{
            let ignoreExtraSpace = specialCharacters.includes(j)  
            display[i] += (song.Song[j].string == i ? song.Song[j].fret.toString() : '-') + "-".repeat(ignoreExtraSpace ? 0 : spacing - 1);
          }
         
        }
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

      <Helmet>
                  <title>Guitar Bites Setlist Viewer</title>
                  <meta property="og:title" content="Song Viewer" />
                  <meta property="og:description" content="A Song has been shared with you" />
              </Helmet>

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
