package mocks

import (
	"github.com/Victoria281/Espire/backend/models"
	"github.com/stretchr/testify/mock"
)

type CollectionUserService struct {
	mock.Mock
}

func (m *CollectionUserService) SearchUser(query string) ([]struct {
	Username string `json:"username"`
}, error) {
	args := m.Called(query)
	return args.Get(0).([]struct {
		Username string `json:"username"`
	}), args.Error(1)
}

func (m *CollectionUserService) InviteUser(collectionID uint, username string) error {
	args := m.Called(collectionID, username)
	return args.Error(0)
}

func (m *CollectionUserService) RemoveUser(collectionID uint, username string) error {
	args := m.Called(collectionID, username)
	return args.Error(0)
}

func (m *CollectionUserService) GetInvitedUsers(collectionID uint) ([]struct {
	Username string `json:"username"`
}, error) {
	args := m.Called(collectionID)
	return args.Get(0).([]struct {
		Username string `json:"username"`
	}), args.Error(1)
}

func (m *CollectionUserService) GetSharedCollections(username string) ([]models.Collection, error) {
	args := m.Called(username)
	return args.Get(0).([]models.Collection), args.Error(1)
}
