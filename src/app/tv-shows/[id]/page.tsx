'use client';

import { tmdbClient } from '@/lib/api/tmdbClient';
import { TVShow } from '@/types/tv';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSalidaStore } from '@/store/useSalidaStore';

export default function TVShowDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { watchlist, addToWatchlist, removeFromWatchlist, addRecentlyViewed } = useSalidaStore();

  const handlePlay = () => {
    setShowPlayer(true);
    if (show) {
      addRecentlyViewed({
        id: show.id,
        title: show.name,
        poster_path: show.poster_path,
      });
    }
  };
  const [show, setShow] = useState<TVShow | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedServer, setSelectedServer] = useState<'vidsrc' | 'vidlink'>('vidsrc');
  const [cast, setCast] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      tmdbClient.get<TVShow>(`/tv/${id}`).then((res) => setShow(res.data));
      tmdbClient.get(`/tv/${id}/credits`).then((res) => setCast(res.data.cast.slice(0, 10)));
    }
  }, [id]);

  if (!show) return <div className="p-10 text-white">Loading...</div>;

  const isInWatchlist = watchlist.some((m) => m.id === show.id);

  const toggleWatchlist = () => {
    if (isInWatchlist) {
      removeFromWatchlist(show.id);
    } else {
      addToWatchlist({
        id: show.id,
        title: show.name,
        poster_path: show.poster_path,
      });
    }
  };

  return (
    <div className="p-5 md:p-10">
      <div className="relative h-[40vh] md:h-[60vh] w-full rounded-2xl overflow-hidden mb-8">
        <img
          src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
          alt={show.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-5 left-5 md:bottom-10 md:left-10">
          <h1 className="text-3xl md:text-5xl font-bold">{show.name}</h1>
          <div className="mt-4 space-y-4">
            {/* Primary Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handlePlay}
                className="bg-[#E50914] px-6 py-2 md:px-8 md:py-3 rounded-full font-bold text-white hover:bg-red-700 transition"
              >
                Play
              </button>
              <button
                onClick={toggleWatchlist}
                className={`px-6 py-2 md:px-8 md:py-3 rounded-full font-bold text-white transition ${
                  isInWatchlist ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isInWatchlist ? 'In My List' : '+ My List'}
              </button>
            </div>
            
            {/* Metadata Line */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-300">
              <span className="font-bold text-white">Rating: {show.vote_average.toFixed(1)}</span>
              <span>• {show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 md:gap-10">
        <div className="md:col-span-2">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Overview</h2>
          <p className="text-sm md:text-lg text-gray-300">{show.overview}</p>
        </div>
        <div className="hidden md:block">
          {show.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                className="rounded-lg w-full"
              />
          )}
        </div>
      </div>

      {/* Cast */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Cast</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
          {cast.map((person) => (
            <div key={person.id} className="min-w-[100px] flex flex-col items-center">
              {person.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                  alt={person.name}
                  className="w-20 h-20 rounded-full object-cover mb-2"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold">{person.name[0]}</span>
                </div>
              )}
              <p className="text-xs text-center text-gray-300 truncate w-full">{person.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Player Modal */}
      {showPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 md:p-10">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowPlayer(false)}
              className="absolute -top-10 right-0 text-white font-bold"
            >
              Close
            </button>
            <div className="aspect-video w-full">
              <div className="flex gap-4 text-white mb-4">
                 <label className="flex items-center gap-2"><input type="radio" value="vidsrc" checked={selectedServer === 'vidsrc'} onChange={(e) => setSelectedServer(e.target.value as any)} /> Server 1 (Vidsrc)</label>
                 <label className="flex items-center gap-2"><input type="radio" value="vidlink" checked={selectedServer === 'vidlink'} onChange={(e) => setSelectedServer(e.target.value as any)} /> Server 2 (Vidlink)</label>
              </div>
              <iframe
                src={selectedServer === 'vidsrc' ? `https://vidsrc.to/embed/tv/${id}/1/1` : `https://vidlink.pro/tv/${id}/1/1?primaryColor=E50914&autoplay=true`}
                className="w-full h-full rounded-lg"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
