package repo

import (
	"fmt"
	"time"

	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/storage"

	"gorm.io/gorm"
)

const defaultCheck = "deleted_at IS NULL"

type ArticleRepository interface {
	SelectByField(field string, value interface{}) ([]models.Articles, error)
	Create(article models.Articles) (uint, error)
	Update(articleID uint, updatedArticle interface{}) error
	Delete(articleID uint) error
	FindArticlesWithSimilarTitles(string) ([]models.Articles, error)
}

type articleSqlRepository struct {
	DB *gorm.DB
}

func NewArticleRepository(db *gorm.DB) ArticleRepository {
	return &articleSqlRepository{DB: storage.GetDB()}
}

func (m *articleSqlRepository) SelectByField(field string, value interface{}) ([]models.Articles, error) {
	var articles []models.Articles
	if err := m.DB.Preload("Links").Preload("Quotes").Preload("Flashcards").Preload("Collections").Where(field+" = ?", value).Where(defaultCheck).Find(&articles).Error; err != nil {
		return nil, err
	}
	return articles, nil
}

func (m *articleSqlRepository) Create(article models.Articles) (uint, error) {
	if err := m.DB.Create(&article).Error; err != nil {
		return 0, err
	}
	return article.ID, nil
}

func (m *articleSqlRepository) Update(articleID uint, updatedArticle interface{}) error {
	if err := m.DB.Debug().Model(&models.Articles{}).Where("deleted_at IS NULL").Where("id = ?", articleID).UpdateColumns(updatedArticle).Error; err != nil {
		return err
	}
	return nil
}

func (m *articleSqlRepository) Delete(articleID uint) error {

	fmt.Println("inside")
	if err := m.DB.Model(&models.Articles{}).Where("id = ?", articleID).Updates(map[string]interface{}{
		"deleted_at": time.Now(),
	}).Error; err != nil {
		return err
	}

	if err := m.DB.Where("articles_id = ?", articleID).Delete(&models.CollectionArticle{}).Error; err != nil {
		return err
	}

	return nil
}

func (m *articleSqlRepository) FindArticlesWithSimilarTitles(name string) ([]models.Articles, error) {
	var articles []models.Articles
	if err := m.DB.Where("name LIKE ?", "%"+name+"%").Find(&articles).Error; err != nil {
		return articles, err
	}
	return articles, nil
}
