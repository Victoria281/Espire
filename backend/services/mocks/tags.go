package mocks

import (
	"github.com/Victoria281/Espire/backend/models"
	"github.com/stretchr/testify/mock"
)

type TagService struct {
	mock.Mock
}

func (m *TagService) CreateTag(tag models.Tag) (uint, error) {
	args := m.Called(tag)
	return args.Get(0).(uint), args.Error(1)
}

func (m *TagService) UpdateArticleTags(articleID uint, tagIDs []uint) error {
	args := m.Called(articleID, tagIDs)
	return args.Error(0)
}

func (m *TagService) GetAllTags() ([]models.Tag, error) {
	args := m.Called()
	return args.Get(0).([]models.Tag), args.Error(1)
}

func (m *TagService) DeleteTag(tagID uint) error {
	args := m.Called(tagID)
	return args.Error(0)
}

func (m *TagService) GetTagByName(name string) (models.Tag, error) {
	args := m.Called(name)
	return args.Get(0).(models.Tag), args.Error(1)
}
