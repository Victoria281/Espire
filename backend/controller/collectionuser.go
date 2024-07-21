package controller

import (
	"strconv"

	"github.com/Victoria281/Espire/backend/auth"
	"github.com/Victoria281/Espire/backend/services"
	"github.com/gofiber/fiber/v2"
)

type CollectionUserController struct {
	Service services.CollectionUserService
}

func (cuc *CollectionUserController) SearchUser(ctx *fiber.Ctx) error {
	query := ctx.Query("query")
	myusername := auth.ParseUsername(ctx)

	type userResponse struct {
		Username string `json:"username"`
	}

	users, err := cuc.Service.SearchUser(query)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	filteredUsers := make([]userResponse, 0)
	for _, user := range users {
		if user.Username != myusername {
			filteredUsers = append(filteredUsers, userResponse{Username: user.Username})
		}
	}

	return ctx.JSON(filteredUsers)
}

func (cuc *CollectionUserController) InviteUser(ctx *fiber.Ctx) error {
	var request struct {
		Username string `json:"username"`
	}
	if err := ctx.BodyParser(&request); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}
	collectionID, err := strconv.ParseUint(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid collection ID"})
	}

	myusername := auth.ParseUsername(ctx)
	if request.Username == myusername {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "You cannot invite yourself"})
	}

	if err := cuc.Service.InviteUser(uint(collectionID), request.Username); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return ctx.SendStatus(fiber.StatusOK)
}

func (cuc *CollectionUserController) RemoveUser(ctx *fiber.Ctx) error {
	var request struct {
		Username string `json:"username"`
	}
	if err := ctx.BodyParser(&request); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}
	collectionID, err := strconv.ParseUint(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid collection ID"})
	}

	myusername := auth.ParseUsername(ctx)
	if request.Username == myusername {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "You cannot remove yourself"})
	}

	if err := cuc.Service.RemoveUser(uint(collectionID), request.Username); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return ctx.SendStatus(fiber.StatusOK)
}

func (cuc *CollectionUserController) GetInvitedUsers(ctx *fiber.Ctx) error {
	collectionID, err := strconv.ParseUint(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid collection ID"})
	}
	users, err := cuc.Service.GetInvitedUsers(uint(collectionID))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return ctx.JSON(users)
}

func (cuc *CollectionUserController) GetSharedCollections(ctx *fiber.Ctx) error {
	username := auth.ParseUsername(ctx)

	collections, err := cuc.Service.GetSharedCollections(username)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error fetching shared collections"})
	}

	return ctx.Status(fiber.StatusOK).JSON(collections)
}
