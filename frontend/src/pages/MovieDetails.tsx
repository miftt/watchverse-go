import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Play, Clock, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Movie } from '../types/movie';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<Movie>(`/api/movies/${id}`);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Header searchQuery="" onSearchChange={() => {}} onSearchSubmit={() => {}} />
        <main className="pt-20">
          <LoadingSpinner size="lg" />
        </main>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Header searchQuery="" onSearchChange={() => {}} onSearchSubmit={() => {}} />
        <main className="pt-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-400">Movie not found</h1>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center mx-auto"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header searchQuery="" onSearchChange={() => {}} onSearchSubmit={() => {}} />

      <main className="pt-20">
        {/* Backdrop Image */}
        <div className="relative h-[70vh]">
          <img
            src={`${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 p-2 bg-black bg-opacity-50 cursor-pointer rounded-full hover:bg-opacity-75 transition-all z-10 flex items-center"
          >
            <ArrowLeft className="text-white mr-2" size={24} />
            <span>Back</span>
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
          <div className="flex gap-8">
            {/* Poster */}
            <div className="hidden md:block w-80 flex-shrink-0">
              <img
                src={`${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-xl text-gray-400 mb-4 italic">"{movie.tagline}"</p>
              )}

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center">
                  <Star className="text-yellow-500 w-5 h-5 mr-2" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                <span>{new Date(movie.release_date).getFullYear()}</span>
                {movie.runtime && (
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
              </div>

              {movie.genres && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-blue-500 bg-opacity-20 rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-gray-300 text-lg mb-8">{movie.overview}</p>

              <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg flex items-center transition-colors">
                <Play className="mr-2" size={20} />
                Watch Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MovieDetails; 