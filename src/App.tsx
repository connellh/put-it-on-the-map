import React, { useState } from 'react';
import Map from './components/Map.tsx';
import Navbar from './components/navbar.tsx';
import Slider from './components/Slider.tsx';

function App() {
  const [year, setYear] = useState(2019);

  // Handle the slider change
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
