import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from './components/Editor';
import { fetchSongsData } from './fetchSongsData';
import SongDetail from './SongDetail';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
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
        <nav className="navBar">
        <Link to={"/GuitarBites/"}><h3>Home</h3></Link>
          <Link to={"GuitarBites/Editor"}><h3>Editor</h3></Link>
          <Link to="/GuitarBites/SongList"><h3>Song List</h3></Link>
        
        </nav>
        <Routes>
          <Route path="/GuitarBites/song/:songKey" element={<SongDetail />} />
          <Route path="/GuitarBites/" element={<Homepage />}/>
          <Route path="/GuitarBites/Editor" element={<Editor />}/>
          <Route path="/GuitarBites/SongList" element = {
              <ul>
              {Object.keys(songs).map((songKey) => (
                <li key={songKey}>
                  
                  <Link to={`/GuitarBites/song/${songKey}`}>{songs[songKey].Name}</Link>
                </li>
              ))}
            </ul>
          }/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
