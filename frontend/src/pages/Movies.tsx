import React, { useEffect, useState } from 'react';
import { ChevronDown, Play, Plus, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Movie, MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

const GENRES = [
  { id: 'all', name: 'All Genres' },
  { id: '28', name: 'Action' },
  { id: '12', name: 'Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' },
  { id: '10751', name: 'Family' },
  { id: '14', name: 'Fantasy' },
  { id: '36', name: 'History' },
  { id: '27', name: 'Horror' },
];

const Movies = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
    fetchMovies();
  }, [selectedGenre]);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      let response;
      if (selectedGenre === 'all') {
        response = await axiosInstance.get<MovieResponse>('/api/movies/popular');
      } else {
        response = await axiosInstance.get<MovieResponse>(`/api/movies/discover?genre=${selectedGenre}`);
      }
      setMovies(response.data.results);
      
      // Set featured movie from the first result if not already set
      if (!featuredMovie && response.data.results.length > 0) {
        setFeaturedMovie(response.data.results[0]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.get<MovieResponse>(
        `/api/movies/search?query=${encodeURIComponent(searchQuery)}`
      );
      setMovies(response.data.results);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
      />

      {/* Featured Movie Banner */}
      {featuredMovie && (
        <div className="relative h-[85vh] w-full">
          <div className="absolute inset-0">
            <img
              src={`${TMDB_IMAGE_BASE_URL}/original${featuredMovie.backdrop_path}`}
              alt={featuredMovie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#14141480] to-transparent" />
          </div>
          
          <div className="absolute bottom-0 left-0 p-16 w-full">
            <div className="max-w-2xl">
              <h1 className="text-7xl font-bold mb-4 text-white">{featuredMovie.title}</h1>
              <p className="text-lg text-gray-200 mb-6">{featuredMovie.overview}</p>
              
              <div className="flex items-center gap-3 text-sm text-gray-300 mb-8">
                <span className="text-green-500 font-semibold">
                  {Math.round(featuredMovie.vote_average * 10)}% Match
                </span>
                <span>{new Date(featuredMovie.release_date).getFullYear()}</span>
                <span className="border border-gray-500 px-2 py-0.5">HD</span>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleMovieClick(featuredMovie)}
                  className="bg-white hover:bg-white/90 text-black px-8 py-3 rounded flex items-center gap-2 font-semibold transition-colors"
                >
                  <Play className="w-6 h-6" /> Play
                </button>
                <button className="bg-[#6d6d6eb3] hover:bg-[#6d6d6e99] text-white px-8 py-3 rounded flex items-center gap-2 font-semibold transition-colors">
                  <Plus className="w-6 h-6" /> My List
                </button>
                <button className="bg-[#6d6d6eb3] hover:bg-[#6d6d6e99] text-white p-3 rounded-full">
                  <ThumbsUp className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Genre Filter and Movies Grid */}
      <div className="px-16 py-8">
        <div className="relative mb-8">
          <button
            className="bg-transparent hover:bg-[#2a2a2a] border border-[#404040] text-white px-5 py-2 rounded-sm flex items-center gap-2 transition-colors"
            onClick={() => setShowGenreDropdown(!showGenreDropdown)}
          >
            {GENRES.find(g => g.id === selectedGenre)?.name}
            <ChevronDown className={`w-4 h-4 transition-transform ${showGenreDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showGenreDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-[#2a2a2a] border border-[#404040] rounded-sm shadow-lg z-50">
              {GENRES.map(genre => (
                <button
                  key={genre.id}
                  className={`w-full text-left px-4 py-2 hover:bg-[#404040] transition-colors ${
                    selectedGenre === genre.id ? 'bg-[#404040] text-white' : 'text-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedGenre(genre.id);
                    setShowGenreDropdown(false);
                  }}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                imageBaseUrl={TMDB_IMAGE_BASE_URL}
                onMovieClick={handleMovieClick}
              />
            ))}
          </div>
        )}

        {!isLoading && movies.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            <p className="text-xl">No movies found</p>
            <p className="mt-2">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;