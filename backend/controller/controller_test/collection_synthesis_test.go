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

func setupSynthesisRouter(mockService *mocks.SynthesisService) *fiber.App {
	app := fiber.New()
	synthesisController := controller.NewSynthesisController(mockService)

	app.Post("/synthesis", synthesisController.CreateSynthesis)
	app.Delete("/synthesis/:id", synthesisController.DeleteSynthesis)

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
func TestCreateSynthesis(t *testing.T) {
	mockService := new(mocks.SynthesisService)
	app := setupSynthesisRouter(mockService)

	username := "testuser"
	synthesis := &models.Synthesis{
		CollectionID: 1,
		Key:          "exampleKey",
		Text:         "This is a synthesis text.",
	}

	mockService.On("CreateSynthesis", synthesis.CollectionID, synthesis.Key, synthesis.Text).Return(synthesis, nil)

	reqBody := bytes.NewBufferString(`{"collectionid": 1, "key": "exampleKey", "text": "This is a synthesis text."}`)
	request := httptest.NewRequest("POST", "/synthesis", reqBody)
	request.Header.Set("Content-Type", "application/json")
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusCreated, resp.StatusCode)

	var responseBody *models.Synthesis
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.NoError(t, err)
	assert.Equal(t, synthesis.CollectionID, responseBody.CollectionID)
	assert.Equal(t, synthesis.Key, responseBody.Key)
	assert.Equal(t, synthesis.Text, responseBody.Text)
}

func TestDeleteSynthesis(t *testing.T) {
	mockService := new(mocks.SynthesisService)
	app := setupSynthesisRouter(mockService)

	username := "testuser"
	synthesisID := uint(1)

	mockService.On("DeleteSynthesis", synthesisID).Return(nil)

	request := httptest.NewRequest("DELETE", fmt.Sprintf("/synthesis/%d", synthesisID), nil)
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.NoError(t, err)
	assert.Equal(t, "Synthesis deleted successfully", responseBody["message"])
}
