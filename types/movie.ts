export interface Movie {
  id: number;
  title: string;
  year: number;
  runtime: string;
  genres: string[];
  description: string;
  poster: string;
  ratings: {
    imdb: number;
    rt: number;
    rtAudience: number;
    tmdb: number;
  };
  streaming: StreamingService[];
}

export interface StreamingService {
  service: string;
  type: 'subscription' | 'rent';
  price?: string;
}

export type ContentType = 'movies' | 'tv';

export interface CustomList {
  id: number;
  name: string;
  movies: Movie[];
}
