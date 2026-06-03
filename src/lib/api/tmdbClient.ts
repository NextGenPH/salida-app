import axios, { AxiosInstance } from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Movie } from '@/types/movie';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const tmdbClient: AxiosInstance = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});
