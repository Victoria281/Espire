package main

import (
	"log"
	"os"

	"github.com/Victoria281/Espire/backend/routes"
	"github.com/Victoria281/Espire/backend/storage"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
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
	espireApi := app.Group("/espire")
	routes.SetUpRoutes(espireApi)

	//public routes
	routes.AuthRouter(espireApi.Group("/auth"))

	// Protected routes
	routes.SecureRoutes(espireApi)
	routes.BookRouter(espireApi.Group("/books"))
	routes.UserRouter(espireApi.Group("/users"))
	routes.ArticleRouter(espireApi.Group("/articles"))

	app.Listen(":8080")
}
