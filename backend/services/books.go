package services

import (
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/repo"
)

type BookService interface {
	GetAll() []models.Books
	GetByID(id int64) models.Books
	GetByName(name string) models.Books
}

type bookService struct {
	repo repo.BookRepository
}

func NewBookService(repo repo.BookRepository) BookService {
	return &bookService{
		repo: repo,
	}
}

func (s *bookService) GetAll() []models.Books {
	return s.repo.Select("select * from books")
}

func (s *bookService) GetByID(id int64) models.Books {
	return s.repo.SelectById("select * from books where ID=?", id)
}

func (s *bookService) GetByName(name string) models.Books {
	return s.repo.SelectByName("select * from books where title=?", name)
}
