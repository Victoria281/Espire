package services

import (
	"errors"
	"fmt"

	"golang.org/x/crypto/bcrypt"

	"github.com/Victoria281/Espire/backend/auth"
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/repo"
)

type AuthService interface {
	Login(username, password string) (string, error)
	Register(username, password string) error
}

type authService struct {
	repo repo.UserRepository
}

func NewAuthService(repo repo.UserRepository) AuthService {
	return &authService{
		repo: repo,
	}
}

func (s *authService) Login(username, password string) (string, error) {
	// Retrieve user by username
	user, err := s.repo.SelectByUsername(username)
	if err != nil {
		return "", err
	}

	// Compare hashed password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", errors.New("incorrect password")
	}

	// Generate JWT token
	fmt.Println(user.Role)
	token, err := auth.GenerateJWT(user.Username, user.Role)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (s *authService) Register(username, password string) error {
	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	// Check if user already exists
	_, err = s.repo.SelectByUsername(username)
	if err == nil {
		return errors.New("user already exists")
	}

	// Create new user
	newUser := models.Users{
		Username: username,
		Password: hashedPassword,
	}
	if err := s.repo.InsertUser(newUser); err != nil {
		return err
	}

	return nil
}
