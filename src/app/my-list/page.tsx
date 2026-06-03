'use client';

import { useSalidaStore } from '@/store/useSalidaStore';
import { MovieCard } from '@/components/MovieCard';

export default function MyListPage() {
  const { watchlist } = useSalidaStore();

  return (
    <div className="p-5 md:p-10 pt-24">
      <h1 className="text-2xl md:text-4xl font-bold mb-6">My List</h1>
      {watchlist.length === 0 ? (
        <p className="text-gray-400">Your list is empty.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={{
              ...movie,
              backdrop_path: null,
              overview: '',
              vote_average: 0,
              release_date: ''
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
