package controller

import (
	"strconv"

	"github.com/Victoria281/Espire/backend/auth"
	"github.com/Victoria281/Espire/backend/recommender"
	"github.com/Victoria281/Espire/backend/services"
	"github.com/gofiber/fiber/v2"
)

type UserController struct {
	Service        services.UserService
	ArticleService services.ArticleService
}

// http://localhost:8080/espire/users/update
func (c *UserController) UpdatePassword(ctx *fiber.Ctx) error {
	var updateRequest struct {
		Username    string `json:"username"`
		OldPassword string `json:"old_password"`
		NewPassword string `json:"new_password"`
	}
	if err := ctx.BodyParser(&updateRequest); err != nil {
		return err // Fiber will handle parsing errors automatically
	}
	err := c.Service.UpdatePassword(updateRequest.Username, updateRequest.OldPassword, updateRequest.NewPassword)
	if err != nil {
		return err // Service method errors will be handled by Fiber
	}
	return ctx.JSON(fiber.Map{"message": "Password updated successfully"})
}

// http://localhost:8080/espire/users/delete
func (c *UserController) Delete(ctx *fiber.Ctx) error {
	var deleteRequest struct {
		Username string `json:"username"`
	}
	if err := ctx.BodyParser(&deleteRequest); err != nil {
		return err // Fiber will handle parsing errors automatically
	}
	err := c.Service.DeleteUser(deleteRequest.Username)
	if err != nil {
		return err // Service method errors will be handled by Fiber
	}
	return ctx.JSON(fiber.Map{"message": "User deleted successfully"})
}

func (c *UserController) AddUserTag(ctx *fiber.Ctx) error {
	var request struct {
		Username string `json:"username"`
		TagID    uint   `json:"tag_id"`
	}
	if err := ctx.BodyParser(&request); err != nil {
		return err
	}
	if err := c.Service.AddUserTag(request.Username, request.TagID); err != nil {
		return err
	}
	return ctx.JSON(fiber.Map{"message": "Tag added successfully"})
}

func (c *UserController) RemoveUserTag(ctx *fiber.Ctx) error {
	var request struct {
		Username string `json:"username"`
		TagID    uint   `json:"tag_id"`
	}
	if err := ctx.BodyParser(&request); err != nil {
		return err
	}
	if err := c.Service.RemoveUserTag(request.Username, request.TagID); err != nil {
		return err
	}
	return ctx.JSON(fiber.Map{"message": "Tag removed successfully"})
}

func (c *UserController) AddUserArticleVisit(ctx *fiber.Ctx) error {
	var request struct {
		Username  string `json:"username"`
		ArticleID uint   `json:"article_id"`
	}
	if err := ctx.BodyParser(&request); err != nil {
		return err
	}
	if err := c.Service.AddUserArticleVisit(request.Username, request.ArticleID); err != nil {
		return err
	}
	return ctx.JSON(fiber.Map{"message": "Article visit recorded successfully"})
}

func (c *UserController) GetUserArticleVisits(ctx *fiber.Ctx) error {
	username := ctx.Query("username")
	limitStr := ctx.Query("limit", "20") // Default limit to 20
	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		return err
	}
	visits, err := c.Service.GetUserArticleVisits(username, limit)
	if err != nil {
		return err
	}
	return ctx.JSON(visits)
}

func (c *UserController) GetUserTags(ctx *fiber.Ctx) error {
	username := ctx.Query("username")
	tags, err := c.Service.GetUserTags(username)
	if err != nil {
		return err
	}
	return ctx.JSON(tags)
}

func (c *UserController) GetUserIndex(ctx *fiber.Ctx) error {
	username := ctx.Params("username")
	index, err := c.Service.GetUserIndex(username)
	if err != nil {
		return err
	}
	return ctx.JSON(fiber.Map{"index": index})
}

func (c *UserController) GetRecommendations(ctx *fiber.Ctx) error {
	username := auth.ParseUsername(ctx)

	uid, err := c.Service.GetUserIndex(username)
	if err != nil {
		return err
	}

	userTags, err := c.Service.GetUserTags(username)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get user tags"})
	}

	interactions, err := c.Service.GetUserArticleVisits(username, 20)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get user visits"})
	}

	// Fetch all articles from the repository
	articles, err := c.ArticleService.GetAllArticles()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get articles"})
	}

	// Get recommendations
	recommendations := recommender.GetHybridRecommendations(uid, userTags, interactions, articles)

	return ctx.JSON(fiber.Map{"recommendations": recommendations})
}
