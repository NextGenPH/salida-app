import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
  linkPrefix?: string;
}

export const MovieCard = ({ movie, linkPrefix = '/movie' }: MovieCardProps) => {
  return (
    <Link href={`${linkPrefix}/${movie.id}`} className="relative group block">
      {movie.poster_path && (
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          width={500}
          height={750}
          loading="lazy"
          className="rounded-md w-full aspect-[2/3] object-cover transition-transform group-hover:scale-105"
        />
      )}
      <h2 className="mt-2 text-sm font-medium text-white group-hover:text-red-500 truncate">
        {movie.title}
      </h2>
    </Link>
  );
};
