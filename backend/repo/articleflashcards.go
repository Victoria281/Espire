package repo

import (
	"time"

	"github.com/Victoria281/Espire/backend/models"

	"gorm.io/gorm"
)

type ArticleFlashcardRepository interface {
	CreateFlashcard(flashcard models.ArticleFlashcards) error
	UpdateFlashcard(flashcardID uint, updatedFlashcard interface{}) error
	DeleteFlashcard(flashcardID uint) error
}

type articleFlashcardRepository struct {
	DB *gorm.DB
}

func NewArticleFlashcardRepository(db *gorm.DB) ArticleFlashcardRepository {
	return &articleFlashcardRepository{DB: db}
}

func (r *articleFlashcardRepository) CreateFlashcard(flashcard models.ArticleFlashcards) error {
	if err := r.DB.Create(&flashcard).Error; err != nil {
		return err
	}
	return nil
}

func (r *articleFlashcardRepository) UpdateFlashcard(flashcardID uint, updatedFlashcard interface{}) error {
	if err := r.DB.Debug().Model(&models.ArticleFlashcards{}).Where("deleted_at IS NULL").Where("id = ?", flashcardID).UpdateColumns(updatedFlashcard).Error; err != nil {
		return err
	}
	return nil
}

func (r *articleFlashcardRepository) DeleteFlashcard(flashcardID uint) error {
	if err := r.DB.Model(&models.ArticleFlashcards{}).Where("id = ?", flashcardID).Updates(map[string]interface{}{
		"deleted_at": time.Now(),
	}).Error; err != nil {
		return err
	}
	return nil
}
