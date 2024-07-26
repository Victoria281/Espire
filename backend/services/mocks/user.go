package mocks

import (
	"github.com/Victoria281/Espire/backend/models"
	"github.com/stretchr/testify/mock"
)

type UserService struct {
	mock.Mock
}

func (m *UserService) GetUserIndex(username string) (uint, error) {
	args := m.Called(username)
	return args.Get(0).(uint), args.Error(1)
}

func (m *UserService) UpdatePassword(username, currentPassword, newPassword string) error {
	args := m.Called(username, currentPassword, newPassword)
	return args.Error(0)
}

func (m *UserService) DeleteUser(username string) error {
	args := m.Called(username)
	return args.Error(0)
}

func (m *UserService) AddUserTag(username string, tagID uint) error {
	args := m.Called(username, tagID)
	return args.Error(0)
}

func (m *UserService) RemoveUserTag(username string, tagID uint) error {
	args := m.Called(username, tagID)
	return args.Error(0)
}

func (m *UserService) AddUserArticleVisit(username string, articleID uint) error {
	args := m.Called(username, articleID)
	return args.Error(0)
}

func (m *UserService) GetUserArticleVisits(username string, limit int) ([]models.UserArticleVisit, error) {
	args := m.Called(username, limit)
	return args.Get(0).([]models.UserArticleVisit), args.Error(1)
}

func (m *UserService) GetUserTags(username string) ([]struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}, error) {
	args := m.Called(username)
	return args.Get(0).([]struct {
		ID   uint   `json:"id"`
		Name string `json:"name"`
	}), args.Error(1)
}

func (m *UserService) FetchUserVisitScores(username string, articleIDs []uint) (map[uint]int, error) {
	args := m.Called(username, articleIDs)
	return args.Get(0).(map[uint]int), args.Error(1)
}

func (m *UserService) AddSavedArticle(username string, articleID uint) error {
	args := m.Called(username, articleID)
	return args.Error(0)
}

func (m *UserService) DeleteSavedArticle(username string, articleID uint) error {
	args := m.Called(username, articleID)
	return args.Error(0)
}

func (m *UserService) GetSavedArticles(username string) ([]models.Articles, error) {
	args := m.Called(username)
	return args.Get(0).([]models.Articles), args.Error(1)
}
