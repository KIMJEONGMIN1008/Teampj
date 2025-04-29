import React from 'react';
import Map from './components/map';
import './App.css';

const App = () => {
  return (
    <>
      <header className="app-header">
        <div className="logo">Campus<br />Guide</div>

        <div className="search-bar">
        <input type="text" placeholder="Search" />
          <button className="mic-button">
            <img src="png/mic.png" alt="Mic" />
          </button>
        </div>

        <div className="icons">
        <img src="png/bell.png" alt="Notification" className="icon-img" />
        <img src="png/menubar.png" alt="Menu" className="icon-img" />
        </div>
      </header>
      <Map />
    </>
  );
};

export default App;
