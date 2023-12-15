package main

import (
	"log"
	"net/http"

	"github.com/rs/cors"
)

func main() {
	log.Printf("Welcome to Cineverse Server!")
	log.Println("Starting the API Gateway server...")

	mux := http.NewServeMux()
	mux.HandleFunc("/search", handleSearch)
	handler := cors.Default().Handler(mux)
	http.ListenAndServe(":8080", handler)
}
