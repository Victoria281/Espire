package models

import (
	"time"

	"gorm.io/gorm"
)

type Users struct {
	UserID         uint       `gorm:"autoIncrement;unique" json:"user_id"`
	Username       string     `gorm:"primaryKey;unique" json:"username"`
	Password       []byte     `json:"password"`
	Role           string     `gorm:"default:user" json:"role"`
	CreatedAt      time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"createdat"`
	UpdatedAt      time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"updatedat"`
	DeletedAt      *time.Time `json:"deletedat"`
	Articles       []Articles `gorm:"foreignKey:Username;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	ForkedArticles []Articles `gorm:"foreignKey:ParentUsername;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}

type UserArticleVisit struct {
	Username  string    `gorm:"not null" json:"username"`
	ArticleID uint      `gorm:"not null" json:"article_id"`
	VisitedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"visited_at"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"createdat"`
}

type UserTag struct {
	Username string `gorm:"not null" json:"username"`
	TagID    uint   `gorm:"not null" json:"tag_id"`
}

func MigrateUser(db *gorm.DB) error {
	if err := db.AutoMigrate(&Users{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&UserArticleVisit{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&UserTag{}); err != nil {
		return err
	}
	return nil
}
