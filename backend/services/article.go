package services

import (
	"fmt"
	"time"

	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/repo"
	"gorm.io/gorm"
)

type ArticleService interface {
	FindById(id uint) (models.Articles, error)
	FindByUsername(username string) ([]models.Articles, error)
	FindByName(name string) ([]models.Articles, error)
	CreateNewArticle(username string, article models.Articles) error
	UpdateArticle(article models.Articles) error
	DeleteArticle(id uint) error
}

type articleService struct {
	repo repo.ArticleRepository
}

func NewArticleService(repo repo.ArticleRepository) ArticleService {
	return &articleService{
		repo: repo,
	}
}

func (s *articleService) FindById(id uint) (models.Articles, error) {
	articles, err := s.repo.SelectByField("id", id)
	if err != nil {
		return models.Articles{}, err
	}
	if len(articles) == 0 {
		return models.Articles{}, gorm.ErrRecordNotFound
	}
	return articles[0], nil
}

func (s *articleService) FindByUsername(username string) ([]models.Articles, error) {
	articles, err := s.repo.SelectByField("username", username)
	if err != nil {
		return []models.Articles{}, err
	}
	if len(articles) == 0 {
		return []models.Articles{}, gorm.ErrRecordNotFound
	}
	return articles, nil
}

func (s *articleService) FindByName(name string) ([]models.Articles, error) {
	articles, err := s.repo.SelectByField("name", name)
	if err != nil {
		return []models.Articles{}, err
	}
	if len(articles) == 0 {
		return []models.Articles{}, gorm.ErrRecordNotFound
	}
	return articles, nil
}

func (s *articleService) CreateNewArticle(username string, article models.Articles) error {

	newArticle := models.Articles{
		Username:       username,
		ParentUsername: nil,
		Name:           article.Name,
		Use:            article.Use,
		Description:    article.Description,
	}
	err := s.repo.CreateArticle(newArticle)
	return err
}

func (s *articleService) UpdateArticle(article models.Articles) error {
	article.UpdatedAt = time.Now()

	err := s.repo.Update(article.ID, &article)
	return err
}

func (s *articleService) DeleteArticle(id uint) error {
	fmt.Println("deleting")
	err := s.repo.Delete(id)
	return err
}
