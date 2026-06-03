import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Movie } from '@/types/movie';

interface SalidaState {
  watchlist: Movie[];
  addToWatchlist: (movie: Partial<Movie> & { id: number; title: string }) => void;
  removeFromWatchlist: (movieId: number) => void;
  recentlyViewed: Movie[];
  addRecentlyViewed: (movie: Partial<Movie> & { id: number; title: string }) => void;
  updateContinueWatching: (movie: Partial<Movie> & { id: number; progress: number }) => void;
  continueWatching: Record<number, Partial<Movie> & { id: number; progress: number }>;
}

export const useSalidaStore = create<SalidaState>()(
  persist(
    (set) => ({
      watchlist: [],
      addToWatchlist: (movie) =>
        set((state) => ({
          watchlist: [
            movie as Movie,
            ...state.watchlist.filter((m) => m.id !== movie.id),
          ],
        })),
      removeFromWatchlist: (movieId) =>
        set((state) => ({
          watchlist: state.watchlist.filter((movie) => movie.id !== movieId),
        })),
      recentlyViewed: [],
      addRecentlyViewed: (movie) =>
        set((state) => ({
          recentlyViewed: [
            movie as Movie,
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
