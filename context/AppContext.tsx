import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Movie, CustomList, ContentType } from '../types/movie';
import { SAMPLE_MOVIES, ALL_STREAMING_SERVICES } from '../data/movies';

interface AppContextType {
  // Content settings
  contentType: ContentType;
  setContentType: (type: ContentType) => void;
  showOnlyMyServices: boolean;
  setShowOnlyMyServices: (show: boolean) => void;
  userServices: string[];
  setUserServices: (services: string[]) => void;

  // Movie browsing
  currentMovieIndex: number;
  setCurrentMovieIndex: (index: number) => void;
  getFilteredMovies: () => Movie[];

  // Lists
  watchlist: Movie[];
  seenMovies: Movie[];
  customLists: CustomList[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  addToSeenMovies: (movie: Movie) => void;
  removeFromSeenMovies: (movieId: number) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Watch Party
  partyState: 'home' | 'create' | 'waiting' | 'matching' | 'matched';
  setPartyState: (state: 'home' | 'create' | 'waiting' | 'matching' | 'matched') => void;
  partyName: string;
  setPartyName: (name: string) => void;
  partyCode: string;
  setPartyCode: (code: string) => void;
  partyMembers: Array<{ name: string; voted: boolean }>;
  setPartyMembers: (members: Array<{ name: string; voted: boolean }>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Content settings
  const [contentType, setContentType] = useState<ContentType>('movies');
  const [showOnlyMyServices, setShowOnlyMyServices] = useState(false);
  const [userServices, setUserServices] = useState<string[]>(['Netflix', 'HBO Max']);

  // Movie browsing
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

  // Lists
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [seenMovies, setSeenMovies] = useState<Movie[]>([]);
  const [customLists, setCustomLists] = useState<CustomList[]>([
    { id: 1, name: "Holiday Favorites", movies: [] },
    { id: 2, name: "Comedies", movies: [] },
    { id: 3, name: "Date Night", movies: [] }
  ]);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Watch Party
  const [partyState, setPartyState] = useState<'home' | 'create' | 'waiting' | 'matching' | 'matched'>('home');
  const [partyName, setPartyName] = useState('');
  const [partyCode, setPartyCode] = useState('');
  const [partyMembers, setPartyMembers] = useState<Array<{ name: string; voted: boolean }>>([]);

  // Functions
  const getFilteredMovies = (): Movie[] => {
    if (!showOnlyMyServices) return SAMPLE_MOVIES;
    return SAMPLE_MOVIES.filter(movie =>
      movie.streaming.some(s => userServices.includes(s.service))
    );
  };

  const addToWatchlist = (movie: Movie) => {
    if (!watchlist.find(m => m.id === movie.id)) {
      setWatchlist([...watchlist, movie]);
    }
  };

  const removeFromWatchlist = (movieId: number) => {
    setWatchlist(watchlist.filter(m => m.id !== movieId));
  };

  const addToSeenMovies = (movie: Movie) => {
    if (!seenMovies.find(m => m.id === movie.id)) {
      setSeenMovies([...seenMovies, movie]);
    }
  };

  const removeFromSeenMovies = (movieId: number) => {
    setSeenMovies(seenMovies.filter(m => m.id !== movieId));
  };

  const value: AppContextType = {
    contentType,
    setContentType,
    showOnlyMyServices,
    setShowOnlyMyServices,
    userServices,
    setUserServices,
    currentMovieIndex,
    setCurrentMovieIndex,
    getFilteredMovies,
    watchlist,
    seenMovies,
    customLists,
    addToWatchlist,
    removeFromWatchlist,
    addToSeenMovies,
    removeFromSeenMovies,
    searchQuery,
    setSearchQuery,
    partyState,
    setPartyState,
    partyName,
    setPartyName,
    partyCode,
    setPartyCode,
    partyMembers,
    setPartyMembers,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
