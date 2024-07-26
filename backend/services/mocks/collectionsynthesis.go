package mocks

import (
	"github.com/Victoria281/Espire/backend/models"
	"github.com/stretchr/testify/mock"
)

type SynthesisService struct {
	mock.Mock
}

func (m *SynthesisService) CreateSynthesis(collectionID uint, key string, text string) (*models.Synthesis, error) {
	args := m.Called(collectionID, key, text)
	return args.Get(0).(*models.Synthesis), args.Error(1)
}

func (m *SynthesisService) DeleteSynthesis(id uint) error {
	args := m.Called(id)
	return args.Error(0)
}
