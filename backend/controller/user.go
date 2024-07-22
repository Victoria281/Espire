package controller

import (
	"fmt"
	"math/rand"
	"strconv"
	"time"

	"github.com/Victoria281/Espire/backend/auth"
	"github.com/Victoria281/Espire/backend/models"
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
	username := auth.ParseUsername(ctx)
	var request struct {
		TagID uint `json:"tag_id"`
	}
	if err := ctx.BodyParser(&request); err != nil {
		return err
	}
	if err := c.Service.AddUserTag(username, request.TagID); err != nil {
		return err
	}
	return ctx.JSON(fiber.Map{"message": "Tag added successfully"})
}

func (c *UserController) RemoveUserTag(ctx *fiber.Ctx) error {
	username := auth.ParseUsername(ctx)

	id := ctx.Params("id")
	tagID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid tag ID"})
	}
	if err := c.Service.RemoveUserTag(username, uint(tagID)); err != nil {
		return err
	}
	return ctx.JSON(fiber.Map{"message": "Tag removed successfully"})
}

func (c *UserController) AddUserArticleVisit(ctx *fiber.Ctx) error {
	username := auth.ParseUsername(ctx)
	var request struct {
		ArticleID uint `json:"article_id"`
	}
	if err := ctx.BodyParser(&request); err != nil {
		return err
	}
	if err := c.Service.AddUserArticleVisit(username, request.ArticleID); err != nil {
		return err
	}
	return ctx.JSON(fiber.Map{"message": "Article visit recorded successfully"})
}

func (c *UserController) GetUserArticleVisits(ctx *fiber.Ctx) error {
	username := auth.ParseUsername(ctx)
	limitStr := ctx.Query("limit", "20")
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
	username := auth.ParseUsername(ctx)
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

	userTags, err := c.Service.GetUserTags(username)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get user tags"})
	}

	interactions, err := c.Service.GetUserArticleVisits(username, 20)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get user visits"})
	}

	articles, err := c.ArticleService.GetOtherArticles(username)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get articles"})
	}

	if len(articles) == 0 {
		return ctx.JSON(fiber.Map{"recommendations": []interface{}{}})
	}

	if len(userTags) == 0 || len(interactions) == 0 {
		randomRecommendations := c.getRandomRecommendations(articles)
		return ctx.JSON(fiber.Map{"recommendations": randomRecommendations})
	}

	articleIDs := make([]uint, len(articles))
	for i, article := range articles {
		articleIDs[i] = article.ID
	}
	visitScores, err := c.Service.FetchUserVisitScores(username, articleIDs)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch user visit scores"})
	}

	articleDetails, err := c.ArticleService.GetArticlesDetails(articleIDs)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch article details"})
	}

	X, y := recommender.GenerateFeatureMatrix(articleDetails, articles)

	coefficients := recommender.TrainLinearRegression(X, y)

	predictions := recommender.PredictRelevance(X, coefficients)

	fmt.Println("predictions")
	fmt.Println(predictions)
	maxIndex := 0
	maxValue := predictions[0]

	for i, pred := range predictions {
		if pred > maxValue {
			maxValue = pred
			maxIndex = i
		}
	}

	// Print the article with the highest prediction value
	fmt.Printf("The most relevant article is: %s\n", articles[maxIndex])

	recommendations := recommender.GetContentBasedRecommendations(username, userTags, interactions, articles, visitScores)

	return ctx.JSON(fiber.Map{"recommendations": recommendations})
}

func (c *UserController) getRandomRecommendations(articles []models.Articles) []models.Articles {
	shuffledArticles := shuffleArticles(articles)
	return shuffledArticles[:min(20, len(shuffledArticles))]
}

func shuffleArticles(articles []models.Articles) []models.Articles {
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(articles), func(i, j int) {
		articles[i], articles[j] = articles[j], articles[i]
	})
	return articles
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func (c *UserController) ToggleSavedArticle(ctx *fiber.Ctx) error {
	username := auth.ParseUsername(ctx)
	id := ctx.Params("id")
	articleID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid article ID"})
	}

	isSaved, err := c.ArticleService.IsArticleSavedByUser(username, uint(articleID))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Internal server error"})
	}

	if isSaved {
		if err := c.Service.DeleteSavedArticle(username, uint(articleID)); err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to unsave article"})
		}
		return ctx.JSON(fiber.Map{"message": "Article unsaved successfully"})
	} else {
		if err := c.Service.AddSavedArticle(username, uint(articleID)); err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save article"})
		}
		return ctx.JSON(fiber.Map{"message": "Article saved successfully"})
	}
}

func (c *UserController) GetSavedArticles(ctx *fiber.Ctx) error {
	username := auth.ParseUsername(ctx)
	articles, err := c.Service.GetSavedArticles(username)
	if err != nil {
		return err
	}
	return ctx.JSON(articles)
}
