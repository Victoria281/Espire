package repo

import (
	"github.com/Victoria281/Espire/backend/models"

	"gorm.io/gorm"
)

type ArticleFlashcardRepository interface {
	CreateFlashcard(flashcard models.ArticleFlashcards) error
	UpdateFlashcard(flashcardID uint, updatedFlashcard models.ArticleFlashcards) error
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

func (r *articleFlashcardRepository) UpdateFlashcard(flashcardID uint, updatedFlashcard models.ArticleFlashcards) error {
	if err := r.DB.Where("id = ?", flashcardID).Save(&updatedFlashcard).Error; err != nil {
		return err
	}
	return nil
}

func (r *articleFlashcardRepository) DeleteFlashcard(flashcardID uint) error {
	if err := r.DB.Delete(&models.ArticleFlashcards{}, flashcardID).Error; err != nil {
		return err
	}
	return nil
}
