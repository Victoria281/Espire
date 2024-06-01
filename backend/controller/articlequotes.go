package controller

import (
	"strconv"

	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/services"

	"github.com/gofiber/fiber/v2"
)

type ArticleQuoteController struct {
	Service services.ArticleQuoteService
}

func NewArticleQuoteController(service services.ArticleQuoteService) *ArticleQuoteController {
	return &ArticleQuoteController{Service: service}
}

func (c *ArticleQuoteController) CreateQuote(ctx *fiber.Ctx) error {
	var createRequest struct {
		ArticleID string `json:"article_id"`
		GroupNum  int    `json:"grp_num"`
		Priority  int    `json:"priority"`
		Fact      string `json:"fact"`
	}
	if err := ctx.BodyParser(&createRequest); err != nil {
		return err // Fiber will handle parsing errors automatically
	}

	articleID, err := strconv.ParseUint(createRequest.ArticleID, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid article ID"})
	}

	if err := c.Service.CreateQuote(uint(articleID), createRequest.GroupNum, createRequest.Priority, createRequest.Fact); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error creating quote"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Quote created successfully"})
}

func (c *ArticleQuoteController) UpdateQuote(ctx *fiber.Ctx) error {
	quoteID, err := strconv.ParseUint(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid quote ID"})
	}

	var updatedQuote models.ArticleQuotes
	if err := ctx.BodyParser(&updatedQuote); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := c.Service.UpdateQuote(uint(quoteID), updatedQuote); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error updating quote"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Quote updated successfully"})
}

func (c *ArticleQuoteController) DeleteQuote(ctx *fiber.Ctx) error {
	quoteID, err := strconv.ParseUint(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid quote ID"})
	}

	if err := c.Service.DeleteQuote(uint(quoteID)); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error deleting quote"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Quote deleted successfully"})
}
