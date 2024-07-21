package controller

import (
	"github.com/gofiber/fiber/v2"
)

type TestController struct {
}

func (c *TestController) HealthCheck(ctx *fiber.Ctx) error {
	return ctx.Status(fiber.StatusOK).SendString("Backend is running")
}
