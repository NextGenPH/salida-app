'use client';

import { useSalidaStore } from '@/store/useSalidaStore';
import { MovieCard } from '@/components/MovieCard';

export default function ProfilePage() {
  const { watchlist, settings, updateSettings } = useSalidaStore();

  return (
    <div className="p-5 md:p-10 pt-24 min-h-screen">
      <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Profile</h1>
      
      <div className="bg-[#181818] p-6 rounded-lg mb-10">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        
        <div className="flex items-center justify-between">
            <label htmlFor="adult-content" className="text-gray-300">Enable Adult Content</label>
            <input 
                id="adult-content"
                type="checkbox" 
                checked={settings.adultContent}
                onChange={(e) => updateSettings({ adultContent: e.target.checked })}
                className="w-6 h-6 accent-red-600 cursor-pointer"
            />
        </div>
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
