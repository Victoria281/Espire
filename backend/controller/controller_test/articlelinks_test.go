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

func setupArticleLinkRouter(mockService *mocks.ArticleLinkService) *fiber.App {
	app := fiber.New()
	articleLinkController := controller.NewArticleLinkController(mockService)

	app.Post("/links", articleLinkController.CreateLink)
	app.Put("/links/:id", articleLinkController.UpdateLink)
	app.Delete("/links/:id", articleLinkController.DeleteLink)

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

func TestCreateLink(t *testing.T) {
	mockService := new(mocks.ArticleLinkService)
	app := setupArticleLinkRouter(mockService)

	username := "testuser"
	articleID := "1"
	link := struct {
		ArticleID string `json:"article_id"`
		Links     []struct {
			Link   string `json:"link"`
			IsMain bool   `json:"is_main"`
		} `json:"Links"`
	}{
		ArticleID: articleID,
		Links: []struct {
			Link   string `json:"link"`
			IsMain bool   `json:"is_main"`
		}{
			{Link: "http://example.com", IsMain: true},
		},
	}

	mockService.On("CreateLink", uint(1), true, "http://example.com").Return(nil)

	reqBody, _ := json.Marshal(link)
	request := httptest.NewRequest("POST", "/links", bytes.NewBuffer(reqBody))
	request.Header.Set("Content-Type", "application/json")
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusCreated, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "Link created successfully", responseBody["message"])
}

func TestUpdateLink(t *testing.T) {
	mockService := new(mocks.ArticleLinkService)
	app := setupArticleLinkRouter(mockService)

	username := "testuser"
	articleID := "1"
	linkID := uint(1)
	updateLink := struct {
		ArticleID string `json:"article_id"`
		Links     []struct {
			ID     uint   `json:"id"`
			Link   string `json:"link"`
			IsMain bool   `json:"is_main"`
		} `json:"Links"`
	}{
		ArticleID: articleID,
		Links: []struct {
			ID     uint   `json:"id"`
			Link   string `json:"link"`
			IsMain bool   `json:"is_main"`
		}{
			{ID: linkID, Link: "http://example.com/updated", IsMain: false},
		},
	}

	mockService.On("UpdateLink", uint(1), linkID, false, "http://example.com/updated").Return(nil)

	reqBody, _ := json.Marshal(updateLink)
	request := httptest.NewRequest("PUT", fmt.Sprintf("/links/%d", linkID), bytes.NewBuffer(reqBody))
	request.Header.Set("Content-Type", "application/json")
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "Links updated successfully", responseBody["message"])
}

func TestDeleteLink(t *testing.T) {
	mockService := new(mocks.ArticleLinkService)
	app := setupArticleLinkRouter(mockService)

	username := "testuser"
	linkID := uint(1)

	mockService.On("DeleteLink", linkID).Return(nil)

	request := httptest.NewRequest("DELETE", fmt.Sprintf("/links/%d", linkID), nil)
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "Link deleted successfully", responseBody["message"])
}
