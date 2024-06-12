package repo

import (
	"errors"
	"time"

	"github.com/Victoria281/Espire/backend/models"
	"gorm.io/gorm"
)

type TagRepository interface {
	Create(tag models.Tag) error
	GetByID(tagID uint) (models.Tag, error)
	GetAll() ([]models.Tag, error)
	DeleteArticleTags(articleID uint) error
	CreateArticleTag(articleID uint, tagID uint) error
	Delete(tagID uint) error
}

type tagSqlRepository struct {
	DB *gorm.DB
}

func NewTagRepository(db *gorm.DB) TagRepository {
	return &tagSqlRepository{DB: db}
}

func (r *tagSqlRepository) Create(tag models.Tag) error {
	return r.DB.Create(&tag).Error
}

func (r *tagSqlRepository) GetByID(tagID uint) (models.Tag, error) {
	var tag models.Tag
	err := r.DB.Where("id = ?", tagID).First(&tag).Error
	return tag, err
}

func (r *tagSqlRepository) GetAll() ([]models.Tag, error) {
	var tags []models.Tag
	err := r.DB.Where("deleted_at IS NULL").Find(&tags).Error
	return tags, err
}

func (r *tagSqlRepository) DeleteArticleTags(articleID uint) error {
	result := r.DB.Where("articles_id = ?", articleID).Delete(&models.TagArticles{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *tagSqlRepository) CreateArticleTag(articleID uint, tagID uint) error {
	newEntry := models.TagArticles{
		TagID:      tagID,
		ArticlesID: articleID,
	}
	return r.DB.Create(&newEntry).Error
}

func (r *tagSqlRepository) Delete(tagID uint) error {
	var count int64
	r.DB.Model(&models.TagArticles{}).Where("tag_id = ?", tagID).Count(&count)
	if count > 0 {
		return errors.New("Unable to delete tag as it is associated with one or more articles")
	}
	if err := r.DB.Model(&models.Tag{}).Where("id = ?", tagID).Updates(map[string]interface{}{
		"deleted_at": time.Now(),
	}).Error; err != nil {
		return err
	}
	return nil
}
