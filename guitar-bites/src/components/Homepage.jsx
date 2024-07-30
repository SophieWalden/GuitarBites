
import './Homepage.css';
import Guitar from 'react-guitar'
import React from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebaseConfig';

function Homepage() {
  

  return (


    <div className="homepage bg-cover bg-center h-screen w-full relative">
      <div className="homepage-content ml-96 flex flex-col w-1/3 gap-10 pt-20 text-center text-lg text-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl absolute ">
         <h1 className="font-bold">Welcome to Guitar Bites!</h1>

        
          <p id="site-description">Guitar Bites is designed as an easy way to create and share small guitar tabs</p>

          {/* <div>
            <h3 className="font-bold">Why was Guitar Bites Created?</h3>
            <p>I was playing guitar and messing around. I found a riff that I thought sounded cool and wanted to record it. Only place I written tabs before was on UltimateGuitar. I get on my computer, look up Ultimate Guitar, and try to find their editor. There are so many steps that before I even find the editor I already forgot what riff I wanted to record. This site is a solution to make quick, stored riffs, which are sharable completely by link</p>
          </div>

          <div>
            <h3 className="font-bold">How easy is it to make a tab?</h3>
            <p>Just click on the editor tab, hit a couple of the strings, type in a name, and hit save. Boom! Your song will be displayed in the song list and you can share that link to have your riff for all of eternity</p>
          </div>
       */}
      </div>
    </div>
  );
}

export default Homepage;
