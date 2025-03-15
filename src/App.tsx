import React, { useState } from 'react';
import Map from './components/Map.tsx';
import Navbar from './components/Navbar.tsx';
import Slider from './components/Slider.tsx';

function App() {
  const [year, setYear] = useState(2024);

  const handleSliderChange = (newYear: number) => {
    setYear(newYear);
  };

  return (
    <div className="App">
      <Navbar />
      <Slider year={year} onYearChange={handleSliderChange} />
      <Map selectedYear={year} />
    </div>
  );
}

export default App;
