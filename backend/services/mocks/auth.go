package mocks

import (
	"github.com/stretchr/testify/mock"
)

type AuthService struct {
	mock.Mock
}

func (m *AuthService) Login(username, password string) (string, error) {
	args := m.Called(username, password)
	return args.String(0), args.Error(1)
}

func (m *AuthService) Register(username, password string) error {
	args := m.Called(username, password)
	return args.Error(0)
}
