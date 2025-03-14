import React from 'react';
import { Play, Star } from 'lucide-react';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  imageBaseUrl: string;
  onMovieClick: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, imageBaseUrl, onMovieClick }) => {
  return (
    <div 
      className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
      onClick={() => onMovieClick(movie)}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
        <img 
          src={`${imageBaseUrl}/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = `${imageBaseUrl}/w500${movie.backdrop_path}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Play className="text-white" size={40} />
          </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-2">
          <span className="bg-blue-500 px-2 py-1 text-xs font-medium rounded-md shadow-lg">HD</span>
        </div>
      </div>
      <div className="px-1">
        <h3 className="font-semibold text-sm mb-2 line-clamp-1 text-white/90">
          {movie.title}
        </h3>
        <div className="flex items-center text-xs text-gray-400 gap-2">
          <div className="flex items-center">
            <Star className="text-yellow-500 w-4 h-4 mr-1" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-gray-600" />
          <span>{new Date(movie.release_date).getFullYear()}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;