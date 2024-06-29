package services

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/repo"
	"github.com/gocolly/colly/v2"
	"gorm.io/gorm"
)

type ArticleService interface {
	GetAllArticles() ([]models.Articles, error)
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
	Title       string `json:"title"`
	Authors     string `json:"authors"`
	Description string `json:"description"`
	Link        string `json:"link"`
	Date        string `json:"date"`
}

type articleService struct {
	repo repo.ArticleRepository
}

func NewArticleService(repo repo.ArticleRepository) ArticleService {
	return &articleService{
		repo: repo,
	}
}

func (s *articleService) GetAllArticles() ([]models.Articles, error) {
	return s.repo.GetAllArticles()
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
	return s.repo.Create(newArticle)
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
	err := s.repo.Update(id, updatedArticle)
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
		short_description := s.Find(".gs_rs").Text()
		link, _ := s.Find(".gs_rt a").Attr("href")

		var description string
		var date string

		if link != "" {
			description, date, err = fetchAdditionalInfo(link)
			if err != nil {
				description = short_description
				date = "No date available"
			}
		}

		article := ArticleSearch{
			Title:       title,
			Authors:     authors,
			Description: description,
			Link:        link,
			Date:        date,
		}
		articleSearch = append(articleSearch, article)
	})

	return articleSearch, nil
}

func fetchAdditionalInfo(link string) (string, string, error) {
	var description, date string

	c := colly.NewCollector(
		colly.UserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"),
	)

	c.OnHTML("meta[name='description']", func(e *colly.HTMLElement) {
		description = e.Attr("content")
	})

	c.OnHTML("time", func(e *colly.HTMLElement) {
		date = e.Text
	})

	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL.String())
	})

	c.OnError(func(r *colly.Response, err error) {
		log.Println("Request error:", err)
	})

	err := c.Visit(link)
	if err != nil {
		return "", "", err
	}

	if description == "" {
		description = "No description available"
	}
	if date == "" {
		date = "No date available"
	}

	return description, date, nil
}
