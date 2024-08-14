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
	user, err := s.repo.SelectByUsername(username)
	if err != nil {
		return "", err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", errors.New("incorrect password")
	}

	fmt.Println(user.Role)
	token, err := auth.GenerateJWT(user.Username, user.Role)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (s *authService) Register(username, password string) error {
	// Hash
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	_, err = s.repo.SelectByUsername(username)
	if err == nil {
		return errors.New("Username has been taken!")
	}

	newUser := models.Users{
		Username: username,
		Password: hashedPassword,
	}

	if err := s.repo.InsertUser(newUser); err != nil {
		return err
	}

	return nil
}
