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

  useEffect(() => {
    tmdbClient.get<{ results: TVShow[] }>('/trending/tv/week').then(res => {
        setShows(res.data.results);
        setLoading(false);
    });
  }, []);

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
    </div>
  );
}
