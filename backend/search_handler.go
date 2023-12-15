package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

func handleSearch(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}

	var req SearchRequest
	err = json.Unmarshal(body, &req)
	if err != nil {
		http.Error(w, "Error unmarshalling JSON", http.StatusBadRequest)
		return
	}

	// Handle the search request here. For now, we'll just print the search value.
	log.Println("Received search request:", req.Search)

	SearchServiceEndpoint := "http://localhost:8081/search"

	jsonData, err := json.Marshal(req)
	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
		return
	}

	resp, err := http.Post(SearchServiceEndpoint, "application/json", bytes.NewReader(jsonData))
	if err != nil {
		http.Error(w, "Error sending request to another project", http.StatusInternalServerError)
		return
	}

	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Error reading response body", http.StatusInternalServerError)
		return
	}

	log.Println("Response body:", string(respBody))
	log.Println("Response header:", resp.Header)

	// Send a response back to the client.
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(respBody)
}
