import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from './components/Editor';
import { fetchSongsData } from './fetchSongsData';
import SongDetail from './SongDetail';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homepage from './components/Homepage';
import Setlist from './components/Setlist';
import SetlistViewer from './components/SetlistViewer';
import { fetchSetlistData } from './fetchSetlistData';

function App() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const getSongs = async () => {
      const data = await fetchSongsData();
      setSongs(data);
    };

    getSongs();
  }, []);

  const [setlists, setSetlists] = useState([]);

  useEffect(() => {
    const getSetlist = async () => {
      const data = await fetchSetlistData();
      setSetlists(data);
    };

    getSetlist();
  }, []);


  return (
    <Router>
      <div >
        <nav className="navBar font-semibold">
        <Link to={"/"} className="navbar-buttons"><h3>Home</h3></Link>
          <Link to={"/Editor"} className="navbar-buttons"><h3>Editor</h3></Link>
          <Link to="/SongList" className="navbar-buttons"><h3>Song List</h3></Link>
          <Link to="/Setlist" className="navbar-buttons"><h3>Setlist Creator</h3></Link>
          <Link to="/Setlists" className="navbar-buttons"><h3>All Setlists</h3></Link>
        
        </nav>
        <Routes>
          <Route path="/song/:songKey" element={<SongDetail />} />
          <Route path="/setlistViewer/:setlistKey" element={<SetlistViewer />} />
          <Route path="/" element={<Homepage />}/>
          <Route path="/Editor" element={<Editor />}/>
          <Route path="/Setlist" element={<Setlist />}/>
          <Route path="/SongList" element = {
              <div id="song-list-container">
              {Object.keys(songs).map((songKey, index) => (
                  <div key={index} className="song-holder">

                  <Link to={`/song/${songKey}`} className="song-link button-30"><div className="displayed-song" key={songKey}>
                    
                    {songs[songKey].Name}
                  </div></Link>
          
                  </div>
                ))}

            </div>
          }/>
        <Route path="/Setlists" element = {
              <div id="song-list-container">
              {Object.keys(setlists).map((setlistKey, index) => (
                  <div key={index} className="song-holder">

                  <Link to={`/setlistViewer/${setlistKey}`} className="song-link button-30"><div className="displayed-song" key={setlistKey}>
                    
                    {setlistKey}
                  </div></Link>
          
                  </div>
                ))}

            </div>
          }/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
