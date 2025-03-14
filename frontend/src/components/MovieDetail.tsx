import React from 'react';
import { Star, Play, X, Clock } from 'lucide-react';
import { Movie } from '../types/movie';

interface MovieDetailProps {
  movie: Movie;
  imageBaseUrl: string;
  onClose: () => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie, imageBaseUrl, onClose }) => {
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-y-auto">
      <div className="relative min-h-screen">
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          <img
            src={`${imageBaseUrl}/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-[60vh] object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-all z-10"
        >
          <X className="text-white" size={24} />
        </button>

        {/* Content */}
        <div className="relative pt-[45vh] px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-8">
              {/* Poster */}
              <div className="hidden md:block w-80 flex-shrink-0">
                <img
                  src={`${imageBaseUrl}/w500${movie.poster_path}`}
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
                  <div className="flex gap-2 mb-6">
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

                <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg flex items-center">
                  <Play className="mr-2" size={20} />
                  Watch Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail; 