import React from 'react';

interface FilterBarProps {
  onFilterChange: (filters: { genre: string; country: string; year: string }) => void;
}

export const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  const [genre, setGenre] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [year, setYear] = React.useState('');

  const handleFilter = () => {
    onFilterChange({ genre, country, year });
  };

  return (
    <div className="flex flex-wrap gap-4 p-5 md:px-10 mb-4 bg-[#141414] border-b border-gray-800">
      <select onChange={(e) => setGenre(e.target.value)} className="bg-gray-800 text-white p-2 rounded">
        <option value="">All Genres</option>
        <option value="16,10751">Kids</option>
        <option value="99">Education (Documentary)</option>
        <option value="28">Action</option>
        <option value="35">Comedy</option>
      </select>
      <select onChange={(e) => setCountry(e.target.value)} className="bg-gray-800 text-white p-2 rounded">
        <option value="">All Countries</option>
        <option value="PH">Philippines</option>
        <option value="US">USA</option>
      </select>
      <input 
        type="number" 
        placeholder="Year" 
        onChange={(e) => setYear(e.target.value)} 
        className="bg-gray-800 text-white p-2 rounded w-20"
      />
      <button onClick={handleFilter} className="bg-[#E50914] text-white px-4 py-2 rounded font-bold hover:bg-red-700">
        Apply
      </button>
    </div>
  );
};
