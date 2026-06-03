import React from 'react';

interface FilterBarProps {
  onFilterChange: (filters: { genre: string; country: string; year: string }) => void;
}

const genres = [
  { id: '28', name: 'Action' }, { id: '12', name: 'Adventure' }, { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' }, { id: '80', name: 'Crime' }, { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' }, { id: '10751', name: 'Family' }, { id: '14', name: 'Fantasy' },
  { id: '27', name: 'Horror' }, { id: '10749', name: 'Romance' }, { id: '878', name: 'Sci-Fi' },
];

const countries = [
  { code: 'PH', name: 'Philippines' }, { code: 'US', name: 'USA' }, { code: 'KR', name: 'South Korea' },
  { code: 'JP', name: 'Japan' }, { code: 'GB', name: 'United Kingdom' },
];

const years = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i);

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
        {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>
      <select onChange={(e) => setCountry(e.target.value)} className="bg-gray-800 text-white p-2 rounded">
        <option value="">All Countries</option>
        {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
      </select>
      <select onChange={(e) => setYear(e.target.value)} className="bg-gray-800 text-white p-2 rounded">
        <option value="">All Years</option>
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
      <button onClick={handleFilter} className="bg-[#E50914] text-white px-4 py-2 rounded font-bold hover:bg-red-700">
        Apply
      </button>
    </div>
  );
};
