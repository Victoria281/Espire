package controller

import (
	"fmt"
	"strconv"

	"github.com/Victoria281/Espire/backend/auth"
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/services"
	"github.com/gofiber/fiber/v2"
)

type ArticleController struct {
	Service services.ArticleService
}

func NewArticleController(service services.ArticleService) *ArticleController {
	return &ArticleController{Service: service}
}

func (c *ArticleController) GetArticleByID(ctx *fiber.Ctx) error {
	fmt.Println("GetArticleByID")

	id := ctx.Params("id")
	articleID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid article ID"})
	}

	article, err := c.Service.FindById(uint(articleID))
	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Article not found"})
	}

	return ctx.Status(fiber.StatusOK).JSON(article)
}

func (c *ArticleController) GetArticle(ctx *fiber.Ctx) error {
	fmt.Println("GetArticle")

	username := auth.ParseUsername(ctx)

	article, err := c.Service.FindByUsername(username)
	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Article not found"})
	}

	return ctx.Status(fiber.StatusOK).JSON(article)
}

func (c *ArticleController) GetArticleByUsername(ctx *fiber.Ctx) error {
	fmt.Println("GetArticleByUsername")
	username := ctx.Params("username")

	article, err := c.Service.FindByUsername(username)
	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Article not found"})
	}

	return ctx.Status(fiber.StatusOK).JSON(article)
}

func (c *ArticleController) GetArticlesByName(ctx *fiber.Ctx) error {
	fmt.Println("GetArticlesByName")

	name := ctx.Params("name")
	if name == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Name parameter is missing"})
	}

	articles, err := c.Service.FindByName(name)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error fetching articles"})
	}

	return ctx.Status(fiber.StatusOK).JSON(articles)
}

func (c *ArticleController) CreateNewArticle(ctx *fiber.Ctx) error {
	var article models.Articles
	username := auth.ParseUsername(ctx)
	if err := ctx.BodyParser(&article); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	index, err := c.Service.CreateNewArticle(username, article)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error creating article"})
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"id": index})
}
func (c *ArticleController) UpdateArticle(ctx *fiber.Ctx) error {

	username := auth.ParseUsername(ctx)
	id := ctx.Params("id")
	articleID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid article ID"})
	}
	var article models.Articles
	if err := ctx.BodyParser(&article); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := c.Service.UpdateArticle(username, uint(articleID), &article); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error updating article"})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Article updated successfully"})
}

func (c *ArticleController) DeleteArticle(ctx *fiber.Ctx) error {

	id := ctx.Params("id")
	articleID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid article ID"})
	}

	err = c.Service.DeleteArticle(uint(articleID))
	if err != nil {
		return err // Service method errors will be handled by Fiber
	}
	return ctx.JSON(fiber.Map{"message": "Article deleted successfully"})
}

func (c *ArticleController) GetSimilarArticles(ctx *fiber.Ctx) error {
	query := ctx.Query("query")

	googleArticles, err := c.Service.FetchArticlesFromGoogleScholar(query)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Check database for similar titles
	dbArticles, err := c.Service.FindArticlesWithSimilarTitles(query)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Format response
	response := map[string]interface{}{
		"database": dbArticles,
		"web":      googleArticles,
	}

	return ctx.Status(fiber.StatusOK).JSON(response)
}
