package services

import (
	"time"

	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/repo"
)

type CollectionService interface {
	CreateCollection(username string, collection models.Collection) (uint, error)
	UpdateCollection(username string, id uint, collection *models.Collection) error
	GetCollection(username string) ([]models.Collection, error)
	AddArticle(collectionID uint, articleID uint) error
	RemoveArticle(collectionID uint, articleID uint) error
	Delete(collectionID uint) error
}

type collectionService struct {
	repo repo.CollectionRepository
}

func NewCollectionService(repo repo.CollectionRepository) CollectionService {
	return &collectionService{repo: repo}
}

func (s *collectionService) CreateCollection(username string, collection models.Collection) (uint, error) {
	newCollection := models.Collection{
		Username: username,
		Name:     collection.Name,
	}
	index, err := s.repo.Create(newCollection)
	return index, err
}

func (s *collectionService) UpdateCollection(username string, id uint, collection *models.Collection) error {
	newCollection := &models.Collection{
		ID:        id,
		Username:  username,
		Name:      collection.Name,
		UpdatedAt: time.Now(),
	}
	err := s.repo.Update(id, newCollection)
	return err
}

func (s *collectionService) GetCollection(username string) ([]models.Collection, error) {
	return s.repo.FindAll(username)
}

func (s *collectionService) AddArticle(collectionID uint, articleID uint) error {
	return s.repo.AddArticle(collectionID, articleID)
}

func (s *collectionService) RemoveArticle(collectionID uint, articleID uint) error {
	return s.repo.RemoveArticle(collectionID, articleID)
}

func (s *collectionService) Delete(collectionID uint) error {
	return s.repo.Delete(collectionID)
}
