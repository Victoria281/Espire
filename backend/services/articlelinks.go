package services

import (
	"time"

	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/repo"
)

type ArticleLinkService interface {
	CreateLink(articleID uint, isMain bool, link string) error
	UpdateLink(articleID uint, linkID uint, isMain bool, link string) error
	DeleteLink(linkID uint) error
}

type articleLinkService struct {
	repo repo.ArticleLinkRepository
}

func NewArticleLinkService(repo repo.ArticleLinkRepository) ArticleLinkService {
	return &articleLinkService{repo: repo}
}

func (s *articleLinkService) CreateLink(articleID uint, isMain bool, link string) error {
	newLink := models.ArticleLinks{
		ArticleID: articleID,
		IsMain:    isMain,
		Link:      link,
	}
	return s.repo.CreateLink(newLink)
}

func (s *articleLinkService) UpdateLink(articleID uint, linkID uint, isMain bool, link string) error {
	updatedLink := models.ArticleLinks{
		ID:        linkID,
		ArticleID: articleID,
		IsMain:    isMain,
		Link:      link,
		UpdatedAt: time.Now(),
	}
	return s.repo.UpdateLink(linkID, updatedLink)
}

func (s *articleLinkService) DeleteLink(linkID uint) error {
	return s.repo.DeleteLink(linkID)
}
