package mocks

import (
	"github.com/stretchr/testify/mock"
)

type ArticleQuoteService struct {
	mock.Mock
}

func (m *ArticleQuoteService) CreateQuote(articleID uint, groupNum int, priority int, fact string) error {
	args := m.Called(articleID, groupNum, priority, fact)
	return args.Error(0)
}

func (m *ArticleQuoteService) UpdateQuote(articleID uint, quoteID uint, groupNum int, priority int, fact string) error {
	args := m.Called(articleID, quoteID, groupNum, priority, fact)
	return args.Error(0)
}

func (m *ArticleQuoteService) DeleteQuote(quoteID uint) error {
	args := m.Called(quoteID)
	return args.Error(0)
}
