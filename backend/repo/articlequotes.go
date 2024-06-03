package repo

import (
	"github.com/Victoria281/Espire/backend/models"

	"gorm.io/gorm"
)

type ArticleQuoteRepository interface {
	CreateQuote(quote models.ArticleQuotes) error
	UpdateQuote(quoteID uint, updatedQuote models.ArticleQuotes) error
	DeleteQuote(quoteID uint) error
}

type articleQuoteRepository struct {
	DB *gorm.DB
}

func NewArticleQuoteRepository(db *gorm.DB) ArticleQuoteRepository {
	return &articleQuoteRepository{DB: db}
}

func (r *articleQuoteRepository) CreateQuote(quote models.ArticleQuotes) error {
	if err := r.DB.Create(&quote).Error; err != nil {
		return err
	}
	return nil
}

func (r *articleQuoteRepository) UpdateQuote(quoteID uint, updatedQuote models.ArticleQuotes) error {
	if err := r.DB.Model(&models.ArticleQuotes{}).Where("deleted_at IS NULL").Where("id = ?", quoteID).Updates(updatedQuote).Error; err != nil {
		return err
	}
	return nil
}

func (r *articleQuoteRepository) DeleteQuote(quoteID uint) error {
	if err := r.DB.Delete(&models.ArticleQuotes{}, quoteID).Error; err != nil {
		return err
	}
	return nil
}
