import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from './components/Editor';
import { fetchSongsData } from './fetchSongsData';
import SongDetail from './SongDetail';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homepage from './components/Homepage';

function App() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const getSongs = async () => {
      const data = await fetchSongsData();
      setSongs(data);
    };

    getSongs();
  }, []);


  return (
    <Router>
      <div>
        <nav className="navBar font-semibold">
        <Link to={"/"}><h3>Home</h3></Link>
          <Link to={"/Editor"}><h3>Editor</h3></Link>
          <Link to="/SongList"><h3>Song List</h3></Link>
        
        </nav>
        <Routes>
          <Route path="/song/:songKey" element={<SongDetail />} />
          <Route path="/" element={<Homepage />}/>
          <Route path="/Editor" element={<Editor />}/>
          <Route path="/SongList" element = {
              <div id="song-list-container">
              {Object.keys(songs).map((songKey) => (
                  <div className="song-holder">

                  <Link to={`/song/${songKey}`} className="song-link"><div className="displayed-song" key={songKey}>
                    
                    {songs[songKey].Name}
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
