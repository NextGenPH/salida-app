'use client';

import { useState, useEffect } from 'react';
import { tmdbClient } from '@/lib/api/tmdbClient';
import { MovieCard } from '@/components/MovieCard';
import { Movie } from '@/types/movie';
import Link from 'next/link';
import { useSalidaStore } from '@/store/useSalidaStore';

interface Category {
  title: string;
  endpoint: string;
}

const categories: Category[] = [
  { title: 'Trending Now', endpoint: '/trending/movie/week' },
  { title: 'Popular', endpoint: '/movie/popular' },
  { title: 'Top Rated', endpoint: '/movie/top_rated' },
];

export default function HomePage() {
  const { recentlyViewed, continueWatching } = useSalidaStore();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Trending for Hero
      const { data: trendingData } = await tmdbClient.get<{ results: Movie[] }>('/trending/movie/week');
      setTrending(trendingData.results.slice(0, 5));

      // Fetch Categories
      const cats = await Promise.all(
        categories.map(async (cat) => {
          const { data } = await tmdbClient.get<{ results: Movie[] }>(cat.endpoint);
          return { ...cat, movies: data.results };
        })
      );
      setCategoryData(cats);
    };
    fetchData();
  }, []);

  // Auto-slide hero every 3s
  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % trending.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [trending]);

  const featuredMovie = trending[featuredIndex];

  return (
    <div className="relative min-h-screen">
      {/* Hero Banner */}
      {featuredMovie && (
        <div className="relative h-[60vh] md:h-[80vh] w-full transition-opacity duration-500">
          <img
            src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
            alt={featuredMovie.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/40 to-transparent" />
          <div className="absolute bottom-10 left-5 md:bottom-20 md:left-10 max-w-lg p-2">
            <h1 className="text-4xl md:text-6xl font-bold text-white">{featuredMovie.title}</h1>
            <p className="mt-2 text-sm md:text-lg text-gray-200 line-clamp-3">{featuredMovie.overview}</p>
            <Link href={`/movie/${featuredMovie.id}`} className="mt-4 inline-block bg-[#E50914] text-white px-6 py-2 rounded-full font-bold">
                Watch Now
            </Link>
          </div>
        </div>
      )}

      {/* Categorized Rows */}
      <div className="pb-10">
        {Object.values(continueWatching).length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold px-5 md:px-10 mb-4 text-gray-200">
              Continue Watching
            </h2>
            <div className="flex overflow-x-auto space-x-4 px-5 md:px-10 pb-4 scrollbar-hide">
              {Object.values(continueWatching).map((movie: any) => (
                <div key={movie.id} className="min-w-[150px] md:min-w-[200px]">
                  <MovieCard movie={movie} />
                  <div className="w-full bg-gray-700 h-1 mt-2">
                    <div className="bg-red-600 h-1" style={{ width: `${movie.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {recentlyViewed.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold px-5 md:px-10 mb-4 text-gray-200">
              Recently Viewed
            </h2>
            <div className="flex overflow-x-auto space-x-4 px-5 md:px-10 pb-4 scrollbar-hide">
              {recentlyViewed.map((movie: Movie) => (
                <div key={movie.id} className="min-w-[150px] md:min-w-[200px]">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </section>
        )}
        {categoryData.map((category) => (
          <section key={category.title} className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold px-5 md:px-10 mb-4 text-gray-200">
              {category.title}
            </h2>
            <div className="flex overflow-x-auto space-x-4 px-5 md:px-10 pb-4 scrollbar-hide">
              {category.movies.map((movie: Movie) => (
                <div key={movie.id} className="min-w-[150px] md:min-w-[200px]">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
