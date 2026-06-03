'use client';

import { useState, useEffect } from 'react';
import { tmdbClient } from '@/lib/api/tmdbClient';
import { MovieCard } from '@/components/MovieCard';
import { Movie } from '@/types/movie';
import { FilterBar } from '@/components/FilterBar';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filters, setFilters] = useState({ genre: '', country: '', year: '' });

  useEffect(() => {
    const fetchMovies = async () => {
      const params: any = {};
      if (filters.genre) params.with_genres = filters.genre;
      if (filters.country) params.with_origin_country = filters.country;
      if (filters.year) params.primary_release_year = filters.year;

      const { data } = await tmdbClient.get<{ results: Movie[] }>('/discover/movie', { params });
      setMovies(data.results);
    };

    fetchMovies();
  }, [filters]);

  return (
    <div className="pt-24 pb-10">
      <h1 className="text-4xl font-bold px-5 md:px-10 mb-4">Movies</h1>
      <FilterBar onFilterChange={setFilters} />
      <div className="p-5 md:p-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
