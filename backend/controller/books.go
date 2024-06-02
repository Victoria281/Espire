package controller

import (
	"strconv"

	"github.com/Victoria281/Espire/backend/services"
	"github.com/gofiber/fiber/v2"
)

type BookController struct {
	Service services.BookService
}

// http://localhost:8080/books
func (c *BookController) Get(ctx *fiber.Ctx) error {
	results := c.Service.GetAll()
	return ctx.JSON(results)
}

// http://localhost:8080/books/id/1
func (c *BookController) GetIdBy(ctx *fiber.Ctx) error {
	id, err := strconv.ParseInt(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString("Invalid ID")
	}
	result := c.Service.GetByID(id)
	return ctx.JSON(result)
}

// http://localhost:8080/books/name/osman
func (c *BookController) GetNameBy(ctx *fiber.Ctx) error {
	name := ctx.Params("name")
	result := c.Service.GetByName(name)
	return ctx.JSON(result)
}
