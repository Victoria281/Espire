package repo

import (
	"fmt"

	"github.com/Victoria281/Espire/backend/models"
	"gorm.io/gorm"
)

type CollectionUserRepository interface {
	SearchUser(query string) ([]struct {
		Username string `json:"username"`
	}, error)
	InviteUser(collectionID uint, username string) error
	RemoveUser(collectionID uint, username string) error
	GetInvitedUsers(collectionID uint) ([]struct {
		Username string `json:"username"`
	}, error)
	GetSharedCollections(username string) ([]models.Collection, error)
}

type collectionUserSqlRepository struct {
	DB *gorm.DB
}

func NewCollectionUserRepository(db *gorm.DB) CollectionUserRepository {
	return &collectionUserSqlRepository{DB: db}
}

func (r *collectionUserSqlRepository) SearchUser(query string) ([]struct {
	Username string `json:"username"`
}, error) {
	var users []struct {
		Username string `json:"username"`
	}

	if err := r.DB.Model(&models.Users{}).Select("user_id, username").Where("username LIKE ?", "%"+query+"%").Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (r *collectionUserSqlRepository) InviteUser(collectionID uint, username string) error {
	var user models.Users
	if err := r.DB.Where("username = ?", username).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return fmt.Errorf("user not found")
		}
		return err
	}

	var existingEntry models.CollectionUser
	result := r.DB.Where("collection_id = ? AND users_username = ?", collectionID, username).First(&existingEntry)
	if result.Error == nil {
		return fmt.Errorf("user already invited")
	}
	if result.Error != gorm.ErrRecordNotFound {
		return result.Error
	}

	newEntry := models.CollectionUser{
		UsersUsername: username,
		CollectionID:  collectionID,
	}
	return r.DB.Create(&newEntry).Error
}

func (r *collectionUserSqlRepository) RemoveUser(collectionID uint, username string) error {
	var user models.Users
	if err := r.DB.Where("username = ?", username).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return fmt.Errorf("user not found")
		}
		return err
	}

	result := r.DB.Where("collection_id = ? AND users_username = ?", collectionID, username).Delete(&models.CollectionUser{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("user not found in the collection")
	}
	return nil
}

func (r *collectionUserSqlRepository) GetInvitedUsers(collectionID uint) ([]struct {
	Username string `json:"username"`
}, error) {
	var invitedUsers []struct {
		Username string `json:"username"`
	}

	if err := r.DB.Model(&models.CollectionUser{}).
		Select("users_username AS username").
		Where("collection_id = ?", collectionID).
		Find(&invitedUsers).Error; err != nil {
		return nil, err
	}
	return invitedUsers, nil
}

func (r *collectionUserSqlRepository) GetSharedCollections(username string) ([]models.Collection, error) {
	var collections []models.Collection

	err := r.DB.Preload("Articles").Preload("Articles.Links").Preload("Articles.Quotes").Preload("Articles.Flashcards").Preload("Articles.Tags").Preload("Synthesis").Joins("JOIN collection_users ON collection_users.collection_id = collections.id").
		Where("collection_users.users_username = ?", username).
		Find(&collections).Error
	if err != nil {
		return nil, err
	}
	return collections, nil
}
