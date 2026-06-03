'use client';

import { useSalidaStore } from '@/store/useSalidaStore';
import { MovieCard } from '@/components/MovieCard';

export default function ProfilePage() {
  const { watchlist } = useSalidaStore();

  return (
    <div className="p-5 md:p-10 pt-24 min-h-screen">
      <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Profile</h1>
      
      <div className="bg-[#181818] p-6 rounded-lg mb-10">
        <h2 className="text-xl font-semibold mb-2">Account Details</h2>
        <p className="text-gray-400">Email: guest@salida.site</p>
        <p className="text-gray-400">Membership: Premium</p>
      </div>

      <h2 className="text-2xl font-bold mb-6">My List</h2>
      {watchlist.length === 0 ? (
        <p className="text-gray-400">Your list is empty.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
