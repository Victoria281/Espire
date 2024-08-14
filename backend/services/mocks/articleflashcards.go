package mocks

import (
	"github.com/Victoria281/Espire/backend/models"
	"github.com/stretchr/testify/mock"
)

type ArticleFlashcardService struct {
	mock.Mock
}

func (m *ArticleFlashcardService) CreateFlashcard(articleID uint, answer string, question string) error {
	args := m.Called(articleID, answer, question)
	return args.Error(0)
}

func (m *ArticleFlashcardService) UpdateFlashcard(articleID uint, flashcardID uint, answer *string, question *string, tries *int, wrong *int) error {
	args := m.Called(articleID, flashcardID, answer, question, tries, wrong)
	return args.Error(0)
}

func (m *ArticleFlashcardService) DeleteFlashcard(flashcardID uint) error {
	args := m.Called(flashcardID)
	return args.Error(0)
}

func (m *ArticleFlashcardService) GenerateFlashcardsFromQuotes(articleID uint) ([]models.ArticleFlashcards, error) {
	args := m.Called(articleID)
	return args.Get(0).([]models.ArticleFlashcards), args.Error(1)
}
