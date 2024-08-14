package services

import (
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/repo"
)

type SynthesisService interface {
	CreateSynthesis(collectionID uint, key string, text string) (*models.Synthesis, error)
	DeleteSynthesis(id uint) error
}

type synthesisService struct {
	repo repo.SynthesisRepo
}

func NewSynthesisService(repo repo.SynthesisRepo) SynthesisService {
	return &synthesisService{repo: repo}
}

func (s *synthesisService) CreateSynthesis(collectionID uint, key string, text string) (*models.Synthesis, error) {
	synthesis := &models.Synthesis{
		CollectionID: collectionID,
		Key:          key,
		Text:         text,
	}
	return s.repo.CreateSynthesis(synthesis)
}

func (s *synthesisService) DeleteSynthesis(id uint) error {
	return s.repo.DeleteSynthesis(id)
}
