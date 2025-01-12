
import './Editor.css';
import Guitar from 'react-guitar'
import React from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom'; 

function Editor() {
  const navigate = useNavigate();
  const [notes, setNotes] = React.useState([])
  const [strings, setStrings] = React.useState([0, 0, 0, 0, 0, 0])
  const [multistringMode, setMultistringMode] = React.useState(false);

  function addNote(newStrings){
    var string = null;
    var fret = null;
    for (let i = 0; i < 6; i++){

      if (newStrings[i] != 0 && strings[i] != -1){
        string = i;

        if (newStrings[i] == -1) newStrings[i] = 0;
        fret = newStrings[i];
      }
    }

    if (string == null || fret == null) return;


    let newNote = {"fret": fret, "string": string, "multistring": multistringMode}
    setNotes((oldNotes) => [...oldNotes, newNote]);

    // Reset fretboard if disabled
    resetFretboard();
  }

  let spacing = 2;
  const [displayedNotes, setDisplayedNotes] = React.useState([]);
  function renderStrings(){
    let display = [];

    // First find if there are hammer on, slides, or pull offs in certain locations
    let specialCharacters = [];
    for (let j = 0; j < notes.length; j++){
      if (["h","p","/"].includes(notes[j].fret)){
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
      for (let j = 0; j < notes.length; j++){
        if (notes[j].multistring && !chordStarted){
          chordStarted = true;
          chordLine = display[0].length;
          fretsSeen = []
        }

        // End of chord
        if (chordStarted && !notes[j].multistring){
          chordStarted = false;

          for (let i = 0; i < 6; i++){

              display[i] += "-".repeat(spacing - (fretsSeen.includes(i) ? 1 : 0));
          }

        }

        for (let i = 0; i < 6; i++){

          if (chordStarted && notes[j].string == i && !fretsSeen.includes(i)){
            fretsSeen.push(i)
            display[i] += (notes[j].string == i ? notes[j].fret.toString() : '') + "";
          }else if(chordStarted){

          }
          else{
            let ignoreExtraSpace = specialCharacters.includes(j)  
            display[i] += (notes[j].string == i ? notes[j].fret.toString() : '-') + "-".repeat(ignoreExtraSpace ? 0 : spacing - 1);
          }
         
        }
      }


    setDisplayedNotes(display);
  }
  React.useEffect(renderStrings, [notes]);



  const [name, setName] = React.useState('');

  // Step 3: Handle the form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    if (name == '') return;
    saveCreation(name);
  };

  const [downloadURL, setDownloadURL] = React.useState('');
  const fetchSongsJson = async () => {
    const songsRef = ref(storage, 'songs.json');
    const url = await getDownloadURL(songsRef);
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  const handleAddSong = async (newSong) => {
    try {
      // Fetch the existing songs.json file
      const songsData = await fetchSongsJson();

      // Add the new song to the existing songs data
      songsData[newSong["Name"]] = newSong;

      // Create a new Blob from the updated songs data
      const blob = new Blob([JSON.stringify(songsData, null, 2)], { type: 'application/json' });
      const file = new File([blob], 'songs.json', { type: 'application/json' });

      // Upload the updated songs.json file
      const storageRef = ref(storage, `songs.json`);
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
            setDownloadURL(url);
            console.log('File available at', url);
            redirectToSongPage(newSong["Name"]); 

          });
        }
      );
    } catch (error) {
      console.error('Error fetching or updating songs.json:', error);
    }
  };

  // Function to handle saving the creation name
  const saveCreation = (name) => {
    handleAddSong({"Name": name, "Song": notes});
  };

  const redirectToSongPage = (songName) => {

    navigate(`/song/${songName}`); // Navigate to the song page
  };

  function addToNotation(symbol){
    if (notes.length == 0 || (["p","/","h"].includes(notes[notes.length - 1].fret))) return;

    let lastFret = notes[notes.length - 1].fret;
    let lastString = notes[notes.length - 1].string;

    setNotes((oldNotes) => [...oldNotes, {"fret": symbol, "string": lastString}])

    // Disable all strings but last for next note
    let nextStrings = [];
    for (let i = 0; i < 6; i++){
      nextStrings.push(lastString == i ? 0 : -1);
    }
    setStrings(nextStrings);
  }

  function resetFretboard(){
    setStrings([0,0,0,0,0,0]);
  }

  return (


    <div className="guitar-editor">
        <div id="top-content">
            <div id="preview-content">
                <h3>Preview</h3>
                <div id="note-display">
                {displayedNotes.map((str, index) => (
                    <div className="tab-string" key={index}>
                    {str}
                    </div>
                ))}
                </div>
            </div>

            <div id="edit-buttons">
                    <form onSubmit={handleSubmit} id="submit-form">
              
                    <input
                        id="title-enter"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name for your creation"
                    />
          
                    <button type="submit" className="button-53" id="save-button">Save</button>
                    </form>
           
            </div>
        </div>

        <div id="bottom-content">
            <div id="functionality-button-holder">
              <div id="hammer-on-button" className="button-56" onClick={() => addToNotation("h")}>Hammer On</div>
              <div id="slide-button" className="button-56" onClick={() => addToNotation("/")}>Slide</div>
              <div id="pull-off-button" className="button-56" onClick={() => addToNotation("p")}>Pull Off</div>
              <div id="pull-off-button" className="button-56" onClick={() => setMultistringMode((multistringMode) => !multistringMode)}>Multi-string mode:  {multistringMode ? <p>ON</p> : <p>OFF</p>}</div>
            </div>
            <Guitar className="guitarController" strings={strings} onChange={addNote} />
        </div>
     


    
    

    </div>
  );
}

export default Editor;
