package routes

import (
	"github.com/Victoria281/Espire/backend/controller"
	"github.com/Victoria281/Espire/backend/repo"
	"github.com/Victoria281/Espire/backend/services"
	"github.com/Victoria281/Espire/backend/storage"

	"github.com/gofiber/fiber/v2"
)

func BookRouter(router fiber.Router) {
	db := storage.GetDB()

	bookRepo := repo.NewBookRepository(db)
	bookService := services.NewBookService(bookRepo)
	bookController := &controller.BookController{
		Service: bookService,
	}

	router.Get("/", bookController.Get)
	router.Get("/{id}", bookController.GetIdBy)
	router.Get("/{name}", bookController.GetNameBy)
}
