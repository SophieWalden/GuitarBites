
import './Editor.css';
import Guitar from 'react-guitar'
import React from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebaseConfig';

function Editor() {
  const [notes, setNotes] = React.useState([])
  const [strings, setStrings] = React.useState([0, 0, 0, 0, 0, 0])

  function addNote(newStrings){
    var string = null;
    var fret = null;
    for (let i = 0; i < 6; i++){

      if (newStrings[i] != 0){
        string = i;

        if (newStrings[i] == -1) newStrings[i] = 0;
        fret = newStrings[i];
      }
    }

    let newNote = {"fret": fret, "string": string}
    setNotes((oldNotes) => [...oldNotes, newNote]);
  }

  let spacing = 2;
  const [displayedNotes, setDisplayedNotes] = React.useState([]);
  function renderStrings(){
    let display = [];

      for (let i = 0; i < 6; i++){
        let temp = `${['e','B','G','D','A','E'][i]}|` + "-".repeat(spacing)


        for (let j = 0; j < notes.length; j++){
            temp += (notes[j].string == i ? notes[j].fret.toString() : '-') + "-".repeat(spacing - 1);
        }

        display.push(temp);
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
                    {/* Step 2: Create an input field */}
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name for your creation"
                    />
                    {/* Create a button */}
                    <button type="submit" className="button-53" id="save-button">Save</button>
                    </form>
           
            </div>
        </div>

        <div id="bottom-content">
            <Guitar className="guitarController" strings={strings} onChange={addNote} />
        </div>
     


    
    

    </div>
  );
}

export default Editor;
