package repo

import (
	"fmt"
	"time"

	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/storage"

	"gorm.io/gorm"
)

const defaultCheck = "deleted_at IS NULL"

type ArticleDetails struct {
	ArticleID       uint      `json:"article_id"`
	TotalVisitCount int       `json:"total_visit_count"`
	CreatedAt       time.Time `json:"created_at"`
}

type ArticleRepository interface {
	GetAllArticles() ([]models.Articles, error)
	SelectByField(field string, value interface{}) ([]models.Articles, error)
	Create(article models.Articles) (uint, error)
	Update(articleID uint, updatedArticle interface{}) error
	Delete(articleID uint) error
	FindArticlesWithSimilarTitles(string) ([]models.Articles, error)
	FindArticlesByTagIDs(tagIDs []uint) ([]models.Articles, error)
	GetArticlesDetails(articleIDs []uint) (map[uint]ArticleDetails, error)
}

type articleSqlRepository struct {
	DB *gorm.DB
}

func NewArticleRepository(db *gorm.DB) ArticleRepository {
	return &articleSqlRepository{DB: storage.GetDB()}
}

func (m *articleSqlRepository) GetArticlesDetails(articleIDs []uint) (map[uint]ArticleDetails, error) {
	var articles []models.Articles
	err := m.DB.Where("id IN ?", articleIDs).Find(&articles).Error
	if err != nil {
		return nil, err
	}

	var visits []models.UserArticleVisit
	err = m.DB.Where("article_id IN ?", articleIDs).Find(&visits).Error
	if err != nil {
		return nil, err
	}

	visitCounts := make(map[uint]int)
	for _, visit := range visits {
		visitCounts[visit.ArticleID] += visit.Visit
	}

	articleDetails := make(map[uint]ArticleDetails)
	for _, article := range articles {
		articleDetails[article.ID] = ArticleDetails{
			ArticleID:       article.ID,
			TotalVisitCount: visitCounts[article.ID],
			CreatedAt:       article.CreatedAt,
		}
	}

	return articleDetails, nil
}

func (m *articleSqlRepository) GetAllArticles() ([]models.Articles, error) {
	var articles []models.Articles
	err := m.DB.Preload("Tags").Find(&articles).Error
	return articles, err
}

func (m *articleSqlRepository) SelectByField(field string, value interface{}) ([]models.Articles, error) {
	var articles []models.Articles
	if err := m.DB.Preload("Links").Preload("Quotes").Preload("Flashcards").Preload("Collections").Preload("Tags").Where(field+" = ?", value).Where(defaultCheck).Find(&articles).Error; err != nil {
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

func (r *articleSqlRepository) FindArticlesByTagIDs(tagIDs []uint) ([]models.Articles, error) {
	var articles []models.Articles
	err := r.DB.Joins("JOIN article_tags ON articles.id = article_tags.article_id").
		Where("article_tags.tag_id IN (?)", tagIDs).Find(&articles).Error
	return articles, err
}
