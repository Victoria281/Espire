package main

import (
	"log"
	"os"

	"github.com/Victoria281/Espire/backend/routes"
	"github.com/Victoria281/Espire/backend/storage"
	"github.com/joho/godotenv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Panic(err)
	}

	config := &storage.Config{
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		Password: os.Getenv("DB_PASS"),
		User:     os.Getenv("DB_USER"),
		SSLMode:  os.Getenv("DB_SSLMODE"),
		DBName:   os.Getenv("DB_NAME"),
	}

	storage.NewConnection(config)

	app := fiber.New()

	app.Use(cors.New())

	espireApi := app.Group("/espire")
	routes.SetUpRoutes(espireApi)

	app.Use(cors.New())
	//public routes
	routes.AuthRouter(espireApi.Group("/auth"))

	// Protected routes
	routes.SecureRoutes(espireApi)
	routes.BookRouter(espireApi.Group("/books"))
	routes.UserRouter(espireApi.Group("/users"))
	routes.ArticleRouter(espireApi.Group("/articles"))
	routes.CollectionRouter(espireApi.Group("/collections"))

	app.Listen(":8080")
}
