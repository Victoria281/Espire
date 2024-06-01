package storage

import (
	"fmt"

	"github.com/Victoria281/Espire/backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Config struct {
	Host     string
	Port     string
	Password string
	User     string
	DBName   string
	SSLMode  string
}

var database *gorm.DB

func NewConnection(config *Config) *gorm.DB {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		config.Host, config.Port, config.User, config.Password, config.DBName, config.SSLMode,
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	database = db
	if err != nil {
		fmt.Println("could not load the database")
	}

	// Migrate the schema
	if models.MigrateBooks(database) != nil {
		fmt.Println("could not migrate book db")
	}
	if models.MigrateArticle(database) != nil {
		fmt.Println("could not migrate articles db")
	}
	fmt.Println("Connected to postgreSQL!")

	return database
}

func GetDB() *gorm.DB {
	if database == nil {
		fmt.Println("database not initialized")
	}
	return database
}
