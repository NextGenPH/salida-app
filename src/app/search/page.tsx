'use client';

import { useState, useEffect } from 'react';
import { tmdbClient } from '@/lib/api/tmdbClient';
import { MovieCard } from '@/components/MovieCard';
import { Movie } from '@/types/movie';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.length <= 2) {
      setResults([]);
      return;
    }
    
    const searchMovies = async () => {
        setLoading(true);
        setError(null);
        try {
          const { data } = await tmdbClient.get<{ results: Movie[] }>('/search/movie', {
            params: { query },
          });
          setResults(data.results);
        } catch (_) {
          setError('Failed to fetch movies');
        } finally {
          setLoading(false);
        }
      };
      
      const delayDebounceFn = setTimeout(() => {
        searchMovies();
      }, 500);

      return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="p-5 md:p-10">
      <h1 className="text-2xl md:text-4xl font-bold mb-6">Search Movies</h1>
      <input
        type="text"
        placeholder="Search for movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 md:p-4 rounded-md bg-[#222] text-white focus:outline-none mb-6"
      />
      {loading && <p className="text-gray-400">Searching...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
