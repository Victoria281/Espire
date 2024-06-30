package routes

import (
	"github.com/Victoria281/Espire/backend/controller"
	"github.com/Victoria281/Espire/backend/middleware"
	"github.com/Victoria281/Espire/backend/repo"
	"github.com/Victoria281/Espire/backend/services"
	"github.com/Victoria281/Espire/backend/storage"

	"github.com/gofiber/fiber/v2"
)

func SetUpRoutes(router fiber.Router) {
	router.Use(middleware.PrintingDebugInfo)
}

func SecureRoutes(router fiber.Router) {
	router.Use(middleware.JWTMiddleware())
}

func AuthRouter(router fiber.Router) {
	router.Use(middleware.PrintingDebugInfo)
	db := storage.GetDB()

	userRepo := repo.NewUserRepository(db)
	authService := services.NewAuthService(userRepo)
	authController := &controller.AuthController{
		Service: authService,
	}

	router.Post("/login", authController.Login)
	router.Post("/register", authController.Register)
}

func UserRouter(router fiber.Router) {
	db := storage.GetDB()

	userRepo := repo.NewUserRepository(db)
	userService := services.NewUserService(userRepo)
	userController := &controller.UserController{
		Service: userService,
	}

	router.Put("/update", userController.UpdatePassword)
	router.Put("/delete", userController.Delete)

	router.Post("/add-tag", userController.AddUserTag)
	router.Delete("/remove-tag", userController.RemoveUserTag)
	router.Post("/add-visit", userController.AddUserArticleVisit)
	router.Get("/get-visits", userController.GetUserArticleVisits)
	router.Get("/get-tags", userController.GetUserTags)
}

func ArticleRouter(router fiber.Router) {
	db := storage.GetDB()

	articleRepo := repo.NewArticleRepository(db)
	articleService := services.NewArticleService(articleRepo)
	articleController := &controller.ArticleController{
		Service: articleService,
	}

	articleLinkRepo := repo.NewArticleLinkRepository(db)
	articleLinkService := services.NewArticleLinkService(articleLinkRepo)
	articleLinkController := &controller.ArticleLinkController{
		Service: articleLinkService,
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

	router.Get("/id/:id", articleController.GetArticleByID)
	router.Get("/", articleController.GetArticle)
	router.Get("/username/:username", articleController.GetArticleByUsername)
	router.Get("/name/:name", articleController.GetArticlesByName)
	router.Post("/create", articleController.CreateNewArticle)
	router.Put("/:id", articleController.UpdateArticle)
	router.Delete("/:id", articleController.DeleteArticle)

	router.Post("/links", articleLinkController.CreateLink)
	router.Put("/links/:id", articleLinkController.UpdateLink)
	router.Delete("/links/:id", articleLinkController.DeleteLink)

	router.Post("/quotes", articleQuoteController.CreateQuote)
	router.Put("/quotes/:id", articleQuoteController.UpdateQuote)
	router.Delete("/quotes/:id", articleQuoteController.DeleteQuote)

	router.Post("/flashcards", articleFlashcardController.CreateFlashcard)
	router.Put("/flashcards/:id", articleFlashcardController.UpdateFlashcard)
	router.Delete("/flashcards/:id", articleFlashcardController.DeleteFlashcard)

	router.Get("/search", articleController.GetSimilarArticles)
	router.Get("/googlesearch", articleController.GetArticlesFromGoogle)
	router.Get("/webscrap", articleController.GetArticleInfoAndSuggestTags)
}

func CollectionRouter(router fiber.Router) {
	db := storage.GetDB()

	collectionRepo := repo.NewCollectionRepository(db)
	collectionService := services.NewCollectionService(collectionRepo)
	collectionController := &controller.CollectionController{
		Service: collectionService,
	}

	router.Get("/", collectionController.GetCollection)
	router.Post("/", collectionController.CreateCollection)
	router.Put("/:id", collectionController.UpdateCollection)
	router.Post("/:id/articles/:article_id", collectionController.AddArticleToCollection)
	router.Delete("/:id/articles/:article_id", collectionController.RemoveArticleFromCollection)
	router.Delete("/:id", collectionController.DeleteCollection)
}

func TagRouter(router fiber.Router) {
	db := storage.GetDB()

	tagRepo := repo.NewTagRepository(db)
	tagService := services.NewTagService(tagRepo)
	tagController := &controller.TagController{
		Service: tagService,
	}

	router.Get("/", tagController.GetAllTags)
	router.Post("/", tagController.CreateTag)
	router.Put("/articles/:article_id", tagController.UpdateArticleTags)
	router.Delete("/:id", tagController.DeleteTag)
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
