import { tmdbClient } from '@/lib/api/tmdbClient';
import { MovieCard } from '@/components/MovieCard';
import { Movie } from '@/types/movie';

interface Category {
  title: string;
  endpoint: string;
}

const categories: Category[] = [
  { title: 'Trending Now', endpoint: '/trending/movie/week' },
  { title: 'Popular', endpoint: '/movie/popular' },
  { title: 'Top Rated', endpoint: '/movie/top_rated' },
];

async function getMovies(endpoint: string): Promise<Movie[]> {
  const { data } = await tmdbClient.get<{ results: Movie[] }>(endpoint);
  return data.results;
}

export default async function HomePage() {
  const trendingMovies = await getMovies('/trending/movie/week');
  const featuredMovie = trendingMovies[0];

  const categoryData = await Promise.all(
    categories.map(async (cat) => ({
      ...cat,
      movies: await getMovies(cat.endpoint),
    }))
  );

  if (!featuredMovie) return null;

  return (
    <div className="relative min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[60vh] md:h-[80vh] w-full">
        <img
          src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
          alt={featuredMovie.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/40 to-transparent" />
        <div className="absolute bottom-10 left-5 md:bottom-20 md:left-10 max-w-lg p-2">
          <h1 className="text-4xl md:text-6xl font-bold text-white">{featuredMovie.title}</h1>
          <p className="mt-2 text-sm md:text-lg text-gray-200 line-clamp-3">{featuredMovie.overview}</p>
        </div>
      </div>

      {/* Categorized Rows */}
      <div className="pb-10">
        {categoryData.map((category) => (
          <section key={category.title} className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold px-5 md:px-10 mb-4 text-gray-200">
              {category.title}
            </h2>
            <div className="flex overflow-x-auto space-x-4 px-5 md:px-10 pb-4 scrollbar-hide">
              {category.movies.map((movie) => (
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
