package services

import (
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/repo"
)

type ArticleQuoteService interface {
	CreateQuote(articleID uint, groupNum int, priority int, fact string) error
	UpdateQuote(articleID uint, quoteID uint, groupNum int, priority int, fact string) error
	DeleteQuote(quoteID uint) error
}

type articleQuoteService struct {
	repo repo.ArticleQuoteRepository
}

func NewArticleQuoteService(repo repo.ArticleQuoteRepository) ArticleQuoteService {
	return &articleQuoteService{repo: repo}
}

func (s *articleQuoteService) CreateQuote(articleID uint, groupNum int, priority int, fact string) error {
	newQuote := models.ArticleQuotes{
		ArticleID: articleID,
		GroupNum:  groupNum,
		Priority:  priority,
		Fact:      fact,
	}
	return s.repo.CreateQuote(newQuote)
}

func (s *articleQuoteService) UpdateQuote(articleID uint, quoteID uint, groupNum int, priority int, fact string) error {
	updatedQuote := models.ArticleQuotes{
		ID:        quoteID,
		ArticleID: articleID,
		GroupNum:  groupNum,
		Priority:  priority,
		Fact:      fact,
	}
	return s.repo.UpdateQuote(quoteID, updatedQuote)
}

func (s *articleQuoteService) DeleteQuote(quoteID uint) error {
	return s.repo.DeleteQuote(quoteID)
}
