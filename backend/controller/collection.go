package controller

import (
	"fmt"
	"strconv"

	"github.com/Victoria281/Espire/backend/auth"
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/services"
	"github.com/gofiber/fiber/v2"
)

type CollectionController struct {
	Service services.CollectionService
}

func NewCollectionController(service services.CollectionService) *CollectionController {
	return &CollectionController{Service: service}
}

func (c *CollectionController) GetCollection(ctx *fiber.Ctx) error {
	fmt.Println("GetCollection")

	username := auth.ParseUsername(ctx)

	collections, err := c.Service.GetCollection(username)
	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Collections not found"})
	}

	return ctx.Status(fiber.StatusOK).JSON(collections)
}

func (c *CollectionController) CreateCollection(ctx *fiber.Ctx) error {
	var collection models.Collection
	username := auth.ParseUsername(ctx)
	if err := ctx.BodyParser(&collection); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	index, err := c.Service.CreateCollection(username, collection)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error creating collection"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"id": index})
}

func (c *CollectionController) UpdateCollection(ctx *fiber.Ctx) error {

	username := auth.ParseUsername(ctx)
	id := ctx.Params("id")
	collectionID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid collection ID"})
	}
	var collection models.Collection
	if err := ctx.BodyParser(&collection); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := c.Service.UpdateCollection(username, uint(collectionID), &collection); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error updating collection"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "collection updated successfully"})
}

func (c *CollectionController) AddArticleToCollection(ctx *fiber.Ctx) error {
	collectionID, err := strconv.ParseUint(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid collection ID"})
	}
	articleID, err := strconv.ParseUint(ctx.Params("article_id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid article ID"})
	}
	err = c.Service.AddArticle(uint(collectionID), uint(articleID))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error adding article to collection"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Article added to collection successfully"})
}

func (c *CollectionController) RemoveArticleFromCollection(ctx *fiber.Ctx) error {
	collectionID, err := strconv.ParseUint(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid collection ID"})
	}
	articleID, err := strconv.ParseUint(ctx.Params("article_id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid article ID"})
	}
	err = c.Service.RemoveArticle(uint(collectionID), uint(articleID))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error removing article from collection"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Article removed from collection successfully"})
}

func (c *CollectionController) DeleteCollection(ctx *fiber.Ctx) error {
	collectionID, err := strconv.ParseUint(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid collection ID"})
	}

	err = c.Service.Delete(uint(collectionID))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error deleting collection"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Collection deleted successfully"})
}
