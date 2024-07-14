package models

import (
	"time"

	"gorm.io/gorm"
)

type Collection struct {
	ID        uint        `gorm:"primaryKey"`
	Username  string      `json:"username"`
	Name      string      `json:"name"`
	CreatedAt time.Time   `gorm:"default:CURRENT_TIMESTAMP" json:"createdat"`
	UpdatedAt time.Time   `gorm:"default:CURRENT_TIMESTAMP" json:"updatedat"`
	DeletedAt *time.Time  `json:"deletedat"`
	Articles  []Articles  `gorm:"many2many:collection_articles;"`
	Synthesis []Synthesis `gorm:"many2many:collection_synthesis;"`
}

type Synthesis struct {
	ID           uint       `gorm:"primaryKey"`
	CollectionID uint       `json:"collectionid"`
	Key          string     `json:"key"`
	Text         string     `json:"text"`
	CreatedAt    time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"createdat"`
	UpdatedAt    time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"updatedat"`
	DeletedAt    *time.Time `json:"deletedat"`
	Collection   Collection `gorm:"foreignKey:CollectionID"`
}

type CollectionArticle struct {
	CollectionID uint `gorm:"primaryKey"`
	ArticlesID   uint `gorm:"primaryKey"`
}

func MigrateCollection(db *gorm.DB) error {
	if err := db.AutoMigrate(&Collection{}); err != nil {
		return err
	}
	if err := db.AutoMigrate(&Synthesis{}); err != nil {
		return err
	}
	return nil
}
