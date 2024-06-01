package controller

import (
	"github.com/Victoria281/Espire/backend/services"
	"github.com/gofiber/fiber/v2"
)

type UserController struct {
	Service services.UserService
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
