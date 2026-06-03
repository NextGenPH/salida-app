'use client';

import { useState, useEffect } from 'react';
import { tmdbClient } from '@/lib/api/tmdbClient';
import { MovieCard } from '@/components/MovieCard';
import { MovieSkeleton } from '@/components/MovieSkeleton';
import { Movie } from '@/types/movie';
import { FilterBar } from '@/components/FilterBar';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filters, setFilters] = useState({ genre: '', country: '', year: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      const params: any = { page };
      if (filters.genre) params.with_genres = filters.genre;
      if (filters.country) params.with_origin_country = filters.country;
      if (filters.year) params.primary_release_year = filters.year;

      const { data } = await tmdbClient.get<{ results: Movie[]; total_pages: number }>('/discover/movie', { params });
      setMovies(data.results);
      setTotalPages(data.total_pages);
    };

    fetchMovies();
  }, [filters, page]);

  return (
    <div className="pt-24 pb-10">
      <h1 className="text-4xl font-bold px-5 md:px-10 mb-4">Movies</h1>
      <FilterBar onFilterChange={setFilters} />
      <div className="p-5 md:p-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {movies.length > 0 
          ? movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          : Array.from({ length: 12 }).map((_, i) => <MovieSkeleton key={i} />)
        }
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button 
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="bg-gray-800 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white">Page {page} of {totalPages}</span>
        <button 
          disabled={page >= totalPages}
          onClick={() => setPage(p => p + 1)}
          className="bg-gray-800 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
