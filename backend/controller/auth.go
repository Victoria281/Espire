package controller

import (
	"github.com/Victoria281/Espire/backend/services"
	"github.com/gofiber/fiber/v2"
)

type AuthController struct {
	Service services.AuthService
}

// http://localhost:8080/auth/login
func (c *AuthController) Login(ctx *fiber.Ctx) error {
	var loginRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := ctx.BodyParser(&loginRequest); err != nil {
		return err
	}
	token, err := c.Service.Login(loginRequest.Username, loginRequest.Password)
	if err != nil {
		return err
	}
	return ctx.JSON(fiber.Map{"token": token})
}

// http://localhost:8080/auth/register
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
