package repo

import (
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/storage"

	"gorm.io/gorm"
)

type UserRepository interface {
	SelectByUsername(username string) (*models.Users, error)
	InsertUser(user models.Users) error
	Update(user *models.Users) error
}

type userSqlRepository struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userSqlRepository{DB: storage.GetDB()}
}

func (m *userSqlRepository) SelectByUsername(username string) (*models.Users, error) {
	var user models.Users
	if err := m.DB.Where("username = ?", username).Where("deleted_at IS NULL").First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (m *userSqlRepository) InsertUser(user models.Users) error {
	if err := m.DB.Create(&user).Error; err != nil {
		return err
	}
	return nil
}

func (m *userSqlRepository) Update(user *models.Users) error {
	if err := m.DB.Where("deleted_at IS NULL").Save(user).Error; err != nil {
		return err
	}
	return nil
}
