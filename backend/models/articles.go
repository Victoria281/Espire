package models

import (
	"time"

	"gorm.io/gorm"
)

type Articles struct {
	ID             uint                `gorm:"primary_key;autoIncrement" json:"id"`
	Username       string              `json:"username"`
	ParentUsername *string             `json:"parentusername"`
	Name           string              `json:"name"`
	Authors        string              `json:"authors"`
	Use            string              `json:"use"`
	Description    string              `json:"description"`
	Date           time.Time           `gorm:"default:CURRENT_TIMESTAMP" json:"date"`
	CreatedAt      time.Time           `gorm:"default:CURRENT_TIMESTAMP" json:"createdat"`
	UpdatedAt      time.Time           `gorm:"default:CURRENT_TIMESTAMP" json:"updatedat"`
	DeletedAt      *time.Time          `json:"deletedat"`
	Links          []ArticleLinks      `gorm:"foreignKey:ArticleID"`
	Quotes         []ArticleQuotes     `gorm:"foreignKey:ArticleID"`
	Flashcards     []ArticleFlashcards `gorm:"foreignKey:ArticleID"`
	Collections    []Collection        `gorm:"many2many:collection_articles;"`
	Tags           []Tag               `gorm:"many2many:tag_articles;"`
}

type ArticleLinks struct {
	ID        uint       `gorm:"primary_key;autoIncrement" json:"id"`
	ArticleID uint       `json:"article_id"`
	IsMain    bool       `json:"is_main"`
	Link      string     `json:"link"`
	CreatedAt time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"createdat"`
	UpdatedAt time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"updatedat"`
	DeletedAt *time.Time `json:"deletedat"`
}

type ArticleQuotes struct {
	ID        uint       `gorm:"primary_key;autoIncrement" json:"id"`
	ArticleID uint       `json:"article_id"`
	GroupNum  int        `json:"grp_num"`
	Priority  int        `json:"priority"`
	Fact      string     `json:"fact"`
	CreatedAt time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"createdat"`
	UpdatedAt time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"updatedat"`
	DeletedAt *time.Time `json:"deletedat"`
}

type ArticleFlashcards struct {
	ID        uint       `gorm:"primary_key;autoIncrement" json:"id"`
	ArticleID uint       `json:"article_id"`
	Answer    string     `json:"answer"`
	Question  string     `json:"question"`
	Tries     int        `gorm:"default:0" json:"tries"`
	Wrong     int        `gorm:"default:0" json:"wrong"`
	CreatedAt time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"createdat"`
	UpdatedAt time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"updatedat"`
	DeletedAt *time.Time `json:"deletedat"`
}

func MigrateArticle(db *gorm.DB) error {
	if err := db.AutoMigrate(&Articles{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&ArticleLinks{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&ArticleQuotes{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&ArticleFlashcards{}); err != nil {
		return err
	}
	return nil
}
