package models

import (
	"time"

	"gorm.io/gorm"
)

type Users struct {
	Username       string     `gorm:"primaryKey;unique" json:"username"`
	Password       []byte     `json:"password"`
	Role           string     `gorm:"default:user" json:"role"`
	CreatedAt      time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"createdat"`
	UpdatedAt      time.Time  `gorm:"default:CURRENT_TIMESTAMP" json:"updatedat"`
	DeletedAt      *time.Time `json:"deletedat"`
	Articles       []Articles `gorm:"foreignKey:Username;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	ForkedArticles []Articles `gorm:"foreignKey:ParentUsername;constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}

func MigrateUser(db *gorm.DB) error {
	err := db.AutoMigrate(&Users{})
	return err
}
