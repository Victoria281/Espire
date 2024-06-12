package services

import (
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/repo"
)

type TagService interface {
	CreateTag(tag models.Tag) error
	UpdateArticleTags(articleID uint, tagIDs []uint) error
	GetAllTags() ([]models.Tag, error)
	DeleteTag(tagID uint) error
}

type tagService struct {
	repo repo.TagRepository
}

func NewTagService(repo repo.TagRepository) TagService {
	return &tagService{repo: repo}
}

func (s *tagService) CreateTag(tag models.Tag) error {
	newTag := models.Tag{
		Name: tag.Name,
	}
	return s.repo.Create(newTag)
}

func (s *tagService) UpdateArticleTags(articleID uint, tagIDs []uint) error {
	if err := s.repo.DeleteArticleTags(articleID); err != nil {
		return err
	}

	for _, tagID := range tagIDs {
		if err := s.repo.CreateArticleTag(articleID, tagID); err != nil {
			return err
		}
	}

	return nil
}

func (s *tagService) GetAllTags() ([]models.Tag, error) {
	return s.repo.GetAll()
}

func (s *tagService) DeleteTag(tagID uint) error {
	return s.repo.Delete(tagID)
}
