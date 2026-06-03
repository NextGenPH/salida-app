'use client';

import { useState, useEffect } from 'react';
import { tmdbClient } from '@/lib/api/tmdbClient';
import { MovieCard } from '@/components/MovieCard';
import { MovieSkeleton } from '@/components/MovieSkeleton';
import { TVShow } from '@/types/tv';
import { Movie } from '@/types/movie';

export default function TVShowsPage() {
  const [shows, setShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    tmdbClient.get<{ results: TVShow[]; total_pages: number }>(`/trending/tv/week?page=${page}`).then(res => {
        setShows(res.data.results);
        setTotalPages(res.data.total_pages);
        setLoading(false);
    });
  }, [page]);

  return (
    <div className="pt-24 pb-10">
      <h1 className="text-4xl font-bold px-5 md:px-10 mb-6">Trending TV Shows</h1>
      <div className="p-5 md:p-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <MovieSkeleton key={i} />)
          : shows.map((show) => (
              <MovieCard 
                key={show.id} 
                linkPrefix="/tv-shows"
                movie={{ 
                    ...show, 
                    title: show.name, 
                    release_date: show.first_air_date 
                } as Movie} 
              />
            ))
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
