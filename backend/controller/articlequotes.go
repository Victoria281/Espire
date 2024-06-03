package controller

import (
	"strconv"

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
		Quotes    []struct {
			GroupNum int    `json:"grp_num"`
			Priority int    `json:"priority"`
			Fact     string `json:"fact"`
		} `json:"Quotes"`
	}
	if err := ctx.BodyParser(&createRequest); err != nil {
		return err
	}

	articleID, err := strconv.ParseUint(createRequest.ArticleID, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid article ID"})
	}

	for _, quote := range createRequest.Quotes {
		if err := c.Service.CreateQuote(uint(articleID), quote.GroupNum, quote.Priority, quote.Fact); err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error creating quote"})
		}
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Quotes created successfully"})
}

func (c *ArticleQuoteController) UpdateQuote(ctx *fiber.Ctx) error {
	var updateRequest struct {
		ArticleID string `json:"article_id"`
		Quotes    []struct {
			ID       uint   `json:"id"`
			GroupNum int    `json:"grp_num"`
			Priority int    `json:"priority"`
			Fact     string `json:"fact"`
		} `json:"Quotes"`
	}
	if err := ctx.BodyParser(&updateRequest); err != nil {
		return err
	}

	articleID, err := strconv.ParseUint(updateRequest.ArticleID, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid article ID"})
	}

	for _, quote := range updateRequest.Quotes {
		if err := c.Service.UpdateQuote(uint(articleID), quote.ID, quote.GroupNum, quote.Priority, quote.Fact); err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error updating quote"})
		}
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Quotes updated successfully"})
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
