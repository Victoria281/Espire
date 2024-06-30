package controller

import (
	"strconv"

	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/services"
	"github.com/gofiber/fiber/v2"
)

type TagController struct {
	Service services.TagService
}

func NewTagController(service services.TagService) *TagController {
	return &TagController{Service: service}
}

func (c *TagController) CreateTag(ctx *fiber.Ctx) error {
	var tag models.Tag
	if err := ctx.BodyParser(&tag); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	index, err := c.Service.CreateTag(tag)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error creating tag"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"id": index})
}

func (c *TagController) UpdateArticleTags(ctx *fiber.Ctx) error {
	articleID, err := strconv.ParseUint(ctx.Params("article_id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid article ID"})
	}

	type TagIDsRequestBody struct {
		TagIDs []uint `json:"tagids"`
	}
	var requestBody TagIDsRequestBody
	if err := ctx.BodyParser(&requestBody); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}
	tagIDs := requestBody.TagIDs

	if err := c.Service.UpdateArticleTags(uint(articleID), tagIDs); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error updating article tags"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Article tags updated successfully"})
}

func (c *TagController) GetAllTags(ctx *fiber.Ctx) error {
	tags, err := c.Service.GetAllTags()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error getting tags"})
	}
	return ctx.Status(fiber.StatusOK).JSON(tags)
}

func (c *TagController) DeleteTag(ctx *fiber.Ctx) error {
	tagID := ctx.Params("id")
	id, err := strconv.ParseUint(tagID, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid tag ID"})
	}
	if err := c.Service.DeleteTag(uint(id)); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Tag deleted successfully"})
}
