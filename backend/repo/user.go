package repo

import (
	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/storage"

	"gorm.io/gorm"
)

type UserRepository interface {
	GetUserIndex(username string) (uint, error)
	SelectByUsername(username string) (*models.Users, error)
	InsertUser(user models.Users) error
	Update(user *models.Users) error

	AddUserTag(username string, tagID uint) error
	RemoveUserTag(username string, tagID uint) error
	AddUserArticleVisit(username string, articleID uint) error
	GetUserArticleVisits(username string, limit int) ([]models.UserArticleVisit, error)
	GetUserTags(username string) ([]struct {
		ID   uint   `json:"id"`
		Name string `json:"name"`
	}, error)
	FetchUserVisitScores(username string, articleIDs []uint) (map[uint]int, error)
}

type userSqlRepository struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userSqlRepository{DB: storage.GetDB()}
}

func (m *userSqlRepository) GetUserIndex(username string) (uint, error) {
	user, err := m.SelectByUsername(username)
	if err != nil {
		return 0, err
	}
	return user.UserID, nil
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

func (m *userSqlRepository) AddUserTag(username string, tagID uint) error {
	userTag := models.UserTag{Username: username, TagID: tagID}
	if err := m.DB.Create(&userTag).Error; err != nil {
		return err
	}
	return nil
}

func (m *userSqlRepository) RemoveUserTag(username string, tagID uint) error {
	if err := m.DB.Where("username = ? AND tag_id = ?", username, tagID).Delete(&models.UserTag{}).Error; err != nil {
		return err
	}
	return nil
}

func (m *userSqlRepository) AddUserArticleVisit(username string, articleID uint) error {
	var visit models.UserArticleVisit

	// Check if a visit record already exists for this user and article
	result := m.DB.Where("username = ? AND article_id = ?", username, articleID).First(&visit)
	if result.Error != nil && result.Error != gorm.ErrRecordNotFound {
		return result.Error
	}

	if result.RowsAffected > 0 {
		// Record exists, update the visit count
		visit.Visit++
		if err := m.DB.Save(&visit).Error; err != nil {
			return err
		}
	} else {
		// Record does not exist, create a new one with visit count set to 1
		visit = models.UserArticleVisit{
			Username:  username,
			ArticleID: articleID,
			Visit:     1,
		}
		if err := m.DB.Create(&visit).Error; err != nil {
			return err
		}
	}
	return nil
}

func (m *userSqlRepository) GetUserArticleVisits(username string, limit int) ([]models.UserArticleVisit, error) {
	var visits []models.UserArticleVisit
	if err := m.DB.Where("username = ?", username).Order("visit DESC").Limit(limit).Find(&visits).Error; err != nil {
		return nil, err
	}
	return visits, nil
}

func (m *userSqlRepository) FetchUserVisitScores(username string, articleIDs []uint) (map[uint]int, error) {
	var visits []models.UserArticleVisit
	err := m.DB.Where("username = ? AND article_id IN ?", username, articleIDs).Find(&visits).Error
	if err != nil {
		return nil, err
	}

	visitScores := make(map[uint]int)
	for _, visit := range visits {
		visitScores[visit.ArticleID] = visit.Visit
	}

	return visitScores, nil
}

func (m *userSqlRepository) GetUserTags(username string) ([]struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}, error) {
	var tags []struct {
		ID   uint   `json:"id"`
		Name string `json:"name"`
	}

	err := m.DB.
		Table("user_tags").
		Select("tags.id, tags.name").
		Joins("JOIN tags ON user_tags.tag_id = tags.id").
		Where("user_tags.username = ?", username).
		Scan(&tags).
		Error

	if err != nil {
		return nil, err
	}

	return tags, nil
}
