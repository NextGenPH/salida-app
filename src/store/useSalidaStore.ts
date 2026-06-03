import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Movie } from '@/types/movie';

interface SalidaState {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  recentlyViewed: Movie[];
  addRecentlyViewed: (movie: Movie) => void;
  updateContinueWatching: (movie: Partial<Movie> & { id: number; progress: number }) => void;
  continueWatching: Record<number, Partial<Movie> & { id: number; progress: number }>;
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
      continueWatching: {},
      updateContinueWatching: (movie) =>
        set((state) => ({
          continueWatching: {
            ...state.continueWatching,
            [movie.id]: movie,
          },
        })),
    }),
    {
      name: 'salida-storage',
    }
  )
);
