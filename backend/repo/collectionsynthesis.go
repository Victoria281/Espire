package repo

import (
	"github.com/Victoria281/Espire/backend/models"
	"gorm.io/gorm"
)

type SynthesisRepo interface {
	CreateSynthesis(synthesis *models.Synthesis) (*models.Synthesis, error)
	DeleteSynthesis(id uint) error
}

type synthesisRepo struct {
	DB *gorm.DB
}

func NewSynthesisRepo(db *gorm.DB) SynthesisRepo {
	return &synthesisRepo{DB: db}
}

func (r *synthesisRepo) CreateSynthesis(synthesis *models.Synthesis) (*models.Synthesis, error) {
	if err := r.DB.Create(synthesis).Error; err != nil {
		return nil, err
	}
	return synthesis, nil
}

func (r *synthesisRepo) DeleteSynthesis(id uint) error {
	if err := r.DB.Delete(&models.Synthesis{}, id).Error; err != nil {
		return err
	}
	return nil
}
