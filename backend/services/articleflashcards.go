package services

import (
	"regexp"
	"strings"
	"time"

	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/repo"
)

type ArticleFlashcardService interface {
	CreateFlashcard(articleID uint, answer string, question string) error
	UpdateFlashcard(articleID uint, flashcardID uint, answer *string, question *string, tries *int, wrong *int) error
	DeleteFlashcard(flashcardID uint) error
	GenerateFlashcardsFromQuotes(articleID uint) ([]models.ArticleFlashcards, error)
}

var (
	numberPattern = regexp.MustCompile(`\d+`)
	datePattern   = regexp.MustCompile(`\b\d{4}-\d{2}-\d{2}\b|\b\d{2}/\d{2}/\d{4}\b`)
)

type articleFlashcardService struct {
	repo      repo.ArticleFlashcardRepository
	quoteRepo repo.ArticleQuoteRepository
}

func NewArticleFlashcardService(repo repo.ArticleFlashcardRepository, quoteRepo repo.ArticleQuoteRepository) ArticleFlashcardService {
	return &articleFlashcardService{repo: repo, quoteRepo: quoteRepo}
}

func (s *articleFlashcardService) CreateFlashcard(articleID uint, answer string, question string) error {
	newFlashcard := models.ArticleFlashcards{
		ArticleID: articleID,
		Answer:    answer,
		Question:  question,
	}
	return s.repo.CreateFlashcard(newFlashcard)
}

func (s *articleFlashcardService) UpdateFlashcard(articleID uint, flashcardID uint, answer *string, question *string, tries *int, wrong *int) error {
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

func (s *articleFlashcardService) GenerateFlashcardsFromQuotes(articleID uint) ([]models.ArticleFlashcards, error) {
	var quotes []models.ArticleQuotes
	if err := s.quoteRepo.GetQuotesByArticleID(articleID, &quotes); err != nil {
		return nil, err
	}

	var flashcards []models.ArticleFlashcards

	for _, quote := range quotes {
		question, answer := createQuestionAndAnswerFromQuote(quote.Fact)

		flashcard := models.ArticleFlashcards{
			ArticleID: articleID,
			Question:  question,
			Answer:    answer,
		}

		// Add to the list of generated flashcards
		flashcards = append(flashcards, flashcard)
	}

	return flashcards, nil
}

// Create question and answer by extracting keywords
func createQuestionAndAnswerFromQuote(quote string) (string, string) {
	// Extract keywords or phrases
	keywords := extractKeywords(quote)

	// Create question by removing keywords from the quote
	question := quote
	for _, keyword := range keywords {
		question = strings.ReplaceAll(question, keyword, "[...]")
	}

	// Create answer as a comma-separated list of keywords
	answer := strings.Join(keywords, ", ")

	return question, answer
}

// Extract keywords or relevant phrases from the quote
func extractKeywords(quote string) []string {
	// Example of keyword extraction logic
	// Here, you would use a more sophisticated NLP library or API for better results

	// Simple approach: Extract words that are capitalized or considered important
	words := strings.Fields(quote)
	var keywords []string
	for _, word := range words {
		if isCapitalized(word) && !isCommonWord(word) {
			keywords = append(keywords, word)
		}
	}

	return keywords
}

// Check if the word is capitalized (naive approach)
func isCapitalized(word string) bool {
	if len(word) > 0 {
		return word[0] >= 'A' && word[0] <= 'Z'
	}
	return false
}

// Check if the word is common (naive approach)
func isCommonWord(word string) bool {
	commonWords := map[string]bool{
		"the": true, "is": true, "in": true, "and": true, "of": true,
	}
	return commonWords[strings.ToLower(word)]
}
