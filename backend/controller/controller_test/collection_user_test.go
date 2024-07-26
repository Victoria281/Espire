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

func setupCollectionUserRouter(mockService *mocks.CollectionUserService) *fiber.App {
	app := fiber.New()
	collectionUserController := controller.CollectionUserController{Service: mockService}

	app.Get("/:id/users/search", collectionUserController.SearchUser)
	app.Post("/:id/users/invite", collectionUserController.InviteUser)
	app.Delete("/:id/users/invite", collectionUserController.RemoveUser)
	app.Get("/:id/users", collectionUserController.GetInvitedUsers)
	app.Get("/shared", collectionUserController.GetSharedCollections)

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

func TestSearchUser(t *testing.T) {
	mockService := new(mocks.CollectionUserService)
	app := setupCollectionUserRouter(mockService)

	username := "testuser"
	collectionID := uint(1)
	query := "test"

	mockService.On("SearchUser", query).Return([]struct {
		Username string `json:"username"`
	}{
		{Username: "user1"},
		{Username: "user2"},
	}, nil)

	request := httptest.NewRequest("GET", fmt.Sprintf("/%d/users/search?query=%s", collectionID, query), nil)
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody []struct {
		Username string `json:"username"`
	}
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.NoError(t, err)
	assert.Equal(t, 2, len(responseBody))
	assert.Equal(t, "user1", responseBody[0].Username)
	assert.Equal(t, "user2", responseBody[1].Username)
}

func TestInviteUser(t *testing.T) {
	mockService := new(mocks.CollectionUserService)
	app := setupCollectionUserRouter(mockService)

	username := "testuser"
	collectionID := uint(1)
	inviteeUsername := "inviteeUser"

	mockService.On("InviteUser", collectionID, inviteeUsername).Return(nil)

	reqBody := bytes.NewBufferString(`{"username": "inviteeUser"}`)
	request := httptest.NewRequest("POST", fmt.Sprintf("/%d/users/invite", collectionID), reqBody)
	request.Header.Set("Content-Type", "application/json")
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)
}

func TestInviteSelf(t *testing.T) {
	mockService := new(mocks.CollectionUserService)
	app := setupCollectionUserRouter(mockService)

	collectionID := uint(1)
	reqBody := bytes.NewBufferString(`{"username": "testuser"}`)
	request := httptest.NewRequest("POST", fmt.Sprintf("/%d/users/invite", collectionID), reqBody)
	request.Header.Set("Content-Type", "application/json")
	username := "testuser"
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusBadRequest, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "You cannot invite yourself", responseBody["error"])
}

func TestRemoveUser(t *testing.T) {
	mockService := new(mocks.CollectionUserService)
	app := setupCollectionUserRouter(mockService)

	username := "testuser"
	collectionID := uint(1)
	removeeUsername := "removeeUser"

	mockService.On("RemoveUser", collectionID, removeeUsername).Return(nil)

	reqBody := bytes.NewBufferString(`{"username": "removeeUser"}`)
	request := httptest.NewRequest("DELETE", fmt.Sprintf("/%d/users/invite", collectionID), reqBody)
	request.Header.Set("Content-Type", "application/json")
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)
}

func TestRemoveSelf(t *testing.T) {
	mockService := new(mocks.CollectionUserService)
	app := setupCollectionUserRouter(mockService)

	collectionID := uint(1)
	reqBody := bytes.NewBufferString(`{"username": "testuser"}`)
	request := httptest.NewRequest("DELETE", fmt.Sprintf("/%d/users/invite", collectionID), reqBody)
	request.Header.Set("Content-Type", "application/json")
	username := "testuser"
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusBadRequest, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "You cannot remove yourself", responseBody["error"])
}

func TestGetInvitedUsers(t *testing.T) {
	mockService := new(mocks.CollectionUserService)
	app := setupCollectionUserRouter(mockService)

	username := "testuser"
	collectionID := uint(1)

	mockService.On("GetInvitedUsers", collectionID).Return([]struct {
		Username string `json:"username"`
	}{
		{Username: "inviteeUser1"},
		{Username: "inviteeUser2"},
	}, nil)

	request := httptest.NewRequest("GET", fmt.Sprintf("/%d/users", collectionID), nil)
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody []struct{ Username string }
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.NoError(t, err)
	assert.Equal(t, 2, len(responseBody))
	assert.Equal(t, "inviteeUser1", responseBody[0].Username)
	assert.Equal(t, "inviteeUser2", responseBody[1].Username)
}

func TestGetSharedCollections(t *testing.T) {
	mockService := new(mocks.CollectionUserService)
	app := setupCollectionUserRouter(mockService)

	username := "testuser"

	mockService.On("GetSharedCollections", username).Return([]models.Collection{
		{ID: 1, Name: "Shared Collection 1"},
		{ID: 2, Name: "Shared Collection 2"},
	}, nil)

	request := httptest.NewRequest("GET", "/shared", nil)
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
	assert.Equal(t, "Shared Collection 1", responseBody[0].Name)
	assert.Equal(t, "Shared Collection 2", responseBody[1].Name)
}
