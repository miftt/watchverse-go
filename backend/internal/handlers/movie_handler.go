package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"backend/internal/config"
	"backend/internal/models"

	"github.com/gin-gonic/gin"
)

type MovieHandler struct {
	config *config.Config
}

func NewMovieHandler(config *config.Config) *MovieHandler {
	return &MovieHandler{
		config: config,
	}
}

func (h *MovieHandler) GetTrendingMovies(c *gin.Context) {
	url := fmt.Sprintf("%s/trending/movie/week", h.config.TMDBBaseURL)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	req.Header.Add("Authorization", "Bearer "+h.config.TMDBToken)
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var movieResp models.MovieResponse
	if err := json.Unmarshal(body, &movieResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, movieResp)
}

func (h *MovieHandler) GetPopularMovies(c *gin.Context) {
	page := c.DefaultQuery("page", "1")

	url := fmt.Sprintf("%s/movie/popular?page=%s", h.config.TMDBBaseURL, page)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	req.Header.Add("Authorization", "Bearer "+h.config.TMDBToken)
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var movieResp models.MovieResponse
	if err := json.Unmarshal(body, &movieResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, movieResp)
}

func (h *MovieHandler) SearchMovies(c *gin.Context) {
	query := c.Query("query")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Query parameter is required"})
		return
	}

	url := fmt.Sprintf("%s/search/movie?query=%s", h.config.TMDBBaseURL, query)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	req.Header.Add("Authorization", "Bearer "+h.config.TMDBToken)
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var movieResp models.MovieResponse
	if err := json.Unmarshal(body, &movieResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, movieResp)
}

func (h *MovieHandler) GetMovieDetails(c *gin.Context) {
	movieID := c.Param("id")
	url := fmt.Sprintf("%s/movie/%s", h.config.TMDBBaseURL, movieID)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	req.Header.Add("Authorization", "Bearer "+h.config.TMDBToken)
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var movie models.Movie
	if err := json.Unmarshal(body, &movie); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, movie)
}

func (h *MovieHandler) DiscoverMovies(c *gin.Context) {
	genreID := c.Query("genre")
	if genreID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Genre parameter is required"})
		return
	}

	url := fmt.Sprintf("%s/discover/movie?with_genres=%s&sort_by=popularity.desc", h.config.TMDBBaseURL, genreID)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	req.Header.Add("Authorization", "Bearer "+h.config.TMDBToken)
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var movieResp models.MovieResponse
	if err := json.Unmarshal(body, &movieResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, movieResp)
}

func (h *MovieHandler) GetMovieByGenre(c *gin.Context) {
	genreID := c.Param("id")
	page := c.DefaultQuery("page", "1")

	url := fmt.Sprintf("%s/discover/movie?with_genres=%s&page=%s&sort_by=popularity.desc", h.config.TMDBBaseURL, genreID, page)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	req.Header.Add("Authorization", "Bearer "+h.config.TMDBToken)
	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var movieResp models.MovieResponse
	if err := json.Unmarshal(body, &movieResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, movieResp)
}
