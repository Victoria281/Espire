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

func setupCollectionRouter(mockService *mocks.CollectionService) *fiber.App {
	app := fiber.New()
	collectionController := controller.NewCollectionController(mockService)

	app.Get("/collections", collectionController.GetCollection)
	app.Post("/collections", collectionController.CreateCollection)
	app.Put("/collections/:id", collectionController.UpdateCollection)
	app.Post("/collections/:id/articles/:article_id", collectionController.AddArticleToCollection)
	app.Delete("/collections/:id/articles/:article_id", collectionController.RemoveArticleFromCollection)
	app.Delete("/collections/:id", collectionController.DeleteCollection)

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

func createJWTToken(username string) (string, error) {
	return auth.GenerateJWT(username, "user")
}

func TestGetCollection(t *testing.T) {
	mockService := new(mocks.CollectionService)
	app := setupCollectionRouter(mockService)

	username := "testuser"
	collections := []models.Collection{
		{ID: 1, Name: "Collection 1"},
		{ID: 2, Name: "Collection 2"},
	}

	mockService.On("GetCollection", username).Return(collections, nil)

	request := httptest.NewRequest("GET", "/collections", nil)
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody []models.Collection
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.NoError(t, err)
	assert.Equal(t, 2, len(responseBody))
	assert.Equal(t, "Collection 1", responseBody[0].Name)
	assert.Equal(t, "Collection 2", responseBody[1].Name)
}

func TestCreateCollection(t *testing.T) {
	mockService := new(mocks.CollectionService)
	app := setupCollectionRouter(mockService)

	username := "testuser"
	collection := models.Collection{Name: "New Collection"}

	mockService.On("CreateCollection", username, collection).Return(uint(1), nil)

	reqBody := bytes.NewBufferString(`{"name": "New Collection"}`)
	request := httptest.NewRequest("POST", "/collections", reqBody)
	request.Header.Set("Content-Type", "application/json")
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusCreated, resp.StatusCode)

	var responseBody map[string]uint
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, uint(1), responseBody["id"])
}

func TestUpdateCollection(t *testing.T) {
	mockService := new(mocks.CollectionService)
	app := setupCollectionRouter(mockService)

	username := "testuser"
	collectionID := uint(1)
	collection := models.Collection{Name: "Updated Collection"}

	mockService.On("UpdateCollection", username, collectionID, &collection).Return(nil)

	reqBody := bytes.NewBufferString(`{"name": "Updated Collection"}`)
	request := httptest.NewRequest("PUT", fmt.Sprintf("/collections/%d", collectionID), reqBody)
	request.Header.Set("Content-Type", "application/json")
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "collection updated successfully", responseBody["message"])
}

func TestAddArticleToCollection(t *testing.T) {
	mockService := new(mocks.CollectionService)
	app := setupCollectionRouter(mockService)

	username := "testuser"
	collectionID := uint(1)
	articleID := uint(1)

	mockService.On("AddArticle", collectionID, articleID).Return(nil)

	request := httptest.NewRequest("POST", fmt.Sprintf("/collections/%d/articles/%d", collectionID, articleID), nil)
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "Article added to collection successfully", responseBody["message"])
}

func TestRemoveArticleFromCollection(t *testing.T) {
	mockService := new(mocks.CollectionService)
	app := setupCollectionRouter(mockService)

	username := "testuser"
	collectionID := uint(1)
	articleID := uint(1)

	mockService.On("RemoveArticle", collectionID, articleID).Return(nil)

	request := httptest.NewRequest("DELETE", fmt.Sprintf("/collections/%d/articles/%d", collectionID, articleID), nil)
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "Article removed from collection successfully", responseBody["message"])
}

func TestDeleteCollection(t *testing.T) {
	mockService := new(mocks.CollectionService)
	app := setupCollectionRouter(mockService)

	username := "testuser"
	collectionID := uint(1)

	mockService.On("Delete", collectionID).Return(nil)

	request := httptest.NewRequest("DELETE", fmt.Sprintf("/collections/%d", collectionID), nil)
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "Collection deleted successfully", responseBody["message"])
}
