package services

import (
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/repo"
)

type ArticleFlashcardService interface {
	CreateFlashcard(articleID uint, answer string, question string, tries int, wrong int) error
	UpdateFlashcard(flashcardID uint, updatedFlashcard models.ArticleFlashcards) error
	DeleteFlashcard(flashcardID uint) error
}

type articleFlashcardService struct {
	repo repo.ArticleFlashcardRepository
}

func NewArticleFlashcardService(repo repo.ArticleFlashcardRepository) ArticleFlashcardService {
	return &articleFlashcardService{repo: repo}
}

func (s *articleFlashcardService) CreateFlashcard(articleID uint, answer string, question string, tries int, wrong int) error {
	newFlashcard := models.ArticleFlashcards{
		ArticleID: articleID,
		Answer:    answer,
		Question:  question,
	}
	return s.repo.CreateFlashcard(newFlashcard)
}

func (s *articleFlashcardService) UpdateFlashcard(flashcardID uint, updatedFlashcard models.ArticleFlashcards) error {
	return s.repo.UpdateFlashcard(flashcardID, updatedFlashcard)
}

func (s *articleFlashcardService) DeleteFlashcard(flashcardID uint) error {
	return s.repo.DeleteFlashcard(flashcardID)
}
