package controller_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http/httptest"
	"testing"

	"github.com/Victoria281/Espire/backend/auth"
	"github.com/Victoria281/Espire/backend/controller"
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/services/mocks"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func setupFlashcardRouter(mockService *mocks.ArticleFlashcardService) *fiber.App {
	app := fiber.New()
	flashcardController := controller.NewArticleFlashcardController(mockService)

	app.Post("/flashcards", flashcardController.CreateFlashcard)
	app.Put("/flashcards/:id", flashcardController.UpdateFlashcard)
	app.Delete("/flashcards/:id", flashcardController.DeleteFlashcard)
	app.Post("/flashcards/generate/:article_id", flashcardController.GenerateFlashcardsFromQuotes)

	app.Use(func(c *fiber.Ctx) error {
		username := auth.ParseUsername(c)
		if username == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Unauthorized"})
		}
		c.Locals("username", username)
		return c.Next()
	})

	return app
}

func TestCreateFlashcard(t *testing.T) {
	mockService := new(mocks.ArticleFlashcardService)
	app := setupFlashcardRouter(mockService)

	username := "testuser"
	flashcardRequest := struct {
		ArticleID string `json:"article_id"`
		Question  string `json:"question"`
		Answer    string `json:"answer"`
	}{
		ArticleID: "1",
		Question:  "What is Go?",
		Answer:    "A programming language.",
	}

	mockService.On("CreateFlashcard", uint(1), flashcardRequest.Answer, flashcardRequest.Question).Return(nil)

	reqBody, _ := json.Marshal(flashcardRequest)
	request := httptest.NewRequest("POST", "/flashcards", bytes.NewBuffer(reqBody))
	request.Header.Set("Content-Type", "application/json")
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusCreated, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "Flashcard created successfully", responseBody["message"])
}

func TestUpdateFlashcard(t *testing.T) {
	mockService := new(mocks.ArticleFlashcardService)
	app := setupFlashcardRouter(mockService)

	username := "testuser"
	flashcardID := uint(1)

	question := "Updated Question"
	answer := "Updated Answer"

	flashcardUpdate := struct {
		Data []struct {
			Id       int     `json:"id"`
			Question *string `json:"question"`
			Answer   *string `json:"answer"`
		} `json:"data"`
	}{
		Data: []struct {
			Id       int     `json:"id"`
			Question *string `json:"question"`
			Answer   *string `json:"answer"`
		}{
			{Id: 1, Question: &question, Answer: &answer},
		},
	}

	mockService.On("UpdateFlashcard", uint(1), flashcardID, &answer, &question, (*int)(nil), (*int)(nil)).Return(nil)

	reqBody, _ := json.Marshal(flashcardUpdate)
	request := httptest.NewRequest("PUT", fmt.Sprintf("/flashcards/%d", flashcardID), bytes.NewBuffer(reqBody))
	request.Header.Set("Content-Type", "application/json")
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.NoError(t, err)
	assert.Equal(t, "Flashcard updated successfully", responseBody["message"])
}

func TestDeleteFlashcard(t *testing.T) {
	mockService := new(mocks.ArticleFlashcardService)
	app := setupFlashcardRouter(mockService)

	username := "testuser"
	flashcardID := uint(1)

	mockService.On("DeleteFlashcard", flashcardID).Return(nil)

	request := httptest.NewRequest("DELETE", fmt.Sprintf("/flashcards/%d", flashcardID), nil)
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "Flashcard deleted successfully", responseBody["message"])
}

func TestGenerateFlashcardsFromQuotes(t *testing.T) {
	mockService := new(mocks.ArticleFlashcardService)
	app := setupFlashcardRouter(mockService)

	username := "testuser"
	articleID := uint(1)

	flashcards := []models.ArticleFlashcards{
		{ID: 1, Question: "What is Go?", Answer: "A programming language."},
		{ID: 2, Question: "What is Fiber?", Answer: "A web framework for Go."},
	}

	mockService.On("GenerateFlashcardsFromQuotes", articleID).Return(flashcards, nil)

	request := httptest.NewRequest("POST", fmt.Sprintf("/flashcards/generate/%d", articleID), nil)
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, len(flashcards), len(responseBody["flashcards"].([]interface{})))
}
