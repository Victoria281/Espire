package controller_test

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/Victoria281/Espire/backend/auth"
	"github.com/Victoria281/Espire/backend/controller"
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/services"
	"github.com/Victoria281/Espire/backend/services/mocks"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func setupArticleRouter(mockService *mocks.ArticleService) *fiber.App {
	app := fiber.New()
	articleController := controller.NewArticleController(mockService)

	app.Get("/articles/:id", articleController.GetArticleByID)
	app.Get("/articles", articleController.GetArticle)
	app.Get("/articles/user/:username", articleController.GetArticleByUsername)
	app.Get("/articles/name/:name", articleController.GetArticlesByName)
	app.Post("/articles", articleController.CreateNewArticle)
	app.Put("/articles/:id", articleController.UpdateArticle)
	app.Delete("/articles/:id", articleController.DeleteArticle)

	app.Get("/google/googlesearch", articleController.GetArticlesFromGoogle)
	app.Get("/web/webscrap", articleController.GetArticleInfoAndSuggestTags)

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

func TestGetArticleByID(t *testing.T) {
	mockService := new(mocks.ArticleService)
	app := setupArticleRouter(mockService)

	username := "testuser"
	articleID := uint(1)
	article := models.Articles{
		ID:          articleID,
		Name:        "Test Article",
		Username:    username,
		Authors:     "",
		Use:         "",
		Description: "",
		Date:        time.Date(1, time.January, 1, 0, 0, 0, 0, time.UTC),
		CreatedAt:   time.Date(1, time.January, 1, 0, 0, 0, 0, time.UTC),
		UpdatedAt:   time.Date(1, time.January, 1, 0, 0, 0, 0, time.UTC),
	}

	isOwner := true
	isSaved := true

	mockService.On("FindById", articleID).Return(article, nil)
	mockService.On("IsArticleSavedByUser", username, articleID).Return(isSaved, nil)

	request := httptest.NewRequest("GET", fmt.Sprintf("/articles/%d", articleID), nil)
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody fiber.Map
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.NoError(t, err)

	expectedResponse := fiber.Map{
		"article": article,
		"isOwner": isOwner,
		"isSaved": isSaved,
	}

	assert.Equal(t, expectedResponse["isOwner"], responseBody["isOwner"])
	assert.Equal(t, expectedResponse["isSaved"], responseBody["isSaved"])
	expectedArticle := expectedResponse["article"].(models.Articles)
	actualArticle := responseBody["article"].(map[string]interface{})

	assert.Equal(t, expectedArticle.Name, actualArticle["name"])
	assert.Equal(t, expectedArticle.Username, actualArticle["username"])
	assert.Equal(t, expectedArticle.Description, actualArticle["description"])
}

func TestGetArticle(t *testing.T) {
	mockService := new(mocks.ArticleService)
	app := setupArticleRouter(mockService)

	username := "testuser"
	articles := []models.Articles{
		{Name: "Article 1", Username: username},
		{Name: "Article 2", Username: username},
	}

	mockService.On("FindByUsername", username).Return(articles, nil)

	request := httptest.NewRequest("GET", "/articles", nil)
	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody []models.Articles
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.NoError(t, err)

	assert.Equal(t, len(articles), len(responseBody))
	for i, article := range articles {
		assert.Equal(t, article.Name, responseBody[i].Name)
	}
}

func TestGetArticleByUsername(t *testing.T) {
	mockService := new(mocks.ArticleService)
	app := setupArticleRouter(mockService)

	username := "testuser"
	articles := []models.Articles{
		{Name: "Article 1", Username: username},
		{Name: "Article 2", Username: username},
	}

	mockService.On("FindByUsername", username).Return(articles, nil)

	request := httptest.NewRequest("GET", fmt.Sprintf("/articles/user/%s", username), nil)
	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody []models.Articles
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.NoError(t, err)

	assert.Equal(t, len(articles), len(responseBody))
	for i, article := range articles {
		assert.Equal(t, article.Name, responseBody[i].Name)
	}
}

func TestGetArticlesByName(t *testing.T) {
	mockService := new(mocks.ArticleService)
	app := setupArticleRouter(mockService)

	name := "Test"
	articles := []models.Articles{
		{Name: "Test Article 1"},
		{Name: "Test Article 2"},
	}

	mockService.On("FindByName", name).Return(articles, nil)

	request := httptest.NewRequest("GET", fmt.Sprintf("/articles/name/%s", name), nil)
	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody []models.Articles
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.NoError(t, err)

	assert.Equal(t, len(articles), len(responseBody))
	for i, article := range articles {
		assert.Equal(t, article.Name, responseBody[i].Name)
	}
}

func TestGetArticlesFromGoogle(t *testing.T) {
	mockService := new(mocks.ArticleService)
	app := setupArticleRouter(mockService)

	query := "Google"
	username := "testuser"

	googleArticles := []services.ArticleSearch{
		{Title: "Google Article 1"},
		{Title: "Google Article 2"},
	}

	dbArticles := []models.Articles{
		{Name: "DB Article 1", Username: "anotheruser"},
		{Name: "DB Article 2", Username: "anotheruser"},
	}

	mockService.On("FindArticlesWithSimilarTitles", username, query).Return(dbArticles, nil)
	mockService.On("FetchArticlesFromGoogleSearch", query).Return(googleArticles, nil)

	request := httptest.NewRequest("GET", fmt.Sprintf("/google/googlesearch?query=%s", query), nil)

	token, err := createJWTToken(username)
	assert.NoError(t, err)
	request.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.NoError(t, err)

	expectedDBArticles := responseBody["database"].([]interface{})
	for i, dbArticle := range dbArticles {
		actualArticle := expectedDBArticles[i].(map[string]interface{})
		assert.Equal(t, dbArticle.Name, actualArticle["name"])
		assert.Equal(t, dbArticle.Username, actualArticle["username"])
	}

	expectedWebArticles := responseBody["web"].([]interface{})
	for i, webArticle := range googleArticles {
		actualArticle := expectedWebArticles[i].(map[string]interface{})
		assert.Equal(t, webArticle.Title, actualArticle["title"])
	}
}

func TestGetArticleInfoAndSuggestTags(t *testing.T) {
	mockService := new(mocks.ArticleService)
	app := setupArticleRouter(mockService)

	url := "http://example.com"
	article := &models.Articles{Name: "Sample Article"}

	mockService.On("GetArticleInfoAndSuggestTags", url).Return(article, nil)

	request := httptest.NewRequest("GET", fmt.Sprintf("/web/webscrap?url=%s", url), nil)
	resp, err := app.Test(request, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	bodyBytes, err := io.ReadAll(resp.Body)
	assert.NoError(t, err)

	var responseWrapper map[string]models.Articles
	err = json.Unmarshal(bodyBytes, &responseWrapper)
	assert.NoError(t, err)

	responseBody := responseWrapper["article"]
	assert.Equal(t, article.Name, responseBody.Name)
}
