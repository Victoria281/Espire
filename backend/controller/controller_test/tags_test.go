package controller_test

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http/httptest"
	"testing"

	"github.com/Victoria281/Espire/backend/controller"
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/services/mocks"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func setupTagRouter(mockTagService *mocks.TagService) *fiber.App {
	app := fiber.New()
	tagController := &controller.TagController{
		Service: mockTagService,
	}
	app.Post("/tags", tagController.CreateTag)
	app.Put("/articles/:article_id/tags", tagController.UpdateArticleTags)
	app.Get("/tags", tagController.GetAllTags)
	app.Delete("/tags/:id", tagController.DeleteTag)
	return app
}

func TestCreateTag(t *testing.T) {
	mockTagService := new(mocks.TagService)
	app := setupTagRouter(mockTagService)

	tag := models.Tag{Name: "testtag"}
	mockTagService.On("GetTagByName", tag.Name).Return(models.Tag{ID: 0}, nil)
	mockTagService.On("CreateTag", tag).Return(uint(1), nil)

	reqBody, _ := json.Marshal(tag)
	req := httptest.NewRequest("POST", "/tags", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusCreated, resp.StatusCode)

	var responseBody map[string]uint
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, uint(1), responseBody["id"])
}

func TestCreateTagAlreadyExists(t *testing.T) {
	mockTagService := new(mocks.TagService)
	app := setupTagRouter(mockTagService)

	tag := models.Tag{Name: "testtag"}
	mockTagService.On("GetTagByName", tag.Name).Return(models.Tag{ID: 1}, nil)

	reqBody, _ := json.Marshal(tag)
	req := httptest.NewRequest("POST", "/tags", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]uint
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, uint(1), responseBody["id"])
}

func TestUpdateArticleTags(t *testing.T) {
	mockTagService := new(mocks.TagService)
	app := setupTagRouter(mockTagService)

	articleID := uint(1)
	tagIDs := []uint{1, 2, 3}
	mockTagService.On("UpdateArticleTags", articleID, tagIDs).Return(nil)

	reqBody := struct {
		TagIDs []uint `json:"tagids"`
	}{TagIDs: tagIDs}
	reqBodyJson, _ := json.Marshal(reqBody)

	req := httptest.NewRequest("PUT", "/articles/1/tags", bytes.NewBuffer(reqBodyJson))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "Article tags updated successfully", responseBody["message"])
}

func TestGetAllTags(t *testing.T) {
	mockTagService := new(mocks.TagService)
	app := setupTagRouter(mockTagService)

	tags := []models.Tag{
		{ID: 1, Name: "tag1"},
		{ID: 2, Name: "tag2"},
	}
	mockTagService.On("GetAllTags").Return(tags, nil)

	req := httptest.NewRequest("GET", "/tags", nil)
	resp, err := app.Test(req, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody []models.Tag
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, tags, responseBody)
}

func TestDeleteTag(t *testing.T) {
	mockTagService := new(mocks.TagService)
	app := setupTagRouter(mockTagService)

	tagID := uint(1)
	mockTagService.On("DeleteTag", tagID).Return(nil)

	req := httptest.NewRequest("DELETE", "/tags/1", nil)
	resp, err := app.Test(req, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "Tag deleted successfully", responseBody["message"])
}

func TestDeleteTagBadRequest(t *testing.T) {
	mockTagService := new(mocks.TagService)
	app := setupTagRouter(mockTagService)

	tagID := uint(1)
	mockTagService.On("DeleteTag", tagID).Return(errors.New("error deleting tag"))

	req := httptest.NewRequest("DELETE", "/tags/1", nil)
	resp, err := app.Test(req, -1)
	assert.NoError(t, err)
	assert.Equal(t, fiber.StatusInternalServerError, resp.StatusCode)

	var responseBody map[string]string
	json.NewDecoder(resp.Body).Decode(&responseBody)
	assert.Equal(t, "error deleting tag", responseBody["error"])
}
