package mocks

import (
	"github.com/stretchr/testify/mock"
)

type ArticleLinkService struct {
	mock.Mock
}

func (m *ArticleLinkService) CreateLink(articleID uint, isMain bool, link string) error {
	args := m.Called(articleID, isMain, link)
	return args.Error(0)
}

func (m *ArticleLinkService) UpdateLink(articleID uint, linkID uint, isMain bool, link string) error {
	args := m.Called(articleID, linkID, isMain, link)
	return args.Error(0)
}

func (m *ArticleLinkService) DeleteLink(linkID uint) error {
	args := m.Called(linkID)
	return args.Error(0)
}
