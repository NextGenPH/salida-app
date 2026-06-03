import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

interface SalidaState {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  recentlyViewed: Movie[];
  addRecentlyViewed: (movie: Movie) => void;
}

export const useSalidaStore = create<SalidaState>()(
  persist(
    (set) => ({
      watchlist: [],
      addToWatchlist: (movie) =>
        set((state) => ({
          watchlist: [...state.watchlist, movie],
        })),
      removeFromWatchlist: (movieId) =>
        set((state) => ({
          watchlist: state.watchlist.filter((movie) => movie.id !== movieId),
        })),
      recentlyViewed: [],
      addRecentlyViewed: (movie) =>
        set((state) => ({
          recentlyViewed: [
            movie,
            ...state.recentlyViewed.filter((m) => m.id !== movie.id),
          ].slice(0, 10),
        })),
    }),
    {
      name: 'salida-storage',
    }
  )
);
