package repo

import (
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/storage"

	"gorm.io/gorm"
)

type BookRepository interface {
	Select(query string) []models.Books
	SelectById(query string, id int64) models.Books
	SelectByName(query string, name string) models.Books
}

type bookSqlRepository struct {
	DB *gorm.DB
}

func NewBookRepository(db *gorm.DB) BookRepository {
	return &bookSqlRepository{DB: storage.GetDB()}
}

func (m *bookSqlRepository) Select(query string) []models.Books {
	result := []models.Books{}
	m.DB.Raw(query).Scan(&result)
	return result
}

func (m *bookSqlRepository) SelectById(query string, id int64) models.Books {
	result := models.Books{}
	m.DB.Raw(query, id).Scan(&result)
	return result
}

func (m *bookSqlRepository) SelectByName(query string, name string) models.Books {
	result := models.Books{}
	m.DB.Raw(query, name).Scan(&result)
	return result
}
