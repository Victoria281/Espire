package controller

import (
	"github.com/Victoria281/Espire/backend/services"
	"github.com/gofiber/fiber/v2"
)

type AuthController struct {
	Service services.AuthService
}

func (c *AuthController) Login(ctx *fiber.Ctx) error {
	var loginRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := ctx.BodyParser(&loginRequest); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	token, err := c.Service.Login(loginRequest.Username, loginRequest.Password)
	if err != nil {
		if err.Error() == "incorrect password" {
			return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Password is Wrong"})
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "User Not Found"})
	}

	return ctx.JSON(fiber.Map{"token": token})
}

func (c *AuthController) Register(ctx *fiber.Ctx) error {
	var registerRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := ctx.BodyParser(&registerRequest); err != nil {
		return err
	}
	if err := c.Service.Register(registerRequest.Username, registerRequest.Password); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return ctx.JSON(fiber.Map{"message": "User registered"})
}
