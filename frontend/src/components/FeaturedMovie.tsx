import React from 'react';
import { Star, Play } from 'lucide-react';
import { Movie } from '../types/movie';
import { Link } from 'react-router-dom';

interface FeaturedMovieProps {
  movie: Movie;
  imageBaseUrl: string;
}

const FeaturedMovie: React.FC<FeaturedMovieProps> = ({ movie, imageBaseUrl }) => {
  return (
    <div className="relative h-[600px] mb-12">
      <div className="absolute inset-0 bg-black">
        <img 
          src={`${imageBaseUrl}/original${movie.backdrop_path || movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover opacity-50"
          onError={(e) => {
            e.currentTarget.src = `${imageBaseUrl}/w1280${movie.poster_path}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 h-full flex items-end pb-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">{movie.title}</h1>
          <p className="text-gray-300 text-lg mb-6 line-clamp-3">
            {movie.overview}
          </p>
          <div className="flex items-center space-x-8 mb-6">
            <div className="flex items-center">
              <Star className="text-yellow-500 w-5 h-5 mr-2" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
            <span>{new Date(movie.release_date).getFullYear()}</span>
            <span className="bg-blue-500 px-3 py-1 rounded">HD</span>
          </div>
          <Link 
            to={`/movie/${movie.id}`} 
            className="inline-flex w-fit bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg items-center transition-colors"
          >
            <Play className="mr-2" size={20} />
            Watch Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMovie; 