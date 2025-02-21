import React from 'react';
import Map from './components/map.tsx';
import Navbar from './components/navbar.tsx';
import './App.css';

function App() {
    return(
        <div className="App">
            <Navbar/>
            <h1>App Updated: {new Date().toLocaleTimeString()}</h1>
            <Map/>
        </div>
    )
}

export default App;
