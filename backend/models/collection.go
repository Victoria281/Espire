package models

import (
	"time"

	"gorm.io/gorm"
)

type Collection struct {
	ID        uint       `gorm:"primaryKey"`
	Username  string     `json:"username"`
	Name      string     `json:"name"`
	CreatedAt time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"createdat"`
	UpdatedAt time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"updatedat"`
	DeletedAt *time.Time `json:"deletedat"`
	Articles  []Articles `gorm:"many2many:collection_articles;"`
}

type CollectionArticle struct {
	CollectionID uint `gorm:"primaryKey"`
	ArticlesID   uint `gorm:"primaryKey"`
}

func MigrateCollection(db *gorm.DB) error {
	err := db.AutoMigrate(&Collection{})
	return err
}
