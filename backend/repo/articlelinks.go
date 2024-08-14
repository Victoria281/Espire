package repo

import (
	"github.com/Victoria281/Espire/backend/models"
	"gorm.io/gorm"
)

type ArticleLinkRepository interface {
	CreateLink(link models.ArticleLinks) error
	UpdateLink(linkID uint, updatedLink models.ArticleLinks) error
	DeleteLink(linkID uint) error
}

type articleLinkRepository struct {
	DB *gorm.DB
}

func NewArticleLinkRepository(db *gorm.DB) ArticleLinkRepository {
	return &articleLinkRepository{DB: db}
}

func (r *articleLinkRepository) CreateLink(link models.ArticleLinks) error {
	if err := r.DB.Create(&link).Error; err != nil {
		return err
	}
	return nil
}

func (r *articleLinkRepository) UpdateLink(linkID uint, updatedLink models.ArticleLinks) error {
	if err := r.DB.Model(&models.ArticleLinks{}).Where("deleted_at IS NULL").Where("id = ?", linkID).Updates(updatedLink).Error; err != nil {
		return err
	}
	return nil
}

func (r *articleLinkRepository) DeleteLink(linkID uint) error {
	if err := r.DB.Delete(&models.ArticleLinks{}, linkID).Error; err != nil {
		return err
	}
	return nil
}
