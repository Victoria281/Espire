package services

import (
	"fmt"
	"net/http"
	"net/url"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/repo"
	"gorm.io/gorm"
)

type ArticleService interface {
	FindById(id uint) (models.Articles, error)
	FindByUsername(username string) ([]models.Articles, error)
	FindByName(name string) ([]models.Articles, error)
	CreateNewArticle(username string, article models.Articles) (uint, error)
	UpdateArticle(username string, id uint, article *models.Articles) error
	DeleteArticle(id uint) error
	FetchArticlesFromGoogleScholar(query string) ([]ArticleSearch, error)
	FindArticlesWithSimilarTitles(query string) ([]models.Articles, error)
}

type ArticleSearch struct {
	Title    string `json:"title"`
	Authors  string `json:"authors"`
	Abstract string `json:"abstract"`
	Link     string `json:"link"`
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

func (s *articleService) CreateNewArticle(username string, article models.Articles) (uint, error) {

	newArticle := models.Articles{
		Username:       username,
		ParentUsername: nil,
		Name:           article.Name,
		Authors:        article.Authors,
		Use:            article.Use,
		Description:    article.Description,
	}
	return s.repo.CreateArticle(newArticle)
}

func (s *articleService) UpdateArticle(username string, id uint, article *models.Articles) error {
	updatedArticle := &models.Articles{
		Username:    username,
		ID:          id,
		Name:        article.Name,
		Authors:     article.Authors,
		Use:         article.Use,
		Description: article.Description,
		UpdatedAt:   time.Now(),
	}
	err := s.repo.Update(article.ID, updatedArticle)
	return err
}

func (s *articleService) DeleteArticle(id uint) error {
	fmt.Println("deleting")
	err := s.repo.Delete(id)
	return err
}

func (s *articleService) FindArticlesWithSimilarTitles(query string) ([]models.Articles, error) {
	return s.repo.FindArticlesWithSimilarTitles(query)
}

func (s *articleService) FetchArticlesFromGoogleScholar(query string) ([]ArticleSearch, error) {
	var articleSearch []ArticleSearch

	resp, err := http.Get("https://scholar.google.com/scholar?q=" + url.QueryEscape(query))
	if err != nil {
		return articleSearch, err
	}
	defer resp.Body.Close()

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return articleSearch, err
	}

	doc.Find(".gs_ri").Each(func(i int, s *goquery.Selection) {
		title := s.Find(".gs_rt").Text()
		authors := s.Find(".gs_a").Text()
		abstract := s.Find(".gs_rs").Text()
		link, _ := s.Find(".gs_rt a").Attr("href")

		article := ArticleSearch{
			Title:    title,
			Authors:  authors,
			Abstract: abstract,
			Link:     link,
		}
		articleSearch = append(articleSearch, article)
	})

	return articleSearch, nil
}
