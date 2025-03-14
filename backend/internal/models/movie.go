package models

type MovieResponse struct {
	Page    int     `json:"page"`
	Results []Movie `json:"results"`
}

type Genre struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Movie struct {
	ID           int     `json:"id"`
	Title        string  `json:"title"`
	Overview     string  `json:"overview"`
	PosterPath   string  `json:"poster_path"`
	BackdropPath string  `json:"backdrop_path"`
	VoteAverage  float64 `json:"vote_average"`
	ReleaseDate  string  `json:"release_date"`
	Runtime      int     `json:"runtime"`
	Genres       []Genre `json:"genres"`
	Tagline      string  `json:"tagline"`
}
