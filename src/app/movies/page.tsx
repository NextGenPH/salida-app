'use client';

import { useState, useEffect } from 'react';
import { tmdbClient } from '@/lib/api/tmdbClient';
import { MovieCard } from '@/components/MovieCard';
import { MovieSkeleton } from '@/components/MovieSkeleton';
import { Movie } from '@/types/movie';
import { FilterBar } from '@/components/FilterBar';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: '', country: '', year: '', sortBy: 'popularity.desc' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const params: any = { 
        page, 
        include_adult: false,
        sort_by: filters.sortBy,
        'vote_count.gte': 50
      };
      if (filters.genre) params.with_genres = filters.genre;
      if (filters.country) params.with_origin_country = filters.country;
      if (filters.year) params.primary_release_year = filters.year;

      const { data } = await tmdbClient.get<{ results: Movie[]; total_pages: number }>('/discover/movie', { params });
      setMovies(data.results);
      setTotalPages(data.total_pages);
      setLoading(false);
    };

    fetchMovies();
  }, [filters, page]);

  return (
    <div className="pt-24 pb-10">
      <div className="px-5 md:px-10 mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Browse Movies</h1>
        <FilterBar onFilterChange={(f) => { setFilters(f); setPage(1); }} />
      </div>
      
      <div className="p-5 md:p-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {loading 
          ? Array.from({ length: 12 }).map((_, i) => <MovieSkeleton key={i} />)
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        }
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button 
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="bg-gray-800 px-6 py-2 rounded disabled:opacity-50 hover:bg-gray-700 transition"
        >
          Previous
        </button>
        <button 
          disabled={page >= totalPages}
          onClick={() => setPage(p => p + 1)}
          className="bg-gray-800 px-6 py-2 rounded disabled:opacity-50 hover:bg-gray-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
