package controller_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http/httptest"
	"testing"

	"github.com/Victoria281/Espire/backend/auth"
	"github.com/Victoria281/Espire/backend/controller"
	"github.com/Victoria281/Espire/backend/services/mocks"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func setupArticleQuoteRouter(mockService *mocks.ArticleQuoteService) *fiber.App {
	app := fiber.New()
	articleQuoteController := controller.NewArticleQuoteController(mockService)

	app.Post("/quotes", articleQuoteController.CreateQuote)
	app.Put("/quotes/:id", articleQuoteController.UpdateQuote)
	app.Delete("/quotes/:id", articleQuoteController.DeleteQuote)

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

func TestCreateQuote(t *testing.T) {
	mockService := new(mocks.ArticleQuoteService)
	app := setupArticleQuoteRouter(mockService)

	articleID := "1"
	quotes := []struct {
		GroupNum int    `json:"grp_num"`
		Priority int    `json:"priority"`
		Fact     string `json:"fact"`
	}{
		{GroupNum: 1, Priority: 1, Fact: "Fact 1"},
		{GroupNum: 2, Priority: 2, Fact: "Fact 2"},
	}

	mockService.On("CreateQuote", uint(1), 1, 1, "Fact 1").Return(nil)
	mockService.On("CreateQuote", uint(1), 2, 2, "Fact 2").Return(nil)

	reqBody := map[string]interface{}{
		"article_id": articleID,
		"Quotes":     quotes,
	}
	reqJSON, _ := json.Marshal(reqBody)

	request := httptest.NewRequest("POST", "/quotes", bytes.NewBuffer(reqJSON))
	request.Header.Set("Content-Type", "application/json")
	token, err := createJWTToken("testuser")
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusCreated, resp.StatusCode)

	var responseBody map[string]string
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.NoError(t, err)
	assert.Equal(t, "Quotes created successfully", responseBody["message"])
}

func TestUpdateQuote(t *testing.T) {
	mockService := new(mocks.ArticleQuoteService)
	app := setupArticleQuoteRouter(mockService)

	articleID := "1"
	quoteID := uint(1)
	quotes := []struct {
		ID       uint   `json:"id"`
		GroupNum int    `json:"grp_num"`
		Priority int    `json:"priority"`
		Fact     string `json:"fact"`
	}{
		{ID: quoteID, GroupNum: 1, Priority: 1, Fact: "Updated Fact"},
	}

	mockService.On("UpdateQuote", uint(1), quoteID, 1, 1, "Updated Fact").Return(nil)

	reqBody := map[string]interface{}{
		"article_id": articleID,
		"Quotes":     quotes,
	}
	reqJSON, _ := json.Marshal(reqBody)

	request := httptest.NewRequest("PUT", fmt.Sprintf("/quotes/%d", quoteID), bytes.NewBuffer(reqJSON))
	request.Header.Set("Content-Type", "application/json")
	token, err := createJWTToken("testuser")
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.NoError(t, err)
	assert.Equal(t, "Quotes updated successfully", responseBody["message"])
}

func TestDeleteQuote(t *testing.T) {
	mockService := new(mocks.ArticleQuoteService)
	app := setupArticleQuoteRouter(mockService)

	quoteID := uint(1)

	mockService.On("DeleteQuote", quoteID).Return(nil)

	request := httptest.NewRequest("DELETE", fmt.Sprintf("/quotes/%d", quoteID), nil)
	token, err := createJWTToken("testuser")
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.NoError(t, err)
	assert.Equal(t, "Quote deleted successfully", responseBody["message"])
}
