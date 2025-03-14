import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Movie, MovieResponse } from '../types/movie';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import FeaturedMovie from '../components/FeaturedMovie';
import LoadingSpinner from '../components/LoadingSpinner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

function Home() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchTrendingMovies(), fetchPopularMovies()]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingMovies = async () => {
    try {
      const response = await axiosInstance.get<MovieResponse>('/api/movies/trending');
      setTrendingMovies(response.data.results);
      if (!featuredMovie && response.data.results.length > 0) {
        setFeaturedMovie(response.data.results[0]);
      }
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    }
  };

  const fetchPopularMovies = async () => {
    try {
      const response = await axiosInstance.get<MovieResponse>('/api/movies/popular');
      setPopularMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await axiosInstance.get<MovieResponse>(`/api/movies/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Header 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearch}
        />
        <main className="pt-20">
          <LoadingSpinner size="lg" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
      />

      <main className="pt-20 pb-8">
        {featuredMovie && (
          <FeaturedMovie movie={featuredMovie} imageBaseUrl={TMDB_IMAGE_BASE_URL} />
        )}

        <div className="max-w-7xl mx-auto px-6">
          {/* Search Results */}
          {searchQuery && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Search Results</h2>
              {isSearching ? (
                <LoadingSpinner />
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {searchResults.map((movie) => (
                    <MovieCard 
                      key={movie.id} 
                      movie={movie} 
                      imageBaseUrl={TMDB_IMAGE_BASE_URL}
                      onMovieClick={handleMovieClick}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No results found for "{searchQuery}"</p>
              )}
            </section>
          )}

          {/* Trending Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <TrendingUp className="text-blue-500 mr-2" />
                <h2 className="text-2xl font-bold">Trending Now</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {trendingMovies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  imageBaseUrl={TMDB_IMAGE_BASE_URL}
                  onMovieClick={handleMovieClick}
                />
              ))}
            </div>
          </section>

          {/* Popular Movies Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Popular Movies</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {popularMovies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  imageBaseUrl={TMDB_IMAGE_BASE_URL}
                  onMovieClick={handleMovieClick}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Home; 