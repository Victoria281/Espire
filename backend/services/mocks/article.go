package mocks

import (
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/repo"
	"github.com/Victoria281/Espire/backend/services"
	"github.com/stretchr/testify/mock"
)

type ArticleService struct {
	mock.Mock
}

func (m *ArticleService) GetOtherArticles(username string) ([]models.Articles, error) {
	args := m.Called(username)
	return args.Get(0).([]models.Articles), args.Error(1)
}

func (m *ArticleService) FindById(id uint) (models.Articles, error) {
	args := m.Called(id)
	return args.Get(0).(models.Articles), args.Error(1)
}

func (m *ArticleService) FindByUsername(username string) ([]models.Articles, error) {
	args := m.Called(username)
	return args.Get(0).([]models.Articles), args.Error(1)
}

func (m *ArticleService) FindByName(name string) ([]models.Articles, error) {
	args := m.Called(name)
	return args.Get(0).([]models.Articles), args.Error(1)
}

func (m *ArticleService) CreateNewArticle(username string, article models.Articles) (uint, error) {
	args := m.Called(username, article)
	return args.Get(0).(uint), args.Error(1)
}

func (m *ArticleService) UpdateArticle(username string, id uint, article *models.Articles) error {
	args := m.Called(username, id, article)
	return args.Error(0)
}

func (m *ArticleService) DeleteArticle(id uint) error {
	args := m.Called(id)
	return args.Error(0)
}

func (m *ArticleService) FetchArticlesFromGoogleScholar(query string) ([]services.ArticleSearch, error) {
	args := m.Called(query)
	return args.Get(0).([]services.ArticleSearch), args.Error(1)
}

func (m *ArticleService) FindArticlesWithSimilarTitles(username string, query string) ([]models.Articles, error) {
	args := m.Called(username, query)
	return args.Get(0).([]models.Articles), args.Error(1)
}

func (m *ArticleService) FetchArticlesFromGoogleSearch(query string) ([]services.ArticleSearch, error) {
	args := m.Called(query)
	return args.Get(0).([]services.ArticleSearch), args.Error(1)
}

func (m *ArticleService) GetArticleInfoAndSuggestTags(url string) (*models.Articles, error) {
	args := m.Called(url)
	return args.Get(0).(*models.Articles), args.Error(1)
}

func (m *ArticleService) GetArticlesDetails(articleIDs []uint) (map[uint]repo.ArticleDetails, error) {
	args := m.Called(articleIDs)
	return args.Get(0).(map[uint]repo.ArticleDetails), args.Error(1)
}

func (m *ArticleService) IsArticleSavedByUser(username string, articleID uint) (bool, error) {
	args := m.Called(username, articleID)
	return args.Get(0).(bool), args.Error(1)
}
