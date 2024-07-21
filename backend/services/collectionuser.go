package services

import (
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/repo"
)

type CollectionUserService interface {
	SearchUser(query string) ([]struct {
		Username string `json:"username"`
	}, error)
	InviteUser(collectionID uint, username string) error
	RemoveUser(collectionID uint, username string) error
	GetInvitedUsers(collectionID uint) ([]struct {
		Username string `json:"username"`
	}, error)
	GetSharedCollections(username string) ([]models.Collection, error)
}

type collectionUserService struct {
	repo repo.CollectionUserRepository
}

func NewCollectionUserService(repo repo.CollectionUserRepository) CollectionUserService {
	return &collectionUserService{repo: repo}
}

func (s *collectionUserService) SearchUser(query string) ([]struct {
	Username string `json:"username"`
}, error) {
	return s.repo.SearchUser(query)
}

func (s *collectionUserService) InviteUser(collectionID uint, username string) error {
	return s.repo.InviteUser(collectionID, username)
}

func (s *collectionUserService) RemoveUser(collectionID uint, username string) error {
	return s.repo.RemoveUser(collectionID, username)
}

func (s *collectionUserService) GetInvitedUsers(collectionID uint) ([]struct {
	Username string `json:"username"`
}, error) {
	return s.repo.GetInvitedUsers(collectionID)
}

func (s *collectionUserService) GetSharedCollections(username string) ([]models.Collection, error) {
	return s.repo.GetSharedCollections(username)
}
