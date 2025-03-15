package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"backend/internal/config"
	"backend/internal/handlers"
	"backend/internal/middleware"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Initialize database
	db := config.InitDB()

	// Initialize router
	r := gin.Default()

	// Enable CORS
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{cfg.FrontendURL}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	r.Use(cors.New(corsConfig))

	// Initialize handlers
	movieHandler := handlers.NewMovieHandler(cfg)
	authHandler := handlers.NewAuthHandler(db)

	// Public routes
	r.POST("/api/auth/register", authHandler.Register)
	r.POST("/api/auth/login", authHandler.Login)

	// Protected routes
	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/movies/trending", movieHandler.GetTrendingMovies)
		protected.GET("/movies/popular", movieHandler.GetPopularMovies)
		protected.GET("/movies/search", movieHandler.SearchMovies)
		protected.GET("/movies/discover", movieHandler.DiscoverMovies)
		protected.GET("/movies/:id", movieHandler.GetMovieDetails)
		protected.GET("/movies/genres/:id", movieHandler.GetMovieByGenre)
	}

	r.Run(":8080")
}
