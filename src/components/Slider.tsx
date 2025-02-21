import React from 'react';

interface SliderProps {
  year: number;
  onYearChange: (newYear: number) => void;
}

const Slider: React.FC<SliderProps> = ({ year, onYearChange }) => {
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onYearChange(Number(event.target.value));
  };

  return (
    <div>
      <label htmlFor="year-slider">Select Year: </label>
      <input
        type="range"
        id="year-slider"
        min="2010"
        max="2020"
        step="1"
        value={year}
        onChange={handleSliderChange}
      />
      <span>{year}</span>
    </div>
  );
};

export default Slider;
