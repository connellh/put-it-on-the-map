import React, { useState } from 'react';
import Navbar from "@/components/navbar.tsx";
import Slider from "@/components/Slider.tsx";
import Map from "@/components/Map.tsx";

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
