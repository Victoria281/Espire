package mocks

import (
	"github.com/Victoria281/Espire/backend/models"
	"github.com/stretchr/testify/mock"
)

type CollectionService struct {
	mock.Mock
}

func (m *CollectionService) CreateCollection(username string, collection models.Collection) (uint, error) {
	args := m.Called(username, collection)
	return args.Get(0).(uint), args.Error(1)
}

func (m *CollectionService) UpdateCollection(username string, id uint, collection *models.Collection) error {
	args := m.Called(username, id, collection)
	return args.Error(0)
}

func (m *CollectionService) GetCollection(username string) ([]models.Collection, error) {
	args := m.Called(username)
	return args.Get(0).([]models.Collection), args.Error(1)
}

func (m *CollectionService) AddArticle(collectionID uint, articleID uint) error {
	args := m.Called(collectionID, articleID)
	return args.Error(0)
}

func (m *CollectionService) RemoveArticle(collectionID uint, articleID uint) error {
	args := m.Called(collectionID, articleID)
	return args.Error(0)
}

func (m *CollectionService) Delete(collectionID uint) error {
	args := m.Called(collectionID)
	return args.Error(0)
}
