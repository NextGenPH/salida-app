import { tmdbClient } from '@/lib/api/tmdbClient';
import { TVShow } from '@/types/tv';
import { MovieCard } from '@/components/MovieCard';
import { Movie } from '@/types/movie'; // Reusing MovieCard which needs Movie type

async function getTrendingTV() {
  const { data } = await tmdbClient.get<{ results: TVShow[] }>('/trending/tv/week');
  return data.results;
}

export default async function TVShowsPage() {
  const shows = await getTrendingTV();

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">Trending TV Shows</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {shows.map((show) => (
          // Mapping TVShow to Movie for reuse of MovieCard
          <MovieCard 
            key={show.id} 
            linkPrefix="/tv-shows"
            movie={{ 
                ...show, 
                title: show.name, 
                release_date: show.first_air_date 
            } as Movie} 
          />
        ))}
      </div>
    </div>
  );
}
