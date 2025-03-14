package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	TMDBToken   string
	TMDBBaseURL string
	FrontendURL string
}

func LoadConfig() *Config {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	config := &Config{
		TMDBToken:   os.Getenv("TMDB_TOKEN"),
		TMDBBaseURL: os.Getenv("TMDB_BASE_URL"),
		FrontendURL: os.Getenv("FRONTEND_URL"),
	}

	if config.TMDBToken == "" {
		log.Fatal("TMDB_TOKEN environment variable is required")
	}

	if config.TMDBBaseURL == "" {
		log.Fatal("TMDB_BASE_URL environment variable is required")
	}

	if config.FrontendURL == "" {
		log.Fatal("FRONTEND_URL environment variable is required")
	}

	return config
}
