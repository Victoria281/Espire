package models

import (
	"time"

	"gorm.io/gorm"
)

type Tag struct {
	ID        uint       `gorm:"primaryKey"`
	Name      string     `json:"name"`
	Articles  []Articles `gorm:"many2many:tag_articles;"`
	CreatedAt time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"createdat"`
	DeletedAt *time.Time `json:"deletedat"`
}

type TagArticles struct {
	TagID      uint `gorm:"primaryKey"`
	ArticlesID uint `gorm:"primaryKey"`
}

func MigrateTag(db *gorm.DB) error {
	err := db.AutoMigrate(&Tag{})
	return err
}
