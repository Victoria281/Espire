package services

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"sort"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/repo"
	"github.com/gocolly/colly/v2"
	"github.com/jdkato/prose/v2"
	"google.golang.org/api/customsearch/v1"
	"google.golang.org/api/option"
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
	FetchArticlesFromGoogleSearch(query string) ([]ArticleSearch, error)
	GetArticleInfoAndSuggestTags(url string) (*models.Articles, error)
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
		Date:           article.Date,
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
		Date:        article.Date,
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

func (s *articleService) FetchArticlesFromGoogleSearch(query string) ([]ArticleSearch, error) {
	googleAPIKey := os.Getenv("GOOGLE_API_KEY")
	googleSearchCX := os.Getenv("CUSTOM_SEARCH_ENGINE_ID")
	var articleSearch []ArticleSearch

	ctx := context.Background()
	service, err := customsearch.NewService(ctx, option.WithAPIKey(googleAPIKey))
	if err != nil {
		return articleSearch, err
	}

	search := service.Cse.List().
		Q(query + " articles").
		Cx(googleSearchCX)

	call, err := search.Do()
	if err != nil {
		return articleSearch, err
	}

	for _, item := range call.Items {
		title := item.Title
		link := item.Link
		snippet := item.Snippet

		description, date, err := fetchAdditionalInfo(link)
		if err != nil {
			description = snippet
			date = "No date available"
		}

		article := ArticleSearch{
			Title:       title,
			Authors:     "NA",
			Description: description,
			Link:        link,
			Date:        date,
		}
		articleSearch = append(articleSearch, article)
	}

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

func (s *articleService) GetArticleInfoAndSuggestTags(url string) (*models.Articles, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("failed to fetch the article")
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return nil, err
	}

	title := doc.Find("title").Text()
	if title == "" {
		return nil, errors.New("failed to find the article title")
	}

	author := doc.Find("meta[name='author']").AttrOr("content", "No author available")
	description := doc.Find("meta[name='description']").AttrOr("content", "No description available")
	publishedDateStr := doc.Find("meta[name='date']").AttrOr("content", "No date available")

	contentBuilder := strings.Builder{}
	doc.Find("p").Each(func(i int, s *goquery.Selection) {
		contentBuilder.WriteString(s.Text() + "\n")
	})
	content := contentBuilder.String()

	tags, err := extractTagsUsingProse(content)
	if err != nil {
		return nil, err
	}

	var publishedDate time.Time
	var parseErr error
	if publishedDateStr != "No date available" {
		publishedDate, parseErr = time.Parse(time.RFC3339, publishedDateStr)
		if parseErr != nil {
			return nil, fmt.Errorf("failed to parse published date: %v", parseErr)
		}
	} else {
		// Fallback to the current time if the date is not available
		publishedDate = time.Now()
	}

	article := &models.Articles{
		Name:        title,
		Authors:     author,
		Description: description,
		Use:         content,
		Date:        publishedDate,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
		Tags:        tags,
		Links: []models.ArticleLinks{
			{IsMain: true, Link: url},
		},
	}

	return article, nil
}
func extractTagsUsingProse(content string) ([]models.Tag, error) {
	doc, err := prose.NewDocument(content)
	if err != nil {
		return nil, err
	}

	keywords := make(map[string]int)
	for _, token := range doc.Tokens() {
		if token.Tag == "NN" || token.Tag == "NNS" || token.Tag == "JJ" {
			if len(token.Text) >= 2 {
				keywords[token.Text]++
			}
		}
	}

	type kv struct {
		Key   string
		Value int
	}
	var sortedKeywords []kv
	for k, v := range keywords {
		sortedKeywords = append(sortedKeywords, kv{k, v})
	}
	sort.Slice(sortedKeywords, func(i, j int) bool {
		return sortedKeywords[i].Value > sortedKeywords[j].Value
	})

	tags := make([]models.Tag, 0, 5)
	for i, kv := range sortedKeywords {
		if i >= 5 {
			break
		}
		tags = append(tags, models.Tag{Name: kv.Key})
	}

	return tags, nil
}

func extractTagsFromContent(content string) []models.Tag {
	stopWords := map[string]bool{
		"the": true, "and": true, "is": true, "in": true, "to": true, "of": true, "a": true, "with": true, "that": true, "for": true,
	}

	words := strings.Fields(content)
	wordFrequency := make(map[string]int)

	for _, word := range words {
		word = strings.ToLower(strings.Trim(word, ".,!?\"'"))
		if !stopWords[word] {
			wordFrequency[word]++
		}
	}

	var tags []models.Tag
	for word, freq := range wordFrequency {
		if freq > 1 {
			tags = append(tags, models.Tag{Name: word, ID: 0})
		}
	}
	return tags
}
