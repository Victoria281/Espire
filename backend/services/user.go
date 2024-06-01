package services

import (
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/Victoria281/Espire/backend/repo"
)

type UserService interface {
	UpdatePassword(username, currentPassword, newPassword string) error
	DeleteUser(username string) error
}

type userService struct {
	repo repo.UserRepository
}

func NewUserService(repo repo.UserRepository) UserService {
	return &userService{
		repo: repo,
	}
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
