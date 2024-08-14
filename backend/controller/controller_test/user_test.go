package controller_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/Victoria281/Espire/backend/auth"
	"github.com/Victoria281/Espire/backend/controller"
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/recommender"
	"github.com/Victoria281/Espire/backend/repo"
	"github.com/Victoria281/Espire/backend/services/mocks"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func setupRouter(mockUserService *mocks.UserService, mockArticleService *mocks.ArticleService, mockTagService *mocks.TagService) *fiber.App {
	app := fiber.New()
	userController := &controller.UserController{
		Service:        mockUserService,
		ArticleService: mockArticleService,
	}
	app.Put("/update", userController.UpdatePassword)
	app.Delete("/delete", userController.Delete)
	app.Post("/add-tag", userController.AddUserTag)
	app.Delete("/remove-tag/:id", userController.RemoveUserTag)
	app.Post("/add-visit", userController.AddUserArticleVisit)
	app.Get("/get-visits", userController.GetUserArticleVisits)
	app.Get("/get-tags", userController.GetUserTags)
	app.Get("/get-recommendations", userController.GetRecommendations)
	app.Post("/save/:id", userController.ToggleSavedArticle)
	app.Get("/save", userController.GetSavedArticles)

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

func generateToken(username string) (string, error) {
	return auth.GenerateJWT(username, "user")
}

func TestUpdatePassword(t *testing.T) {
	mockUserService := new(mocks.UserService)
	app := setupRouter(mockUserService, nil, nil)

	mockUserService.On("UpdatePassword", "testuser", "oldpass", "newpass").Return(nil)

	req := `{"old_password": "oldpass", "new_password": "newpass"}`
	reqBody := strings.NewReader(req)
	request := httptest.NewRequest("PUT", "/update", reqBody)
	request.Header.Set("Content-Type", "application/json")

	token, err := generateToken("testuser")
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "Password updated successfully", responseBody["message"])
}

func TestDeleteUser(t *testing.T) {
	mockUserService := new(mocks.UserService)
	app := setupRouter(mockUserService, nil, nil)

	mockUserService.On("DeleteUser", "testuser").Return(nil)

	req := `{}`
	reqBody := strings.NewReader(req)
	request := httptest.NewRequest("DELETE", "/delete", reqBody)
	request.Header.Set("Content-Type", "application/json")

	token, err := generateToken("testuser")
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "User deleted successfully", responseBody["message"])
}

func TestAddUserTag(t *testing.T) {
	mockUserService := new(mocks.UserService)
	mockTagService := new(mocks.TagService)
	app := setupRouter(mockUserService, nil, mockTagService)

	username := "testuser"
	tagID := uint(1)

	mockTagService.On("CreateTag", models.Tag{Name: "NewTag"}).Return(tagID, nil)
	mockUserService.On("AddUserTag", username, tagID).Return(nil)

	requestBody := fmt.Sprintf(`{"tag_id": %d}`, tagID)
	req, _ := http.NewRequest("POST", "/add-tag", bytes.NewBufferString(requestBody))
	req.Header.Set("Content-Type", "application/json")

	token, err := generateToken(username)
	assert.NoError(t, err)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(req, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "Tag added successfully", responseBody["message"])
}

func TestRemoveUserTag(t *testing.T) {
	mockUserService := new(mocks.UserService)
	mockTagService := new(mocks.TagService)
	app := setupRouter(mockUserService, nil, mockTagService)

	mockUserService.On("RemoveUserTag", "testuser", uint(1)).Return(nil)
	request := httptest.NewRequest("DELETE", "/remove-tag/1", nil)

	token, err := generateToken("testuser")
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.NoError(t, err)
	assert.Equal(t, "Tag removed successfully", responseBody["message"])
}

func TestAddUserArticleVisit(t *testing.T) {
	mockUserService := new(mocks.UserService)
	app := setupRouter(mockUserService, nil, nil)

	mockUserService.On("AddUserArticleVisit", "testuser", uint(1)).Return(nil)

	req := `{"article_id": 1}`
	reqBody := strings.NewReader(req)
	request := httptest.NewRequest("POST", "/add-visit", reqBody)
	request.Header.Set("Content-Type", "application/json")

	token, err := generateToken("testuser")
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "Article visit recorded successfully", responseBody["message"])
}

func TestGetUserArticleVisits(t *testing.T) {
	mockUserService := new(mocks.UserService)
	app := setupRouter(mockUserService, nil, nil)

	mockUserService.On("GetUserArticleVisits", "testuser", 20).Return([]models.UserArticleVisit{
		{ArticleID: 1, Visit: 5},
	}, nil)

	request := httptest.NewRequest("GET", "/get-visits?limit=20", nil)

	token, err := generateToken("testuser")
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody []models.UserArticleVisit
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, 1, len(responseBody))
	assert.Equal(t, uint(1), responseBody[0].ArticleID)
	assert.Equal(t, 5, responseBody[0].Visit)
}

func TestGetUserTags(t *testing.T) {
	mockUserService := new(mocks.UserService)
	mockTagService := new(mocks.TagService)
	app := setupRouter(mockUserService, nil, mockTagService)

	expectedTags := []struct {
		ID   uint   `json:"id"`
		Name string `json:"name"`
	}{
		{ID: 1, Name: "Tag1"},
		{ID: 2, Name: "Tag2"},
	}

	mockUserService.On("GetUserTags", "testuser").Return(expectedTags, nil)

	request := httptest.NewRequest("GET", "/get-tags", nil)

	token, err := generateToken("testuser")
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody []struct {
		ID   uint   `json:"id"`
		Name string `json:"name"`
	}
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.NoError(t, err)
	assert.Equal(t, 2, len(responseBody))
	assert.Equal(t, "Tag1", responseBody[0].Name)
	assert.Equal(t, "Tag2", responseBody[1].Name)

	mockUserService.AssertExpectations(t)
}

func TestGetRecommendations(t *testing.T) {
	mockUserService := new(mocks.UserService)
	mockArticleService := new(mocks.ArticleService)
	app := setupRouter(mockUserService, mockArticleService, nil)

	username := "testuser"
	userTags := []struct {
		ID   uint   `json:"id"`
		Name string `json:"name"`
	}{
		{ID: 1, Name: "Technology"},
		{ID: 2, Name: "Science"},
	}

	interactions := []models.UserArticleVisit{
		{Username: username, ArticleID: 1, Visit: 5},
	}

	articles := []models.Articles{
		{ID: 1, Name: "Article 1"},
		{ID: 2, Name: "Article 2"},
	}

	articleDetails := map[uint]repo.ArticleDetails{
		1: {
			ArticleID:       1,
			TotalVisitCount: 100,
			CreatedAt:       time.Now().Add(-24 * time.Hour),
		},
		2: {
			ArticleID:       2,
			TotalVisitCount: 150,
			CreatedAt:       time.Now().Add(-48 * time.Hour),
		},
	}

	mockUserService.On("GetUserTags", username).Return(userTags, nil)
	mockUserService.On("GetUserArticleVisits", username, mock.Anything).Return(interactions, nil)
	mockUserService.On("FetchUserVisitScores", username, []uint{1, 2}).Return(map[uint]int{1: 5, 2: 3}, nil)

	mockArticleService.On("GetOtherArticles", username).Return(articles, nil)
	mockArticleService.On("GetArticlesDetails", []uint{1, 2}).Return(articleDetails, nil)

	request := httptest.NewRequest("GET", "/get-recommendations", nil)
	token, err := generateToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody struct {
		Recommendations []models.Articles              `json:"recommendations"`
		Popular         []recommender.ArticleWithScore `json:"popular"`
	}
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	fmt.Println(responseBody.Recommendations)
	fmt.Println(responseBody.Popular)
	assert.NoError(t, err)

	assert.Equal(t, 2, len(responseBody.Recommendations))
	assert.Equal(t, "Article 1", responseBody.Recommendations[0].Name)
	assert.Equal(t, "Article 2", responseBody.Recommendations[1].Name)

	assert.Equal(t, 2, len(responseBody.Popular))
	assert.Equal(t, "Article 2", responseBody.Popular[0].Article.Name)
	assert.Equal(t, "Article 1", responseBody.Popular[1].Article.Name)

	mockUserService.AssertExpectations(t)
	mockArticleService.AssertExpectations(t)
}

func TestToggleSavedArticle(t *testing.T) {
	mockUserService := new(mocks.UserService)
	mockArticleService := new(mocks.ArticleService)
	app := setupRouter(mockUserService, mockArticleService, nil)

	username := "testuser"
	articleID := uint(1)

	mockArticleService.On("IsArticleSavedByUser", username, articleID).Return(true, nil)
	mockUserService.On("DeleteSavedArticle", username, articleID).Return(nil)

	req := `{"article_id": 1}`
	reqBody := strings.NewReader(req)
	request := httptest.NewRequest("POST", "/save/1", reqBody)
	request.Header.Set("Content-Type", "application/json")

	token, err := generateToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "Article unsaved successfully", responseBody["message"])

	// Next call to save
	mockArticleService.ExpectedCalls = nil
	mockArticleService.On("IsArticleSavedByUser", username, articleID).Return(false, nil)
	mockUserService.On("AddSavedArticle", username, articleID).Return(nil)
	resp, err = app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "Article saved successfully", responseBody["message"])

	mockUserService.AssertExpectations(t)
	mockArticleService.AssertExpectations(t)
}

func TestGetSavedArticles(t *testing.T) {
	mockUserService := new(mocks.UserService)
	app := setupRouter(mockUserService, nil, nil)

	mockUserService.On("GetSavedArticles", "testuser").Return([]models.Articles{
		{ID: 1, Name: "Saved Article 1"},
		{ID: 2, Name: "Saved Article 2"},
	}, nil)

	request := httptest.NewRequest("GET", "/save", nil)

	token, err := generateToken("testuser")
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody []models.Articles
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, 2, len(responseBody))
	assert.Equal(t, "Saved Article 1", responseBody[0].Name)
	assert.Equal(t, "Saved Article 2", responseBody[1].Name)
}
