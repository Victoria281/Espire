package controller_test

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http/httptest"
	"testing"

	"github.com/Victoria281/Espire/backend/controller"
	"github.com/Victoria281/Espire/backend/services/mocks"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func setupAuthRouter(mockAuthService *mocks.AuthService) *fiber.App {
	app := fiber.New()
	authController := &controller.AuthController{
		Service: mockAuthService,
	}
	app.Post("/login", authController.Login)
	app.Post("/register", authController.Register)
	return app
}

func TestLogin(t *testing.T) {
	mockAuthService := new(mocks.AuthService)
	app := setupAuthRouter(mockAuthService)

	username := "testuser"
	password := "password"
	token := "mocktoken"

	mockAuthService.On("Login", username, password).Return(token, nil)

	reqBody := `{"username": "testuser", "password": "password"}`
	req := httptest.NewRequest("POST", "/login", bytes.NewBufferString(reqBody))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, token, responseBody["token"])
}

func TestLoginUnauthorized(t *testing.T) {
	mockAuthService := new(mocks.AuthService)
	app := setupAuthRouter(mockAuthService)

	username := "testuser"
	password := "wrongpassword"

	mockAuthService.On("Login", username, password).Return("", errors.New("incorrect password"))

	reqBody := `{"username": "testuser", "password": "wrongpassword"}`
	req := httptest.NewRequest("POST", "/login", bytes.NewBufferString(reqBody))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusUnauthorized, resp.StatusCode)
}

func TestRegister(t *testing.T) {
	mockAuthService := new(mocks.AuthService)
	app := setupAuthRouter(mockAuthService)

	username := "newuser"
	password := "newpassword"

	mockAuthService.On("Register", username, password).Return(nil)

	reqBody := `{"username": "newuser", "password": "newpassword"}`
	req := httptest.NewRequest("POST", "/register", bytes.NewBufferString(reqBody))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "User registered", responseBody["message"])
}

func TestRegisterBadRequest(t *testing.T) {
	mockAuthService := new(mocks.AuthService)
	app := setupAuthRouter(mockAuthService)

	username := "newuser"
	password := "newpassword"

	mockAuthService.On("Register", username, password).Return(assert.AnError)

	reqBody := `{"username": "newuser", "password": "newpassword"}`
	req := httptest.NewRequest("POST", "/register", bytes.NewBufferString(reqBody))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusBadRequest, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, assert.AnError.Error(), responseBody["error"])
}
