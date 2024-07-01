package services

import (
	"time"

	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/repo"
)

type ArticleFlashcardService interface {
	CreateFlashcard(articleID uint, answer string, question string) error
	UpdateFlashcard(flashcardID uint, answer *string, question *string, tries *int, wrong *int) error
	DeleteFlashcard(flashcardID uint) error
}

type articleFlashcardService struct {
	repo repo.ArticleFlashcardRepository
}

func NewArticleFlashcardService(repo repo.ArticleFlashcardRepository) ArticleFlashcardService {
	return &articleFlashcardService{repo: repo}
}

func (s *articleFlashcardService) CreateFlashcard(articleID uint, answer string, question string) error {
	newFlashcard := models.ArticleFlashcards{
		ArticleID: articleID,
		Answer:    answer,
		Question:  question,
	}
	return s.repo.CreateFlashcard(newFlashcard)
}

func (s *articleFlashcardService) UpdateFlashcard(flashcardID uint, answer *string, question *string, tries *int, wrong *int) error {
	updatedFlashcard := make(map[string]interface{})
	if answer != nil {
		updatedFlashcard["answer"] = *answer
	}
	if question != nil {
		updatedFlashcard["question"] = *question
	}
	if tries != nil {
		updatedFlashcard["tries"] = *tries
	}
	if wrong != nil {
		updatedFlashcard["wrong"] = *wrong
	}
	updatedFlashcard["updated_at"] = time.Now()
	if err := s.repo.UpdateFlashcard(flashcardID, updatedFlashcard); err != nil {
		return err
	}
	return nil
}

func (s *articleFlashcardService) DeleteFlashcard(flashcardID uint) error {
	return s.repo.DeleteFlashcard(flashcardID)
}
