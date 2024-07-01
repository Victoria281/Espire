package controller

import (
	"strconv"

	"github.com/Victoria281/Espire/backend/services"

	"github.com/gofiber/fiber/v2"
)

type ArticleFlashcardController struct {
	Service services.ArticleFlashcardService
}

func NewArticleFlashcardController(service services.ArticleFlashcardService) *ArticleFlashcardController {
	return &ArticleFlashcardController{Service: service}
}

func (c *ArticleFlashcardController) CreateFlashcard(ctx *fiber.Ctx) error {
	var createRequest struct {
		ArticleID string `json:"article_id"`
		Answer    string `json:"answer"`
		Question  string `json:"question"`
	}
	if err := ctx.BodyParser(&createRequest); err != nil {
		return err // Fiber will handle parsing errors automatically
	}

	articleID, err := strconv.ParseUint(createRequest.ArticleID, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid article ID"})
	}

	if err := c.Service.CreateFlashcard(uint(articleID), createRequest.Answer, createRequest.Question); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error creating flashcard"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Flashcard created successfully"})
}

func (c *ArticleFlashcardController) UpdateFlashcard(ctx *fiber.Ctx) error {
	flashcardID, err := strconv.ParseUint(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid flashcard ID"})
	}

	type UpdateFlashcardRequest struct {
		Answer   *string `json:"answer"`
		Question *string `json:"question"`
		Tries    *int    `json:"tries"`
		Wrong    *int    `json:"wrong"`
	}

	var updatedFlashcard UpdateFlashcardRequest
	if err := ctx.BodyParser(&updatedFlashcard); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := c.Service.UpdateFlashcard(uint(flashcardID), updatedFlashcard.Answer, updatedFlashcard.Question, updatedFlashcard.Tries, updatedFlashcard.Wrong); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error updating flashcard"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Flashcard updated successfully"})
}

func (c *ArticleFlashcardController) DeleteFlashcard(ctx *fiber.Ctx) error {
	flashcardID, err := strconv.ParseUint(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid flashcard ID"})
	}

	if err := c.Service.DeleteFlashcard(uint(flashcardID)); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error deleting flashcard"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Flashcard deleted successfully"})
}
