package services

import (
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/repo"
)

type UserService interface {
	GetUserIndex(username string) (uint, error)
	UpdatePassword(username, currentPassword, newPassword string) error
	DeleteUser(username string) error

	AddUserTag(username string, tagID uint) error
	RemoveUserTag(username string, tagID uint) error
	AddUserArticleVisit(username string, articleID uint) error
	GetUserArticleVisits(username string, limit int) ([]models.UserArticleVisit, error)
	GetUserTags(username string) ([]string, error)
}

type userService struct {
	repo repo.UserRepository
}

func NewUserService(repo repo.UserRepository) UserService {
	return &userService{
		repo: repo,
	}
}

func (s *userService) GetUserIndex(username string) (uint, error) {
	return s.repo.GetUserIndex(username)
}

func (s *userService) UpdatePassword(username, currentPassword, newPassword string) error {
	// Fetch user by username
	user, err := s.repo.SelectByUsername(username)
	if err != nil {
		return err
	}
	// Check if current password matches
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(currentPassword))
	if err != nil {
		return errors.New("incorrect current password")
	}
	// Hash the new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	// Update user's password
	user.Password = hashedPassword
	if err := s.repo.Update(user); err != nil {
		return err
	}
	return nil
}

func (s *userService) DeleteUser(username string) error {
	// Fetch user by username
	user, err := s.repo.SelectByUsername(username)
	if err != nil {
		return err
	}
	// Set deletedat to current time
	currentTime := time.Now()
	user.DeletedAt = &currentTime
	if err := s.repo.Update(user); err != nil {
		return err
	}
	return nil
}

func (s *userService) AddUserTag(username string, tagID uint) error {
	return s.repo.AddUserTag(username, tagID)
}

func (s *userService) RemoveUserTag(username string, tagID uint) error {
	return s.repo.RemoveUserTag(username, tagID)
}

func (s *userService) AddUserArticleVisit(username string, articleID uint) error {
	return s.repo.AddUserArticleVisit(username, articleID)
}

func (s *userService) GetUserArticleVisits(username string, limit int) ([]models.UserArticleVisit, error) {
	return s.repo.GetUserArticleVisits(username, limit)
}

func (s *userService) GetUserTags(username string) ([]string, error) {
	return s.repo.GetUserTags(username)
}
