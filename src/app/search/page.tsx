'use client';

import { useState, useEffect } from 'react';
import { tmdbClient } from '@/lib/api/tmdbClient';
import Link from 'next/link';
import Image from 'next/image';
import { Spinner } from '@/components/Spinner';

interface SearchResult {
  id: number;
  title?: string;
  name?: string; // For TV shows
  poster_path: string | null;
  overview: string;
  release_date?: string;
  first_air_date?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'movie' | 'tv'>('movie');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length <= 2) {
      setResults([]);
      return;
    }

    const searchContent = async () => {
      setLoading(true);
      try {
        const { data } = await tmdbClient.get<{ results: SearchResult[] }>(`/search/${type}`, {
          params: { query },
        });
        setResults(data.results);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(searchContent, 500);
    return () => clearTimeout(delay);
  }, [query, type]);

  return (
    <div className="p-5 md:p-10 pt-24 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      
      <div className="flex gap-6 mb-6">
        <label className="flex items-center gap-2"><input type="radio" value="movie" checked={type === 'movie'} onChange={(e) => setType(e.target.value as 'movie')} /> Movies</label>
        <label className="flex items-center gap-2"><input type="radio" value="tv" checked={type === 'tv'} onChange={(e) => setType(e.target.value as 'tv')} /> TV Shows</label>
      </div>

      <input
        type="text"
        placeholder={`Search for ${type}s...`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-4 rounded-md bg-[#222] text-white mb-6"
      />

      {loading && <Spinner />}

      <div className="space-y-4">
        {results.map((item) => (
          <Link key={item.id} href={`/${type === 'movie' ? 'movie' : 'tv-shows'}/${item.id}`} className="flex gap-4 bg-[#181818] p-3 rounded-md hover:bg-[#252525] transition">
            {item.poster_path ? (
              <Image src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title || item.name || ''} width={80} height={120} className="rounded" />
            ) : (
                <div className="w-20 h-28 bg-gray-700 rounded flex items-center justify-center text-xs">No Image</div>
            )}
            <div>
              <h2 className="text-xl font-bold">{item.title || item.name}</h2>
              <p className="text-sm text-gray-400">{(item.release_date || item.first_air_date)?.split('-')[0] || 'N/A'}</p>
              <p className="text-sm line-clamp-2 mt-1">{item.overview}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
