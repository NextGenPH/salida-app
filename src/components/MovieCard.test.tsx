import { render, screen } from '@testing-library/react';
import { MovieCard } from './MovieCard';
import { Movie } from '@/types/movie';
import { describe, it, expect } from 'vitest';

describe('MovieCard', () => {
  const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test.jpg',
    backdrop_path: '/backdrop.jpg',
    overview: 'Test overview',
    vote_average: 8.5,
    release_date: '2023-01-01',
  };

  it('renders movie title and image correctly', () => {
    render(<MovieCard movie={mockMovie} />);
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/test.jpg');
    expect(img).toHaveAttribute('alt', 'Test Movie');
  });
});
