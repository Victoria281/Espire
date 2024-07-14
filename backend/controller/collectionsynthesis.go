package controller

import (
	"strconv"

	"github.com/Victoria281/Espire/backend/services"
	"github.com/gofiber/fiber/v2"
)

type SynthesisController struct {
	Service services.SynthesisService
}

func NewSynthesisController(service services.SynthesisService) *SynthesisController {
	return &SynthesisController{Service: service}
}

func (c *SynthesisController) CreateSynthesis(ctx *fiber.Ctx) error {

	var request struct {
		CollectionID uint   `json:"collectionid" binding:"required"`
		Key          string `json:"key" binding:"required"`
		Text         string `json:"text" binding:"required"`
	}

	if err := ctx.BodyParser(&request); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	synthesis, err := c.Service.CreateSynthesis(request.CollectionID, request.Key, request.Text)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error creating synthesis"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(synthesis)
}

func (c *SynthesisController) DeleteSynthesis(ctx *fiber.Ctx) error {
	id, err := strconv.ParseUint(ctx.Params("id"), 10, 32)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid synthesis ID"})
	}

	if err := c.Service.DeleteSynthesis(uint(id)); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error deleting synthesis"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Synthesis deleted successfully"})
}
