package routes

import (
	"github.com/Victoria281/Espire/backend/controller"
	"github.com/Victoria281/Espire/backend/repo"
	"github.com/Victoria281/Espire/backend/services"
	"github.com/Victoria281/Espire/backend/storage"

	"github.com/gofiber/fiber/v2"
)

func ArticleRouter(router fiber.Router) {
	db := storage.GetDB()

	articleRepo := repo.NewArticleRepository(db)
	articleService := services.NewArticleService(articleRepo)
	articleController := &controller.ArticleController{
		Service: articleService,
	}

	articleQuoteRepo := repo.NewArticleQuoteRepository(db) // Assuming you have this repository
	articleQuoteService := services.NewArticleQuoteService(articleQuoteRepo)
	articleQuoteController := &controller.ArticleQuoteController{
		Service: articleQuoteService,
	}

	articleFlashcardRepo := repo.NewArticleFlashcardRepository(db) // Assuming you have this repository
	articleFlashcardService := services.NewArticleFlashcardService(articleFlashcardRepo)
	articleFlashcardController := &controller.ArticleFlashcardController{
		Service: articleFlashcardService,
	}

	router.Get("/:id", articleController.GetArticleByID)
	router.Get("/", articleController.GetArticle)
	router.Get("/username/:username", articleController.GetArticleByUsername)
	router.Get("/name/:name", articleController.GetArticlesByName)
	router.Post("/create", articleController.CreateNewArticle)
	router.Put("/:id", articleController.UpdateArticle)
	router.Delete("/:id", articleController.DeleteArticle)

	router.Post("/quotes", articleQuoteController.CreateQuote)
	router.Put("/quotes/:id", articleQuoteController.UpdateQuote)
	router.Delete("/quotes/:id", articleQuoteController.DeleteQuote)

	router.Post("/flashcards", articleFlashcardController.CreateFlashcard)
	router.Put("/flashcards/:id", articleFlashcardController.UpdateFlashcard)
	router.Delete("/flashcards/:id", articleFlashcardController.DeleteFlashcard)
}

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
