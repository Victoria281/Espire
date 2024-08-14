package controller

import (
	"strconv"

	"github.com/Victoria281/Espire/backend/services"
	"github.com/gofiber/fiber/v2"
)

type ArticleLinkController struct {
	Service services.ArticleLinkService
}

func NewArticleLinkController(service services.ArticleLinkService) *ArticleLinkController {
	return &ArticleLinkController{Service: service}
}

func (c *ArticleLinkController) CreateLink(ctx *fiber.Ctx) error {
	var createRequest struct {
		ArticleID string `json:"article_id"`
		Links     []struct {
			Link   string `json:"link"`
			IsMain bool   `json:"is_main"`
		} `json:"Links"`
	}
	if err := ctx.BodyParser(&createRequest); err != nil {
		return err
	}

	articleID, err := strconv.ParseUint(createRequest.ArticleID, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid article ID"})
	}

	for _, link := range createRequest.Links {
		if err := c.Service.CreateLink(uint(articleID), link.IsMain, link.Link); err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error creating link"})
		}
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Link created successfully"})
}

func (c *ArticleLinkController) UpdateLink(ctx *fiber.Ctx) error {
	var updateRequest struct {
		ArticleID string `json:"article_id"`
		Links     []struct {
			ID     uint   `json:"id"`
			Link   string `json:"link"`
			IsMain bool   `json:"is_main"`
		} `json:"Links"`
	}
	if err := ctx.BodyParser(&updateRequest); err != nil {
		return err
	}

	articleID, err := strconv.ParseUint(updateRequest.ArticleID, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid article ID"})
	}

	for _, link := range updateRequest.Links {
		if err := c.Service.UpdateLink(uint(articleID), link.ID, link.IsMain, link.Link); err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error updating link"})
		}
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Links updated successfully"})
}

func (c *ArticleLinkController) DeleteLink(ctx *fiber.Ctx) error {
	linkID, err := strconv.ParseUint(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid link ID"})
	}

	if err := c.Service.DeleteLink(uint(linkID)); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error deleting link"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Link deleted successfully"})
}
